# GraphQL Setup Guide - Frontend

This document explains how to connect to the Analytics GraphQL API.

---

## Quick Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    GRAPHQL CONNECTION FLOW                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ Frontend App    │
└────────┬────────┘
         │
         │ POST /graphql
         │ Headers: Authorization: Bearer <token>
         │ Body: { query, variables }
         │
         ▼
┌─────────────────┐
│ GraphQL API     │
│ (NestJS)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Response        │
│ { data, errors }│
└─────────────────┘
```

---

## Endpoint

| Property     | Value              |
| ------------ | ------------------ |
| URL          | `POST /graphql`    |
| Protocol     | HTTP/HTTPS         |
| Content-Type | `application/json` |

---

## Authentication

Use the same JWT token as REST API.

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### What Happens Without Token

```
Response (401):
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

---

## Request Format

### Structure

```
POST /graphql

{
  "query": "<GraphQL query string>",
  "variables": { <variables object> },
  "operationName": "<optional operation name>"
}
```

### Example: Basic Query

```
POST /graphql
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "query": "query GetRevenue($period: PeriodInput!) { revenue: kpiMetric(type: REVENUE, period: $period) { value change } }",
  "variables": {
    "period": {
      "type": "TODAY"
    }
  }
}
```

### Example: Multiple Queries in One Request

```
{
  "query": "
    query Dashboard($period: PeriodInput!, $branchId: Int) {
      revenue: kpiMetric(type: REVENUE, period: $period, branchId: $branchId) {
        value
        previousValue
        changePercent
        trend
      }
      orders: kpiMetric(type: ORDERS, period: $period, branchId: $branchId) {
        value
        previousValue
        changePercent
        trend
      }
      topProducts: rankedList(
        dataset: PRODUCTS
        period: $period
        branchId: $branchId
        limit: 5
      ) {
        rank
        name
        value
        percentage
      }
    }
  ",
  "variables": {
    "period": { "type": "TODAY" },
    "branchId": 1
  }
}
```

---

## Response Format

### Success Response

```
{
  "data": {
    "revenue": {
      "value": 12500000,
      "previousValue": 11200000,
      "changePercent": 11.6,
      "trend": "UP"
    },
    "orders": {
      "value": 356,
      "previousValue": 320,
      "changePercent": 11.25,
      "trend": "UP"
    },
    "topProducts": [
      { "rank": 1, "name": "Margherita Pizza", "value": 2100000, "percentage": 16.8 },
      { "rank": 2, "name": "Pepperoni Pizza", "value": 1850000, "percentage": 14.8 }
    ]
  }
}
```

### Partial Success (Some Fields Failed)

```
{
  "data": {
    "revenue": {
      "value": 12500000,
      "changePercent": 11.6
    },
    "topProducts": null  // This field failed
  },
  "errors": [
    {
      "message": "Failed to load product data",
      "path": ["topProducts"],
      "extensions": {
        "code": "INTERNAL_ERROR"
      }
    }
  ]
}
```

### Full Error Response

```
{
  "data": null,
  "errors": [
    {
      "message": "Invalid period type",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "field": "period.type"
      }
    }
  ]
}
```

---

## Error Codes

| Code            | Meaning                  | What to Do                          |
| --------------- | ------------------------ | ----------------------------------- |
| UNAUTHENTICATED | Token missing or invalid | Redirect to login                   |
| FORBIDDEN       | User lacks permission    | Show "Access Denied"                |
| BAD_USER_INPUT  | Invalid query parameters | Show validation error               |
| INTERNAL_ERROR  | Server error             | Show "Something went wrong" + retry |
| NOT_FOUND       | Resource not found       | Show "Not found" message            |

---

## Common Input Types

### PeriodInput

```
input PeriodInput {
  type: PeriodType!
  customStart: String  # ISO date, required if type = CUSTOM
  customEnd: String    # ISO date, required if type = CUSTOM
}

enum PeriodType {
  TODAY
  YESTERDAY
  THIS_WEEK
  LAST_WEEK
  THIS_MONTH
  LAST_MONTH
  LAST_7_DAYS
  LAST_30_DAYS
  CUSTOM
}
```

### Usage Examples

```
# Today
{ "type": "TODAY" }

# Last 7 days
{ "type": "LAST_7_DAYS" }

# Custom range
{
  "type": "CUSTOM",
  "customStart": "2025-12-01",
  "customEnd": "2025-12-10"
}
```

### KpiType

```
enum KpiType {
  REVENUE
  ORDERS
  AVG_CHECK
  NEW_CUSTOMERS
  RETURNING_CUSTOMERS
  TIPS
  REFUNDS
  CANCELLATIONS
  MARGIN  # Premium only
}
```

### Dataset

```
enum Dataset {
  ORDERS
  PRODUCTS
  STAFF
  CHANNELS
  GUESTS
}
```

### GroupBy

```
enum GroupBy {
  HOUR
  DAY
  WEEK
  MONTH
}
```

---

## Handling Branch Scope

### Single Branch (Default)

If branchId is provided, data is filtered to that branch.

```
query {
  revenue: kpiMetric(type: REVENUE, period: $period, branchId: 1) {
    value
  }
}
```

### All Branches

If branchId is null or omitted, returns aggregated data across all user's branches.

```
query {
  revenue: kpiMetric(type: REVENUE, period: $period) {
    value  # Sum across all branches
  }
}
```

### Branch in Response

Some queries return branch info when in "all branches" mode:

```
query {
  recentOrders(limit: 10) {
    orderId
    total
    branch {  # Included when viewing all branches
      id
      name
    }
  }
}
```

---

## Performance Best Practices

### 1. Request Only What You Need

```
# Good - only request visible widgets
query Dashboard {
  revenue: kpiMetric(type: REVENUE, period: $period) { value, change }
  orders: kpiMetric(type: ORDERS, period: $period) { value, change }
  # topProducts not requested if widget is hidden
}

# Bad - request everything regardless of visibility
query Dashboard {
  revenue { ... }
  orders { ... }
  avgCheck { ... }
  topProducts { ... }  # User disabled this widget
  recentOrders { ... } # User disabled this widget
}
```

### 2. Use Fragments for Reusable Fields

```
fragment KpiFields on KpiMetric {
  value
  previousValue
  changePercent
  trend
}

query Dashboard($period: PeriodInput!) {
  revenue: kpiMetric(type: REVENUE, period: $period) { ...KpiFields }
  orders: kpiMetric(type: ORDERS, period: $period) { ...KpiFields }
  avgCheck: kpiMetric(type: AVG_CHECK, period: $period) { ...KpiFields }
}
```

### 3. Batch Multiple Queries

Instead of:

```
# Request 1
query { revenue { value } }

# Request 2
query { orders { value } }

# Request 3
query { topProducts { ... } }
```

Do:

```
# Single request
query {
  revenue { value }
  orders { value }
  topProducts { ... }
}
```

---

## Loading Strategy

### Recommended: Load KPIs First

```
┌─────────────────────────────────────────────────────────────┐
│                    LOADING STRATEGY                         │
└─────────────────────────────────────────────────────────────┘

Step 1: Load KPIs (critical, fast)
─────────────────────────────────
query KPIs {
  revenue { value, change }
  orders { value, change }
  avgCheck { value, change }
}

UI: Show KPI cards with data, rest loading

Step 2: Load Chart (important, medium)
──────────────────────────────────────
query Chart {
  timeSeries(metric: REVENUE) {
    points { timestamp, value }
  }
}

UI: Show chart, widgets still loading

Step 3: Load Widgets (optional, can fail)
─────────────────────────────────────────
query Widgets {
  topProducts { ... }
  paymentBreakdown { ... }
  recentOrders { ... }
}

UI: Show all widgets
```

---

## Error Handling

### Handle Partial Failures

```
Pseudocode:

response = await graphqlClient.query(dashboardQuery)

if response.errors exist
    for each error in response.errors
        path = error.path  # e.g., ["topProducts"]

        if path = ["revenue"] or path = ["orders"]
            # Critical field failed
            SHOW: Full error screen with retry
        else
            # Non-critical field failed
            SHOW: Widget error state
            CONTINUE: Show other data

if response.data exists
    for each field in response.data
        if field = null
            SHOW: Widget empty/error state
        else
            SHOW: Widget with data
```

### Retry Logic

```
Pseudocode:

MAX_RETRIES = 3
RETRY_DELAY = 1000  # milliseconds

function fetchWithRetry(query, variables)
    attempt = 0

    while attempt < MAX_RETRIES
        response = await graphqlClient.query(query, variables)

        if response.errors exist
            errorCode = response.errors[0].extensions.code

            if errorCode = "INTERNAL_ERROR"
                attempt = attempt + 1
                wait RETRY_DELAY * attempt
                continue
            else
                # Non-retryable error
                return response

        return response

    # All retries failed
    return { errors: [{ message: "Failed after retries" }] }
```

---

## Caching

### Cache-Control Headers

Server returns cache hints:

```
Cache-Control: max-age=300  # 5 minutes for dashboard data
```

### Client-Side Caching

Recommended: Use Apollo Client or similar with built-in caching.

```
Cache Strategy:
- KPIs: Cache 1 minute, refetch on period change
- Charts: Cache 5 minutes
- Lists: Cache 5 minutes
- User switches branch: Clear cache
```

---

## Testing with GraphQL Playground

Access GraphQL Playground at: `GET /graphql`

### Setup

1. Open browser: `http://localhost:3000/graphql`
2. Add HTTP header:
   ```
   {
     "Authorization": "Bearer <your_token>"
   }
   ```
3. Write query in left panel
4. Click Play button
5. See response in right panel

### Example Test Query

```
query TestDashboard {
  revenue: kpiMetric(
    type: REVENUE
    period: { type: TODAY }
  ) {
    value
    previousValue
    changePercent
    trend
  }

  topProducts: rankedList(
    dataset: PRODUCTS
    period: { type: LAST_7_DAYS }
    limit: 5
  ) {
    rank
    name
    value
    percentage
  }
}
```

---

## FAQ

**Q: How do I get a token for testing?**
A: Use the login endpoint to get a token, then add it to GraphQL Playground headers.

**Q: What if I get CORS errors?**
A: GraphQL uses same CORS settings as REST. If REST works, GraphQL should work.

**Q: Can I use GET instead of POST?**
A: POST is recommended. GET is supported for simple queries but has URL length limits.

**Q: How do I see available queries?**
A: GraphQL Playground has auto-complete and docs panel on the right side.

**Q: What timezone are dates returned in?**
A: All timestamps are ISO 8601 in UTC. Convert to local on frontend.

**Q: Is there a rate limit?**
A: Same as REST API. 100 requests per minute per user.

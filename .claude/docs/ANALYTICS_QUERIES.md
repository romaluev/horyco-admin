# Analytics GraphQL Queries - Complete Reference

This document lists all available GraphQL queries for Analytics v2.

---

## Quick Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    QUERY CATEGORIES                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DASHBOARD QUERIES                                          │
│  ├── kpiMetric          Single KPI value                    │
│  ├── kpiWithBreakdown   KPI with sub-metrics                │
│  ├── kpiWithSparkline   KPI with mini chart                 │
│  ├── timeSeries         Chart data points                   │
│  ├── rankedList         Top/bottom items                    │
│  ├── proportions        Pie/donut data                      │
│  └── recentOrders       Latest orders list                  │
│                                                             │
│  ANALYTICS PAGE QUERIES                                     │
│  ├── ordersAnalytics    Orders page data                    │
│  ├── productsAnalytics  Products page data                  │
│  ├── channelsAnalytics  Channels page data                  │
│  ├── staffAnalytics     Staff page data                     │
│  └── visitorsAnalytics  Visitors page data                  │
│                                                             │
│  VIEWS QUERIES                                              │
│  ├── views              List saved views                    │
│  ├── view               Get single view                     │
│  ├── createView         Create new view                     │
│  ├── updateView         Update existing view                │
│  └── deleteView         Delete view                         │
│                                                             │
│  CONFIG QUERIES                                             │
│  ├── dashboardConfig    Get dashboard layout                │
│  └── saveDashboardConfig Save dashboard layout              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Input Types Reference

### PeriodInput

```
input PeriodInput {
  type: PeriodType!
  customStart: String  # Format: "YYYY-MM-DD"
  customEnd: String    # Format: "YYYY-MM-DD"
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
  LAST_90_DAYS
  THIS_YEAR
  CUSTOM
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
  MARGIN          # Premium only
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

### SortBy

```
enum SortBy {
  REVENUE
  ORDERS
  QUANTITY
  PERCENTAGE
}
```

### SortDirection

```
enum SortDirection {
  ASC
  DESC
}
```

---

## Dashboard Queries

### 1. kpiMetric

Get a single KPI with comparison.

**Query:**

```
query KpiMetric(
  $type: KpiType!
  $period: PeriodInput!
  $branchId: Int
) {
  kpiMetric(type: $type, period: $period, branchId: $branchId) {
    value
    previousValue
    changePercent
    trend
    formattedValue
    periodLabel
    comparisonLabel
  }
}
```

**Variables:**

```
{
  "type": "REVENUE",
  "period": { "type": "TODAY" },
  "branchId": 1
}
```

**Response:**

```
{
  "kpiMetric": {
    "value": 12500000,
    "previousValue": 11200000,
    "changePercent": 11.6,
    "trend": "UP",
    "formattedValue": "12,500,000",
    "periodLabel": "Today",
    "comparisonLabel": "vs yesterday"
  }
}
```

---

### 2. kpiWithBreakdown

Get KPI with sub-category breakdown.

**Query:**

```
query KpiWithBreakdown(
  $type: KpiType!
  $breakdownBy: String!
  $period: PeriodInput!
  $branchId: Int
) {
  kpiWithBreakdown(
    type: $type
    breakdownBy: $breakdownBy
    period: $period
    branchId: $branchId
  ) {
    total {
      value
      changePercent
      trend
    }
    breakdown {
      key
      label
      value
      percentage
      status
    }
  }
}
```

**Variables:**

```
{
  "type": "ORDERS",
  "breakdownBy": "channel",
  "period": { "type": "TODAY" }
}
```

**Response:**

```
{
  "kpiWithBreakdown": {
    "total": {
      "value": 356,
      "changePercent": 8.5,
      "trend": "UP"
    },
    "breakdown": [
      { "key": "POS", "label": "POS", "value": 250, "percentage": 70.2, "status": "good" },
      { "key": "WEB", "label": "Web", "value": 80, "percentage": 22.5, "status": "average" },
      { "key": "TELEGRAM", "label": "Telegram", "value": 26, "percentage": 7.3, "status": "average" }
    ]
  }
}
```

---

### 3. timeSeries

Get data points for charts.

**Query:**

```
query TimeSeries(
  $metric: KpiType!
  $period: PeriodInput!
  $groupBy: GroupBy
  $branchId: Int
) {
  timeSeries(
    metric: $metric
    period: $period
    groupBy: $groupBy
    branchId: $branchId
  ) {
    metric
    groupBy
    totalValue
    changePercent
    points {
      timestamp
      value
      label
      isHighlighted
    }
  }
}
```

**Variables:**

```
{
  "metric": "REVENUE",
  "period": { "type": "THIS_WEEK" },
  "groupBy": "DAY"
}
```

**Response:**

```
{
  "timeSeries": {
    "metric": "REVENUE",
    "groupBy": "DAY",
    "totalValue": 45000000,
    "changePercent": 12.5,
    "points": [
      { "timestamp": "2025-12-09T00:00:00Z", "value": 5800000, "label": "Mon", "isHighlighted": false },
      { "timestamp": "2025-12-10T00:00:00Z", "value": 7200000, "label": "Tue", "isHighlighted": false },
      { "timestamp": "2025-12-11T00:00:00Z", "value": 6500000, "label": "Wed", "isHighlighted": false },
      { "timestamp": "2025-12-12T00:00:00Z", "value": 8100000, "label": "Thu", "isHighlighted": true },
      { "timestamp": "2025-12-13T00:00:00Z", "value": 7400000, "label": "Fri", "isHighlighted": false }
    ]
  }
}
```

---

### 4. rankedList

Get sorted list of items (products, staff, etc).

**Query:**

```
query RankedList(
  $dataset: Dataset!
  $period: PeriodInput!
  $sortBy: SortBy
  $sortDirection: SortDirection
  $limit: Int
  $branchId: Int
) {
  rankedList(
    dataset: $dataset
    period: $period
    sortBy: $sortBy
    sortDirection: $sortDirection
    limit: $limit
    branchId: $branchId
  ) {
    rank
    id
    name
    value
    formattedValue
    percentage
    secondaryValue
    secondaryLabel
    color
  }
}
```

**Variables:**

```
{
  "dataset": "PRODUCTS",
  "period": { "type": "LAST_7_DAYS" },
  "sortBy": "REVENUE",
  "sortDirection": "DESC",
  "limit": 10
}
```

**Response:**

```
{
  "rankedList": [
    {
      "rank": 1,
      "id": 101,
      "name": "Margherita Pizza",
      "value": 2100000,
      "formattedValue": "2,100,000",
      "percentage": 16.8,
      "secondaryValue": 145,
      "secondaryLabel": "orders",
      "color": "#FF6B6B"
    },
    {
      "rank": 2,
      "id": 102,
      "name": "Pepperoni Pizza",
      "value": 1850000,
      "formattedValue": "1,850,000",
      "percentage": 14.8,
      "secondaryValue": 128,
      "secondaryLabel": "orders",
      "color": "#4ECDC4"
    }
  ]
}
```

---

### 5. proportions

Get data for pie/donut charts.

**Query:**

```
query Proportions(
  $dimension: String!
  $period: PeriodInput!
  $branchId: Int
) {
  proportions(
    dimension: $dimension
    period: $period
    branchId: $branchId
  ) {
    total
    formattedTotal
    segments {
      key
      label
      value
      percentage
      color
    }
  }
}
```

**Variables:**

```
{
  "dimension": "PAYMENT_METHOD",
  "period": { "type": "TODAY" }
}
```

**Response:**

```
{
  "proportions": {
    "total": 12500000,
    "formattedTotal": "12,500,000",
    "segments": [
      { "key": "CASH", "label": "Cash", "value": 5750000, "percentage": 46.0, "color": "#FF6B6B" },
      { "key": "CARD", "label": "Card", "value": 4750000, "percentage": 38.0, "color": "#4ECDC4" },
      { "key": "PAYME", "label": "Payme", "value": 1250000, "percentage": 10.0, "color": "#45B7D1" },
      { "key": "CLICK", "label": "Click", "value": 750000, "percentage": 6.0, "color": "#96CEB4" }
    ]
  }
}
```

---

### 6. recentOrders

Get latest orders.

**Query:**

```
query RecentOrders(
  $limit: Int!
  $branchId: Int
) {
  recentOrders(limit: $limit, branchId: $branchId) {
    orderId
    orderNumber
    createdAt
    total
    formattedTotal
    paymentMethod
    paymentStatus
    source
    customerName
    branch {
      id
      name
    }
  }
}
```

**Variables:**

```
{
  "limit": 10
}
```

**Response:**

```
{
  "recentOrders": [
    {
      "orderId": 1234,
      "orderNumber": "ORD-1234",
      "createdAt": "2025-12-13T14:32:10Z",
      "total": 560000,
      "formattedTotal": "560,000",
      "paymentMethod": "CARD",
      "paymentStatus": "PAID",
      "source": "POS",
      "customerName": "Guest",
      "branch": null
    }
  ]
}
```

---

## Analytics Page Queries

### ordersAnalytics

Full orders page data.

**Query:**

```
query OrdersAnalytics(
  $period: PeriodInput!
  $groupBy: GroupBy
  $filters: OrderFiltersInput
  $branchId: Int
) {
  ordersAnalytics(
    period: $period
    groupBy: $groupBy
    filters: $filters
    branchId: $branchId
  ) {
    summary {
      totalOrders
      totalRevenue
      avgCheck
      cancellationRate
    }
    timeSeries {
      points { timestamp, orders, revenue }
    }
    byChannel {
      channel
      orders
      revenue
      percentage
    }
    byDeliveryType {
      type
      orders
      revenue
      percentage
    }
    byPaymentMethod {
      method
      orders
      revenue
      percentage
    }
    byHour {
      hour
      orders
      revenue
    }
  }
}
```

---

### productsAnalytics

Full products page data.

**Query:**

```
query ProductsAnalytics(
  $period: PeriodInput!
  $sortBy: SortBy
  $filters: ProductFiltersInput
  $branchId: Int
  $limit: Int
) {
  productsAnalytics(
    period: $period
    sortBy: $sortBy
    filters: $filters
    branchId: $branchId
    limit: $limit
  ) {
    summary {
      totalProducts
      totalRevenue
      topCategory
    }
    products {
      id
      name
      categoryName
      quantity
      orders
      revenue
      percentage
      trend
    }
    byCategory {
      categoryId
      categoryName
      products
      revenue
      percentage
    }
  }
}
```

---

### staffAnalytics

Full staff page data.

**Query:**

```
query StaffAnalytics(
  $period: PeriodInput!
  $sortBy: SortBy
  $branchId: Int
) {
  staffAnalytics(
    period: $period
    sortBy: $sortBy
    branchId: $branchId
  ) {
    summary {
      totalStaff
      totalRevenue
      totalTips
      avgOrdersPerStaff
    }
    staff {
      employeeId
      employeeName
      role
      orders
      revenue
      tips
      avgCheck
      shiftsWorked
      hoursWorked
    }
  }
}
```

---

### visitorsAnalytics

Full visitors/guests page data.

**Query:**

```
query VisitorsAnalytics(
  $period: PeriodInput!
  $groupBy: GroupBy
  $branchId: Int
) {
  visitorsAnalytics(
    period: $period
    groupBy: $groupBy
    branchId: $branchId
  ) {
    summary {
      totalCustomers
      newCustomers
      returningCustomers
      newCustomerRate
    }
    trend {
      points { timestamp, newCustomers, returningCustomers }
    }
    bySource {
      source
      customers
      percentage
    }
    topCustomers {
      customerId
      name
      ordersCount
      totalSpent
      lastOrderDate
    }
  }
}
```

---

## Views Queries

### List Views

```
query Views($pageCode: String) {
  views(pageCode: $pageCode) {
    id
    name
    pageCode
    isDefault
    isPinned
    isShared
    createdAt
  }
}
```

### Get Single View

```
query View($id: ID!) {
  view(id: $id) {
    id
    name
    pageCode
    isDefault
    isPinned
    isShared
    config {
      timeframe
      filters
      columns
      groupBy
      sorting
      display
    }
    createdAt
    updatedAt
  }
}
```

### Create View

```
mutation CreateView($input: CreateViewInput!) {
  createView(input: $input) {
    id
    name
  }
}

# Input:
{
  "input": {
    "pageCode": "orders",
    "name": "Delivery Orders - Last Week",
    "config": {
      "timeframe": { "type": "LAST_7_DAYS" },
      "filters": { "deliveryType": ["DELIVERY"] },
      "columns": ["date", "orders", "revenue", "avgCheck"],
      "groupBy": "DAY",
      "sorting": { "column": "revenue", "direction": "DESC" }
    }
  }
}
```

### Update View

```
mutation UpdateView($id: ID!, $input: UpdateViewInput!) {
  updateView(id: $id, input: $input) {
    id
    name
  }
}
```

### Delete View

```
mutation DeleteView($id: ID!) {
  deleteView(id: $id) {
    success
  }
}
```

---

## Dashboard Config Queries

### Get Dashboard Config

```
query DashboardConfig {
  dashboardConfig {
    kpiSlots {
      position
      type
      visible
    }
    chartMetric
    chartGroupBy
    widgets {
      id
      type
      position
      config
    }
  }
}
```

### Save Dashboard Config

```
mutation SaveDashboardConfig($config: DashboardConfigInput!) {
  saveDashboardConfig(config: $config) {
    success
  }
}

# Input:
{
  "config": {
    "kpiSlots": [
      { "position": 0, "type": "REVENUE", "visible": true },
      { "position": 1, "type": "ORDERS", "visible": true },
      { "position": 2, "type": "AVG_CHECK", "visible": true },
      { "position": 3, "type": "NEW_CUSTOMERS", "visible": true }
    ],
    "chartMetric": "REVENUE",
    "chartGroupBy": null,
    "widgets": [
      { "id": "w1", "type": "TOP_PRODUCTS", "position": 0 },
      { "id": "w2", "type": "PAYMENT_METHODS", "position": 1 }
    ]
  }
}
```

---

## Export Queries (Premium)

### Export Data

```
mutation ExportData($input: ExportInput!) {
  exportData(input: $input) {
    downloadUrl
    expiresAt
    fileSize
    fileName
  }
}

# Input:
{
  "input": {
    "pageCode": "orders",
    "period": { "type": "LAST_30_DAYS" },
    "format": "XLSX",
    "filters": {}
  }
}
```

---

## Error Handling

### Error Response Format

```
{
  "data": null,
  "errors": [
    {
      "message": "Error description",
      "path": ["fieldName"],
      "extensions": {
        "code": "ERROR_CODE",
        "field": "fieldName"
      }
    }
  ]
}
```

### Common Error Codes

| Code             | Meaning            | Action                 |
| ---------------- | ------------------ | ---------------------- |
| UNAUTHENTICATED  | No valid token     | Redirect to login      |
| FORBIDDEN        | No permission      | Show access denied     |
| BAD_USER_INPUT   | Invalid parameters | Show validation error  |
| NOT_FOUND        | Resource not found | Show not found message |
| PREMIUM_REQUIRED | Premium feature    | Show upgrade prompt    |
| RATE_LIMITED     | Too many requests  | Show wait message      |
| INTERNAL_ERROR   | Server error       | Show error + retry     |

---

## FAQ

**Q: How do I request multiple KPIs in one query?**
A: Use aliases:

```
query {
  revenue: kpiMetric(type: REVENUE, period: $period) { value }
  orders: kpiMetric(type: ORDERS, period: $period) { value }
  avgCheck: kpiMetric(type: AVG_CHECK, period: $period) { value }
}
```

**Q: What if branchId is not provided?**
A: Returns aggregated data across all branches the user has access to.

**Q: How are dates returned?**
A: All timestamps are ISO 8601 in UTC. Convert to local timezone on frontend.

**Q: What is the rate limit?**
A: 100 requests per minute per user. Same as REST API.

**Q: Can I use fragments?**
A: Yes, fragments are fully supported:

```
fragment KpiFields on KpiMetric {
  value
  changePercent
  trend
}

query {
  revenue: kpiMetric(...) { ...KpiFields }
  orders: kpiMetric(...) { ...KpiFields }
}
```

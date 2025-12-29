# 24. Analytics Dashboard - Complete Step-by-Step Guide

This document covers every screen and case for the Analytics Dashboard feature.

**API**: GraphQL (NOT REST)
**Endpoint**: `POST /graphql`
**Authentication**: JWT Bearer Token

---

## Subscription Tiers

Dashboard access is gated by subscription plan. See `docs/about/Pricing & Billing Spec.md` for full details.

| Feature | BASIC ($29) | PRO ($59) | ULTRA ($119) |
|---------|-------------|-----------|--------------|
| View Dashboard | Yes | Yes | Yes |
| Customize KPI Slots | No | Yes | Yes |
| Add/Remove Widgets | No | Yes | Yes |
| Rearrange Widgets | No | Yes | Yes |
| Save Dashboard Config | No | Yes | Yes |

**Entitlements:**
- `analytics_basic` - Can view default dashboard (included in BASIC)
- `dashboard_custom` - Can customize dashboard (included in PRO/ULTRA)

### How to Check Entitlements

```
Query:
query CurrentUserEntitlements {
  me {
    entitlements {
      analytics_basic
      analytics_pro
      analytics_full
      dashboard_custom
    }
  }
}

Response:
{
  "data": {
    "me": {
      "entitlements": {
        "analytics_basic": true,
        "analytics_pro": false,
        "analytics_full": false,
        "dashboard_custom": false
      }
    }
  }
}
```

Use this to conditionally show/hide the [Edit] button.

---

## Quick Summary

```
User Opens Analytics
        |
        v
+-------------------+
| Load Dashboard    |
| Config            |
+-------------------+
        |
        v
Config exists?
        |
   +----+----+
   |         |
  YES        NO
   |         |
   v         v
Apply     Use Default
Config    Config
   |         |
   +----+----+
        |
        v
+-------------------+
| Screen 1:         |
| Dashboard Home    |
+-------------------+
        |
   +----+----+
   |         |
  Edit     Change
  Mode     Period
   |         |
   v         v
+----------+ +----------+
| Screen 2 | | Screen 4 |
| Edit     | | Period   |
| Mode     | | Selector |
+----------+ +----------+
   |
   v
Add/Remove
Widget?
   |
   v
+-------------------+
| Screen 3:         |
| Widget Config     |
+-------------------+
```

---

## Screen 1: Dashboard Home

### When to Show

Show this screen when:
- User navigates to Analytics section
- User is authenticated with valid JWT
- User has `reports:sales` permission
- User has at least `analytics_basic` entitlement

Do NOT show when:
- User is not authenticated (redirect to login)
- User lacks analytics permission (show "Access Denied")
- User lacks `analytics_basic` entitlement (show upgrade prompt)

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics                            [Branch: Main] [Today v]|
|                                                                   |
|  +------------+ +------------+ +------------+ +------------+      |
|  | Revenue    | | Orders     | | Avg Check  | | New Cust   |      |
|  | 12,500,000 | | 156        | | 80,128     | | 23         |      |
|  | +11.6% ^   | | +5.2% ^    | | +6.1% ^    | | -2.3% v    |      |
|  +------------+ +------------+ +------------+ +------------+      |
|                                                                   |
|  Main Chart                                            [Edit]     |
|  +---------------------------------------------------------------+|
|  |                                                               ||
|  |     ____                                                      ||
|  |    /    \        ____                                         ||
|  | __/      \______/    \______                                  ||
|  |                              \____                            ||
|  |                                                               ||
|  | Mon   Tue   Wed   Thu   Fri   Sat   Sun                       ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Widgets                                                          |
|  +---------------------------+ +---------------------------+      |
|  | Top Products              | | Payment Methods           |      |
|  | 1. Pizza Margherita  45%  | | Cash          46%         |      |
|  | 2. Burger Classic    23%  | | Card          38%         |      |
|  | 3. Caesar Salad      12%  | | Payme         10%         |      |
|  | 4. Pasta Carbonara    8%  | | Click          6%         |      |
|  | 5. Lemonade           5%  | |                           |      |
|  +---------------------------+ +---------------------------+      |
|                                                                   |
+------------------------------------------------------------------+
```

### User Actions

| Action | What Happens | Entitlement |
|--------|--------------|-------------|
| Tap KPI card | No action (display only) | Any |
| Tap [Edit] button | GO TO Screen 2 (Edit Mode) | `dashboard_custom` only |
| Tap [Today v] | GO TO Screen 4 (Period Selector) | Any |
| Tap [Branch: Main] | GO TO Screen 5 (Branch Selector) | Any |
| Pull down to refresh | Reload all data | Any |
| Tap widget | Expand to full-screen detail view | Any |

**Important:** The [Edit] button should be:
- **Hidden** if user doesn't have `dashboard_custom` entitlement (BASIC plan)
- **Visible** if user has `dashboard_custom` entitlement (PRO/ULTRA plan)

For BASIC users, show a subtle upgrade prompt instead:
```
+---------------------------------------------------------------+
|  Main Chart                                       [Upgrade to edit] |
+---------------------------------------------------------------+
```

### API Calls

**Step 1: Load Dashboard Config**

```
POST /graphql

Query:
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

Headers:
Authorization: Bearer <jwt_token>

Success Response:
{
  "data": {
    "dashboardConfig": {
      "kpiSlots": [
        { "position": 0, "type": "REVENUE", "visible": true },
        { "position": 1, "type": "ORDERS", "visible": true },
        { "position": 2, "type": "AVG_CHECK", "visible": true },
        { "position": 3, "type": "NEW_CUSTOMERS", "visible": true }
      ],
      "chartMetric": "REVENUE",
      "chartGroupBy": "DAY",
      "widgets": [
        { "id": "w1", "type": "TOP_PRODUCTS", "position": 0, "config": null },
        { "id": "w2", "type": "PAYMENT_METHODS", "position": 1, "config": null }
      ]
    }
  }
}
```

**Step 2: Load KPI Values**

```
POST /graphql

Query:
query KpiMetrics($types: [KpiType!]!, $period: PeriodInput!, $branchId: Int) {
  kpiMetrics(types: $types, period: $period, branchId: $branchId) {
    value
    previousValue
    changePercent
    trend
    formattedValue
    periodLabel
    comparisonLabel
  }
}

Variables:
{
  "types": ["REVENUE", "ORDERS", "AVG_CHECK", "NEW_CUSTOMERS"],
  "period": { "type": "TODAY" },
  "branchId": 1
}

Success Response:
{
  "data": {
    "kpiMetrics": [
      {
        "value": 12500000,
        "previousValue": 11200000,
        "changePercent": 11.6,
        "trend": "UP",
        "formattedValue": "12,500,000",
        "periodLabel": "Today",
        "comparisonLabel": "vs yesterday"
      },
      {
        "value": 156,
        "previousValue": 148,
        "changePercent": 5.2,
        "trend": "UP",
        "formattedValue": "156",
        "periodLabel": "Today",
        "comparisonLabel": "vs yesterday"
      }
    ]
  }
}
```

**Step 3: Load Main Chart**

```
POST /graphql

Query:
query TimeSeries($metric: KpiType!, $period: PeriodInput!, $groupBy: GroupBy, $branchId: Int) {
  timeSeries(metric: $metric, period: $period, groupBy: $groupBy, branchId: $branchId) {
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

Variables:
{
  "metric": "REVENUE",
  "period": { "type": "THIS_WEEK" },
  "groupBy": "DAY",
  "branchId": 1
}

Success Response:
{
  "data": {
    "timeSeries": {
      "metric": "REVENUE",
      "groupBy": "DAY",
      "totalValue": 45000000,
      "changePercent": 12.5,
      "points": [
        { "timestamp": "2025-12-23T00:00:00Z", "value": 5800000, "label": "Mon", "isHighlighted": false },
        { "timestamp": "2025-12-24T00:00:00Z", "value": 7200000, "label": "Tue", "isHighlighted": false },
        { "timestamp": "2025-12-25T00:00:00Z", "value": 8100000, "label": "Wed", "isHighlighted": true }
      ]
    }
  }
}
```

**Step 4: Load Widgets Data**

For each widget, call the appropriate query based on widget type:

| Widget Type | Query |
|-------------|-------|
| TOP_PRODUCTS | `rankedList(dataset: PRODUCTS)` |
| PAYMENT_METHODS | `proportions(dimension: "PAYMENT_METHOD")` |
| CHANNEL_SPLIT | `proportions(dimension: "CHANNEL")` |
| STAFF_RANKING | `rankedList(dataset: STAFF)` |
| RECENT_ORDERS | Custom query (not in analytics) |
| HOURLY_BREAKDOWN | `heatmap` |
| GOAL_PROGRESS | `goalsSummary` |
| ALERTS | `alertSummary` |

### Handle Response

```
Step 1: Parse dashboard config
─────────────────────────────
kpiSlots = response.dashboardConfig.kpiSlots
chartMetric = response.dashboardConfig.chartMetric
widgets = response.dashboardConfig.widgets

Step 2: Build KPI types array from config
─────────────────────────────────────────
kpiTypes = kpiSlots
  .filter(slot => slot.visible = true)
  .sort by position
  .map to slot.type

Step 3: Fetch KPI values in order
─────────────────────────────────
for each kpiType in kpiTypes:
  Display in corresponding position

Step 4: Render chart with configured metric
───────────────────────────────────────────
chartData = timeSeries response
Render line/bar chart

Step 5: Render widgets in order
───────────────────────────────
for each widget in widgets sorted by position:
  Fetch widget data
  Render widget component
```

### Error Handling

**Error State: Network Error**

```
+------------------------------------------------------------------+
|                                                                   |
|                     [!] Connection Error                          |
|                                                                   |
|          Could not load analytics data.                           |
|          Check your internet connection.                          |
|                                                                   |
|                     [ Try Again ]                                 |
|                                                                   |
+------------------------------------------------------------------+
```

**Error State: No Data**

```
+------------------------------------------------------------------+
|                                                                   |
|                     [Chart icon]                                  |
|                                                                   |
|          No data for selected period                              |
|                                                                   |
|          Try selecting a different date range                     |
|          or check if orders exist for this branch.                |
|                                                                   |
+------------------------------------------------------------------+
```

**Error State: Partial Load**

If some widgets fail to load, show them with individual error states:

```
+---------------------------+
| Top Products              |
|                           |
| [!] Failed to load        |
|     [ Retry ]             |
|                           |
+---------------------------+
```

---

## Screen 2: Edit Mode

### When to Show

Show this screen when:
- User taps [Edit] button on Dashboard Home
- User has `settings:edit` permission
- **User has `dashboard_custom` entitlement (PRO/ULTRA only)**

Do NOT show when:
- User lacks `dashboard_custom` entitlement (show upgrade modal instead)

### UI Layout

```
+------------------------------------------------------------------+
|  [Cancel]          Edit Dashboard                    [Save]       |
|                                                                   |
|  KPI Cards (drag to reorder)                                      |
|  +------+ +------+ +------+ +------+ +------+ +------+            |
|  |  1   | |  2   | |  3   | |  4   | |  +   | |  +   |            |
|  | REV  | | ORD  | | AVG  | | NEW  | | Add  | | Add  |            |
|  |  X   | |  X   | |  X   | |  X   | |      | |      |            |
|  +------+ +------+ +------+ +------+ +------+ +------+            |
|                                                                   |
|  Main Chart Metric                                                |
|  +---------------------------------------------------------------+|
|  | REVENUE                                                    v  ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Chart Grouping                                                   |
|  +---------------------------------------------------------------+|
|  | Auto (based on period)                                     v  ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Widgets (drag to reorder)                                        |
|  +---------------------------+ +---------------------------+      |
|  | [=] Top Products      [X] | | [=] Payment Methods   [X] |      |
|  +---------------------------+ +---------------------------+      |
|  +---------------------------+                                    |
|  | [+] Add Widget            |                                    |
|  +---------------------------+                                    |
|                                                                   |
+------------------------------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Tap [Cancel] | Discard changes, GO TO Screen 1 |
| Tap [Save] | Save config, GO TO Screen 1 |
| Drag KPI card | Reorder KPI positions |
| Tap [X] on KPI | Remove KPI from visible slots |
| Tap [+] Add KPI | Show KPI type picker |
| Tap chart metric dropdown | Show metric options |
| Drag widget | Reorder widget positions |
| Tap [X] on widget | Remove widget |
| Tap [+] Add Widget | GO TO Screen 3 |

### KPI Type Options

| Type | Display Name |
|------|--------------|
| REVENUE | Revenue |
| ORDERS | Orders |
| AVG_CHECK | Avg Check |
| CUSTOMERS | Customers |
| NEW_CUSTOMERS | New Customers |
| RETURNING_CUSTOMERS | Returning |
| TIPS | Tips |
| REFUNDS | Refunds |
| CANCELLATIONS | Cancellations |
| MARGIN | Margin (Premium) |
| RETENTION_RATE | Retention Rate |
| STAFF_PRODUCTIVITY | Staff Productivity |

### Chart Metric Options

Same as KPI types above.

### Chart Grouping Options

| Value | Display Name |
|-------|--------------|
| null | Auto (based on period) |
| HOUR | By Hour |
| DAY | By Day |
| WEEK | By Week |
| MONTH | By Month |

### API Call: Save Configuration

```
POST /graphql

Mutation:
mutation SaveDashboardConfig($config: DashboardConfigInput!) {
  saveDashboardConfig(config: $config) {
    success
  }
}

Variables:
{
  "config": {
    "kpiSlots": [
      { "position": 0, "type": "REVENUE", "visible": true },
      { "position": 1, "type": "ORDERS", "visible": true },
      { "position": 2, "type": "AVG_CHECK", "visible": true },
      { "position": 3, "type": "NEW_CUSTOMERS", "visible": true }
    ],
    "chartMetric": "REVENUE",
    "chartGroupBy": "DAY",
    "widgets": [
      { "id": "w1", "type": "TOP_PRODUCTS", "position": 0 },
      { "id": "w2", "type": "PAYMENT_METHODS", "position": 1 }
    ]
  }
}

Success Response:
{
  "data": {
    "saveDashboardConfig": {
      "success": true
    }
  }
}

Error Response (no entitlement):
{
  "errors": [
    {
      "message": "Dashboard customization requires PRO plan or higher",
      "extensions": {
        "code": "ENTITLEMENT_REQUIRED",
        "entitlement": "dashboard_custom",
        "requiredPlan": "PRO"
      }
    }
  ]
}
```

### Handle Response

```
if response.success = true
  Show toast "Dashboard saved"
  GO TO: Screen 1 (Dashboard Home)
  Reload dashboard with new config

if response.success = false
  Show error toast "Failed to save"
  Stay on edit mode

if error.code = "ENTITLEMENT_REQUIRED"
  Show upgrade modal
  "Dashboard customization requires PRO plan"
  [Upgrade] [Cancel]
```

---

## Screen 3: Widget Configuration

### When to Show

Show this screen when:
- User taps [+] Add Widget in Edit Mode

### UI Layout

```
+------------------------------------------------------------------+
|  <- Back              Add Widget                                  |
|                                                                   |
|  Select widget type:                                              |
|                                                                   |
|  +---------------------------------------------------------------+|
|  | [Chart] Top Products                                          ||
|  |         Shows best-selling products by revenue                ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  +---------------------------------------------------------------+|
|  | [Pie] Payment Methods                                         ||
|  |       Breakdown of payment types                              ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  +---------------------------------------------------------------+|
|  | [Pie] Channel Split                                           ||
|  |       Sales by channel (dine-in, delivery, etc.)              ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  +---------------------------------------------------------------+|
|  | [List] Staff Ranking                                          ||
|  |        Top performing staff members                           ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  +---------------------------------------------------------------+|
|  | [Clock] Hourly Breakdown                                      ||
|  |         Heatmap of orders by hour                             ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  +---------------------------------------------------------------+|
|  | [Target] Goal Progress                                        ||
|  |          Current goals and their progress                     ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  +---------------------------------------------------------------+|
|  | [Bell] Alerts                                                 ||
|  |        Active alerts and notifications                        ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### Widget Types Reference

| Type | Description | Data Query |
|------|-------------|------------|
| TOP_PRODUCTS | Top 5-10 products by revenue | `rankedList(dataset: PRODUCTS)` |
| PAYMENT_METHODS | Payment method distribution | `proportions(dimension: "PAYMENT_METHOD")` |
| CHANNEL_SPLIT | Channel distribution | `proportions(dimension: "CHANNEL")` |
| STAFF_RANKING | Staff performance | `rankedList(dataset: STAFF)` |
| HOURLY_BREAKDOWN | Hour x Day heatmap | `heatmap` |
| CUSTOMER_SEGMENTS | Customer segment pie | `customerOverview` |
| BRANCH_COMPARISON | Branch metrics table | `branchComparison` |
| GOAL_PROGRESS | Active goals | `goalsSummary` |
| ALERTS | Active alerts | `alertSummary` |

### User Actions

| Action | What Happens |
|--------|--------------|
| Tap widget type | Add widget to dashboard, GO TO Screen 2 |
| Tap [<- Back] | Cancel, GO TO Screen 2 |

---

## Screen 4: Period Selector

### When to Show

Show this screen (as modal/dropdown) when:
- User taps period selector button (e.g., "Today")

### UI Layout

```
+----------------------------------+
|  Select Period                   |
|                                  |
|  Quick Select                    |
|  +----------------------------+  |
|  | Today                      |  |
|  +----------------------------+  |
|  | Yesterday                  |  |
|  +----------------------------+  |
|  | This Week                  |  |
|  +----------------------------+  |
|  | Last Week                  |  |
|  +----------------------------+  |
|  | This Month                 |  |
|  +----------------------------+  |
|  | Last Month                 |  |
|  +----------------------------+  |
|  | Last 7 Days                |  |
|  +----------------------------+  |
|  | Last 30 Days               |  |
|  +----------------------------+  |
|  | Custom Range...            |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

### Custom Range Sub-screen

```
+----------------------------------+
|  <- Back    Custom Range         |
|                                  |
|  Start Date                      |
|  +----------------------------+  |
|  | 2025-12-01              [>]|  |
|  +----------------------------+  |
|                                  |
|  End Date                        |
|  +----------------------------+  |
|  | 2025-12-28              [>]|  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  |         [ Apply ]          |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

### Period Type Values

| Display | API Value |
|---------|-----------|
| Today | TODAY |
| Yesterday | YESTERDAY |
| This Week | THIS_WEEK |
| Last Week | LAST_WEEK |
| This Month | THIS_MONTH |
| Last Month | LAST_MONTH |
| Last 7 Days | LAST_7_DAYS |
| Last 30 Days | LAST_30_DAYS |
| Last 90 Days | LAST_90_DAYS |
| This Quarter | THIS_QUARTER |
| Last Quarter | LAST_QUARTER |
| This Year | THIS_YEAR |
| Last Year | LAST_YEAR |
| Custom Range | CUSTOM |

### User Actions

| Action | What Happens |
|--------|--------------|
| Tap period option | Set period, close modal, reload data |
| Tap "Custom Range" | Show date picker sub-screen |
| Tap [Apply] on custom | Set custom period, close modal, reload data |

### Custom Period Request

When type = CUSTOM, include start and end dates:

```
Variables:
{
  "period": {
    "type": "CUSTOM",
    "customStart": "2025-12-01",
    "customEnd": "2025-12-28"
  }
}
```

---

## Screen 5: Branch Selector

### When to Show

Show this screen (as modal/dropdown) when:
- User taps branch selector button
- User has access to multiple branches

Do NOT show when:
- User only has access to one branch (hide selector entirely)

### UI Layout

```
+----------------------------------+
|  Select Branch                   |
|                                  |
|  +----------------------------+  |
|  | [*] All Branches           |  |
|  +----------------------------+  |
|  | [ ] Main Branch            |  |
|  +----------------------------+  |
|  | [ ] Downtown               |  |
|  +----------------------------+  |
|  | [ ] Airport                |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Tap branch | Select branch, close modal, reload data with branchId |
| Tap "All Branches" | Select null branchId (aggregate), reload data |

### API Behavior

When branchId is null or omitted:
- Returns aggregated data across all branches user has access to

When branchId is specified:
- Returns data filtered to that specific branch

---

## Complete Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP OPENS                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────┐
                    │ Has auth token?   │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                   NO                  YES
                    │                   │
                    ▼                   ▼
             ┌──────────┐     ┌───────────────────┐
             │ Login    │     │ Has analytics     │
             │ Screen   │     │ permission?       │
             └──────────┘     └─────────┬─────────┘
                                        │
                              ┌─────────┴─────────┐
                              │                   │
                             NO                  YES
                              │                   │
                              ▼                   ▼
                       ┌──────────┐     ┌───────────────────┐
                       │ Access   │     │ Load Dashboard    │
                       │ Denied   │     │ Config            │
                       └──────────┘     └─────────┬─────────┘
                                                  │
                                        ┌─────────┴─────────┐
                                        │                   │
                                     SUCCESS             ERROR
                                        │                   │
                                        ▼                   ▼
                              ┌───────────────┐    ┌───────────────┐
                              │ Use Config    │    │ Use Default   │
                              │ from API      │    │ Config        │
                              └───────┬───────┘    └───────┬───────┘
                                      │                    │
                                      └────────┬───────────┘
                                               │
                                               ▼
                              ┌───────────────────────────────┐
                              │   SCREEN 1: DASHBOARD HOME    │
                              └───────────────┬───────────────┘
                                              │
              ┌───────────────┬───────────────┼───────────────┬───────────────┐
              │               │               │               │               │
              ▼               ▼               ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Tap Edit │   │ Change   │   │ Change   │   │ Refresh  │   │ Tap      │
        │          │   │ Period   │   │ Branch   │   │          │   │ Widget   │
        └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘
             │              │              │              │              │
             ▼              ▼              ▼              ▼              ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐   Reload    ┌──────────┐
       │ Screen 2 │  │ Screen 4 │  │ Screen 5 │   Data      │ Detail   │
       │ Edit     │  │ Period   │  │ Branch   │              │ View     │
       │ Mode     │  │ Selector │  │ Selector │              │          │
       └────┬─────┘  └────┬─────┘  └────┬─────┘              └──────────┘
            │              │              │
            ▼              │              │
      ┌──────────┐         │              │
      │ Screen 3 │         │              │
      │ Add      │         │              │
      │ Widget   │         │              │
      └────┬─────┘         │              │
            │              │              │
            ▼              ▼              ▼
       ┌─────────────────────────────────────────┐
       │         Save / Apply Changes            │
       └─────────────────────────────────────────┘
                           │
                           ▼
              ┌───────────────────────────────┐
              │   Return to SCREEN 1          │
              │   with updated config/data    │
              └───────────────────────────────┘
```

---

## API Reference

| Query/Mutation | When Called | Parameters |
|----------------|-------------|------------|
| `dashboardConfig` | Screen load | none |
| `kpiMetrics` | Screen load, period/branch change | types[], period, branchId |
| `timeSeries` | Screen load, period/branch change | metric, period, groupBy, branchId |
| `rankedList` | Widget load | dataset, period, sortBy, limit, branchId |
| `proportions` | Widget load | dimension, period, branchId |
| `heatmap` | Widget load | period, metric, branchId |
| `goalsSummary` | Widget load | branchId |
| `alertSummary` | Widget load | branchId |
| `saveDashboardConfig` | Save edit mode | config |

---

## Storage Reference

| Key | Type | Set When | Clear When |
|-----|------|----------|------------|
| `analytics.period` | string | User selects period | Never (persist preference) |
| `analytics.branchId` | number | User selects branch | Never (persist preference) |
| `analytics.dashboardCache` | object | API response | On refresh, period change |

---

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| UNAUTHENTICATED | Token invalid/expired | Redirect to login |
| FORBIDDEN | No permission | Show "Access Denied" screen |
| BAD_USER_INPUT | Invalid parameters | Show validation error toast |
| ENTITLEMENT_REQUIRED | Feature requires higher tier | Show upgrade prompt with plan name |
| RATE_LIMITED | Too many requests | Show "Please wait" toast |

### Entitlement Error Handling

When receiving `ENTITLEMENT_REQUIRED` error:

```
+------------------------------------------+
|                                          |
|  [Crown icon]                            |
|                                          |
|  Upgrade to PRO                          |
|                                          |
|  Dashboard customization requires        |
|  PRO plan or higher.                     |
|                                          |
|  +------------------------------------+  |
|  |           [ Upgrade ]              |  |
|  +------------------------------------+  |
|  |           [ Maybe Later ]          |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

---

## FAQ

**Q: What if dashboardConfig returns null?**
A: Use default config: 4 KPI slots (REVENUE, ORDERS, AVG_CHECK, NEW_CUSTOMERS), chart metric REVENUE, widgets TOP_PRODUCTS and PAYMENT_METHODS.

**Q: Can user add more than 4 KPI cards?**
A: Yes, up to 6 positions (0-5). Slots 4 and 5 are optional. Requires `dashboard_custom` entitlement.

**Q: What happens on first load for new tenant?**
A: Backend returns default config. PRO/ULTRA users can customize and save. BASIC users see default only.

**Q: How to handle partial widget failures?**
A: Show individual error states per widget. Other widgets continue to function.

**Q: Is data cached?**
A: Yes, cache for 5 minutes. User can force refresh.

**Q: What grouping is used for "Auto"?**
A: Backend determines based on period: TODAY=HOUR, THIS_WEEK=DAY, THIS_MONTH=DAY, THIS_YEAR=MONTH.

**Q: Are enum values case-sensitive?**
A: YES. Always use UPPERCASE: "REVENUE" not "revenue", "TODAY" not "today".

**Q: Can BASIC users customize the dashboard?**
A: No. BASIC users see the default dashboard only. The [Edit] button is hidden for BASIC plan. They need to upgrade to PRO or ULTRA.

**Q: What happens if user downgrades from PRO to BASIC?**
A: Their custom dashboard config is preserved but they can no longer edit it. Dashboard reverts to showing default config.

**Q: How do I check if user can customize?**
A: Query the `me.entitlements.dashboard_custom` field. If true, show [Edit] button. If false, hide it or show upgrade prompt.

**Q: What's the difference between `analytics_basic`, `analytics_pro`, and `analytics_full`?**
A:
- `analytics_basic`: View default dashboard, basic analytics pages (BASIC plan)
- `analytics_pro`: Advanced analytics pages like Staff, Customers (PRO plan)
- `analytics_full`: Full analytics including Financial, Forecasting, Alerts (ULTRA plan)
- `dashboard_custom`: Customize dashboard layout (PRO/ULTRA plans)

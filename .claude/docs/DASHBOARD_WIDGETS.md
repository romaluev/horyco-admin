# Dashboard Widgets - Frontend Specification

This document defines all widget types for the Analytics Dashboard.

---

## Quick Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DASHBOARD LAYOUT                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SECTION 1: KPI ROW (Fixed position, configurable content)         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │ KPI    │ │ KPI    │ │ KPI    │ │ KPI    │ │  +Add  │           │
│  │ Card   │ │ Card   │ │ Card   │ │ Card   │ │  KPI   │           │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘           │
│                                                                     │
│  SECTION 2: SMART CHART (Fixed position)                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Line/Bar Chart                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  SECTION 3: WIDGET AREA (Configurable)                             │
│  ┌────────────────────┐  ┌────────────────────┐                    │
│  │ Widget             │  │ Widget             │                    │
│  │ (user choice)      │  │ (user choice)      │                    │
│  └────────────────────┘  └────────────────────┘                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Widget Type 1: KPI Card

### Purpose

Show a single metric with comparison to previous period.

### Layout

```
+----------------------------------+
|                                  |
|  Revenue                         |  <- Label (muted)
|                                  |
|  12,500,000                      |  <- Value (large, bold)
|  som                             |  <- Unit (muted)
|                                  |
|  +11.6%  ↑                       |  <- Change + Trend
|  vs yesterday                    |  <- Comparison label (muted)
|                                  |
+----------------------------------+
```

### States

**Loading State:**

```
+----------------------------------+
|                                  |
|  Revenue                         |
|                                  |
|  ████████████                    |  <- Skeleton
|  ████                            |  <- Skeleton
|                                  |
|  ████████                        |  <- Skeleton
|                                  |
+----------------------------------+
```

**Empty State (no data):**

```
+----------------------------------+
|                                  |
|  Revenue                         |
|                                  |
|  --                              |
|                                  |
|  No data for this period         |
|                                  |
+----------------------------------+
```

**Error State:**

```
+----------------------------------+
|                                  |
|  Revenue                         |
|                                  |
|  [!] Failed to load              |
|                                  |
|  [ Retry ]                       |
|                                  |
+----------------------------------+
```

### GraphQL Query

```
query KpiCard($type: KpiType!, $period: PeriodInput!, $branchId: Int) {
  kpiMetric(type: $type, period: $period, branchId: $branchId) {
    value
    previousValue
    changePercent
    trend          # UP, DOWN, NEUTRAL
    formattedValue # "12,500,000"
  }
}
```

### Response

```
{
  "kpiMetric": {
    "value": 12500000,
    "previousValue": 11200000,
    "changePercent": 11.6,
    "trend": "UP",
    "formattedValue": "12,500,000"
  }
}
```

### Display Logic

```
Pseudocode:

if trend = "UP"
    changeColor = green
    trendIcon = ↑
else if trend = "DOWN"
    changeColor = red
    trendIcon = ↓
else
    changeColor = gray
    trendIcon = →

if changePercent > 0
    changeText = "+" + changePercent + "%"
else
    changeText = changePercent + "%"

comparisonLabel = getComparisonLabel(period)
# "vs yesterday", "vs last week", etc.
```

### Available KPI Types

| Type                | Label         | Unit  | Notes                   |
| ------------------- | ------------- | ----- | ----------------------- |
| REVENUE             | Revenue       | som   | Completed payments only |
| ORDERS              | Orders        | count | -                       |
| AVG_CHECK           | Avg Check     | som   | Revenue / Orders        |
| NEW_CUSTOMERS       | New Customers | count | First-time orders       |
| RETURNING_CUSTOMERS | Returning     | count | Repeat customers        |
| TIPS                | Tips          | som   | -                       |
| REFUNDS             | Refunds       | som   | -                       |
| CANCELLATIONS       | Cancelled     | count | -                       |
| MARGIN              | Margin        | som   | Premium only            |

---

## Widget Type 2: KPI Card with Breakdown

### Purpose

Show main metric with sub-metrics breakdown.

### Layout

```
+------------------------------------------+
|                                          |
|  [icon] Sales Performance     [Details]  |
|                                          |
|  68K                          -6%        |  <- Main value + change
|                                          |
|  Online Store          Offline Store     |
|  88          Good      64        Average |
|  ████████████████      ████████████████  |  <- Progress bars
|                                          |
+------------------------------------------+
```

### GraphQL Query

```
query KpiWithBreakdown($type: KpiType!, $breakdownBy: String!, $period: PeriodInput!) {
  kpiWithBreakdown(type: $type, breakdownBy: $breakdownBy, period: $period) {
    total {
      value
      changePercent
    }
    breakdown {
      label
      value
      percentage
      status  # "good", "average", "poor"
    }
  }
}
```

### Response

```
{
  "kpiWithBreakdown": {
    "total": {
      "value": 68000,
      "changePercent": -6
    },
    "breakdown": [
      { "label": "Online Store", "value": 88, "percentage": 57.8, "status": "good" },
      { "label": "Offline Store", "value": 64, "percentage": 42.2, "status": "average" }
    ]
  }
}
```

---

## Widget Type 3: Horizontal Bar Chart (Ranked List)

### Purpose

Show ranked items with values and percentages.

### Layout

```
+--------------------------------------------------+
|                                          [more]  |
|  Top Products by Revenue                         |
|                                                  |
|  1  ████████████████████████████  Margherita    |
|                                   16.8%          |
|                                                  |
|  2  ██████████████████████████    Pepperoni     |
|                                   14.8%          |
|                                                  |
|  3  ████████████████████          Caesar Salad  |
|                                   12.1%          |
|                                                  |
|  4  ██████████████████            Americano     |
|                                   10.5%          |
|                                                  |
|  5  ████████████████              Latte         |
|                                   9.2%           |
|                                                  |
+--------------------------------------------------+
```

### GraphQL Query

```
query TopProducts($period: PeriodInput!, $branchId: Int, $limit: Int) {
  rankedList(
    dataset: PRODUCTS
    period: $period
    branchId: $branchId
    sortBy: REVENUE
    limit: $limit
  ) {
    rank
    id
    name
    value
    percentage
    metadata {
      orders
      quantity
    }
  }
}
```

### Response

```
{
  "rankedList": [
    {
      "rank": 1,
      "id": 101,
      "name": "Margherita Pizza",
      "value": 2100000,
      "percentage": 16.8,
      "metadata": {
        "orders": 145,
        "quantity": 203
      }
    },
    {
      "rank": 2,
      "id": 102,
      "name": "Pepperoni Pizza",
      "value": 1850000,
      "percentage": 14.8,
      "metadata": {
        "orders": 128,
        "quantity": 178
      }
    }
  ]
}
```

### Color Assignment

```
Pseudocode:

colors = [orange, teal, navy, yellow, coral, black]

for each item at index i
    item.color = colors[i % colors.length]
```

---

## Widget Type 4: Time Series Chart

### Purpose

Show metric over time (line or bar chart).

### Layout

```
+--------------------------------------------------+
|                                                  |
|  Revenue Growth                    Weekly Report |
|                                                  |
|  $3,234                                    +15%  |
|                                                  |
|           █                                      |
|       █   █   █       █                          |
|   █   █   █   █   █   █   █                      |
|   M   T   W   T   F   S   S                      |
|                                                  |
+--------------------------------------------------+
```

### GraphQL Query

```
query RevenueChart($period: PeriodInput!, $groupBy: GroupBy!, $branchId: Int) {
  timeSeries(
    metric: REVENUE
    period: $period
    groupBy: $groupBy
    branchId: $branchId
  ) {
    totalValue
    changePercent
    points {
      timestamp
      value
      label  # "Mon", "9am", "Week 1"
    }
  }
}
```

### Response

```
{
  "timeSeries": {
    "totalValue": 3234000,
    "changePercent": 15,
    "points": [
      { "timestamp": "2025-12-09T00:00:00Z", "value": 380000, "label": "Mon" },
      { "timestamp": "2025-12-10T00:00:00Z", "value": 520000, "label": "Tue" },
      { "timestamp": "2025-12-11T00:00:00Z", "value": 480000, "label": "Wed" }
    ]
  }
}
```

### Auto Group By Logic

```
Pseudocode:

if period.type = "TODAY" or period.type = "YESTERDAY"
    groupBy = HOUR
else if period is <= 31 days
    groupBy = DAY
else
    groupBy = WEEK
```

---

## Widget Type 5: Donut/Pie Chart

### Purpose

Show proportional breakdown.

### Layout

```
+--------------------------------------------------+
|                                                  |
|  Payment Methods                                 |
|                                                  |
|        ████████                                  |
|      ██        ██       Cash     46%             |
|     █            █      Card     38%             |
|     █   Total    █      Payme    10%             |
|     █  12.5M     █      Click     6%             |
|      ██        ██                                |
|        ████████                                  |
|                                                  |
+--------------------------------------------------+
```

### GraphQL Query

```
query PaymentBreakdown($period: PeriodInput!, $branchId: Int) {
  proportions(
    dimension: PAYMENT_METHOD
    period: $period
    branchId: $branchId
  ) {
    total
    segments {
      label
      value
      percentage
      color
    }
  }
}
```

### Response

```
{
  "proportions": {
    "total": 12500000,
    "segments": [
      { "label": "Cash", "value": 5750000, "percentage": 46, "color": "#FF6B6B" },
      { "label": "Card", "value": 4750000, "percentage": 38, "color": "#4ECDC4" },
      { "label": "Payme", "value": 1250000, "percentage": 10, "color": "#45B7D1" },
      { "label": "Click", "value": 750000, "percentage": 6, "color": "#96CEB4" }
    ]
  }
}
```

---

## Widget Type 6: Recent Orders List

### Purpose

Show latest orders with key details.

### Layout

```
+--------------------------------------------------+
|                                          [more]  |
|  Recent Orders                                   |
|                                                  |
|  14:32  ORD-1234  560,000  Card    Paid         |
|  14:28  ORD-1233  420,000  Cash    Paid         |
|  14:15  ORD-1232  890,000  Payme   Paid         |
|  14:10  ORD-1231  750,000  Card    Paid         |
|  14:05  ORD-1230  320,000  Cash    Paid         |
|                                                  |
+--------------------------------------------------+
```

### GraphQL Query

```
query RecentOrders($limit: Int!, $branchId: Int) {
  recentOrders(limit: $limit, branchId: $branchId) {
    orderId
    orderNumber
    createdAt
    total
    paymentMethod
    paymentStatus
    branch {
      id
      name
    }
  }
}
```

### Response

```
{
  "recentOrders": [
    {
      "orderId": 1234,
      "orderNumber": "ORD-1234",
      "createdAt": "2025-12-13T14:32:10Z",
      "total": 560000,
      "paymentMethod": "CARD",
      "paymentStatus": "PAID",
      "branch": null
    }
  ]
}
```

### Notes

- branch is null when viewing single branch
- branch is populated when viewing all branches
- Show branch column only when branch is not null

---

## Widget Type 7: Comparison Widget

### Purpose

Compare two related metrics side by side.

### Layout

```
+--------------------------------------------------+
|                                          +18.2%  |
|  Sales Overview                                  |
|                                                  |
|  $38.5k                                          |
|                                                  |
|  [cart] Order           Delivered [box]          |
|                                                  |
|     62.2%       VS        25.5%                  |
|     6,440               12,740                   |
|                                                  |
|  ████████████████████████████                    |
|                                                  |
+--------------------------------------------------+
```

### GraphQL Query

```
query SalesComparison($period: PeriodInput!, $branchId: Int) {
  comparison(
    metrics: [ORDERS_PLACED, ORDERS_DELIVERED]
    period: $period
    branchId: $branchId
  ) {
    totalValue
    changePercent
    items {
      metric
      label
      value
      percentage
      icon
    }
  }
}
```

---

## Widget Type 8: Sparkline Card

### Purpose

KPI with mini inline chart.

### Layout

```
+---------------------------+
|                           |
|  Order                    |
|  Last week                |
|                           |
|  ▂▃▅▆▄▇█                  |  <- Sparkline
|                           |
|  124K          +12.6%     |
|                           |
+---------------------------+
```

### GraphQL Query

```
query SparklineKpi($type: KpiType!, $period: PeriodInput!, $branchId: Int) {
  kpiWithSparkline(type: $type, period: $period, branchId: $branchId) {
    value
    changePercent
    trend
    sparkline {
      value
    }
  }
}
```

---

## Dashboard Configuration

### Config Schema

```
type DashboardConfig {
  kpiSlots: [KpiSlotConfig!]!
  chartMetric: String!      # Default: "REVENUE"
  chartGroupBy: String      # Auto if null
  widgets: [WidgetConfig!]!
}

type KpiSlotConfig {
  position: Int!
  type: KpiType!
  visible: Boolean!
}

type WidgetConfig {
  id: String!
  type: WidgetType!
  position: Int!
  config: JSON  # Widget-specific config
}
```

### Save Configuration

```
mutation SaveDashboardConfig($config: DashboardConfigInput!) {
  saveDashboardConfig(config: $config) {
    success
  }
}
```

### Load Configuration

```
query GetDashboardConfig {
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

---

## User Actions

### Add KPI Slot

```
1. User clicks "+ Add KPI" button
2. Show dropdown with available KPI types
3. User selects type
4. Add new KpiSlotConfig to array
5. Save configuration
6. Reload KPI row
```

### Remove KPI Slot

```
1. User hovers KPI card
2. Show "X" button
3. User clicks "X"
4. Confirm removal
5. Remove from kpiSlots array
6. Save configuration
7. Reload KPI row
```

### Reorder Widgets

```
1. User enters edit mode
2. Widgets show drag handles
3. User drags widget to new position
4. Update position values
5. Save configuration
6. Exit edit mode
```

---

## FAQ

**Q: How many KPIs can user add?**
A: Minimum 3, maximum 6. Show message if limit reached.

**Q: What widgets are available?**
A: Top Products, Recent Orders, Payment Methods, Channel Split, Staff Ranking.

**Q: Can user have duplicate KPIs?**
A: No. Each KPI type can appear only once.

**Q: What if widget data fails to load?**
A: Show error state for that widget only. Other widgets continue to work.

**Q: How is configuration stored?**
A: In an_dashboard_configs table, JSON column per user per tenant.

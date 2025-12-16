# Analytics Pages - Frontend Specification

This document defines all 5 analytics pages: Orders, Products, Channels, Staff, and Visitors.

---

## Quick Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ANALYTICS PAGES                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   ORDERS    │  │  PRODUCTS   │  │  CHANNELS   │  │    STAFF    │  │  VISITORS   │
│             │  │             │  │             │  │             │  │             │
│ Order data  │  │ Menu item   │  │ Sales by    │  │ Employee    │  │ Customer    │
│ by time,    │  │ performance │  │ source &    │  │ performance │  │ behavior &  │
│ status,     │  │ by revenue, │  │ delivery    │  │ metrics     │  │ retention   │
│ source      │  │ quantity    │  │ type        │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
      │                │                │                │                │
      └────────────────┴────────────────┴────────────────┴────────────────┘
                                        │
                              Shared Components:
                              - Views Sidebar
                              - Filter Toolbar
                              - Data Table
                              - Chart Views
                              - Export Actions
```

---

## Common Page Layout

All analytics pages share the same layout:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Header: Analytics > Orders                           [Branch ▼] [Export ▼]    │
├───────────────┬─────────────────────────────────────────────────────────────────┤
│               │                                                                  │
│  VIEWS        │  VIEW HEADER                                                    │
│  SIDEBAR      │  ┌────────────────────────────────────────────────────────────┐ │
│               │  │ All Orders                              [Save] [⋮ More]    │ │
│ ┌───────────┐ │  │ 1,234 orders • $45.2M revenue                              │ │
│ │ All       │ │  └────────────────────────────────────────────────────────────┘ │
│ │ High Val  │ │                                                                  │
│ │ Refunded  │ │  FILTER TOOLBAR                                                 │
│ │ + New     │ │  ┌────────────────────────────────────────────────────────────┐ │
│ └───────────┘ │  │ [Today ▼] [Status ▼] [Source ▼] [+ Filter]   [📊] [📈]    │ │
│               │  └────────────────────────────────────────────────────────────┘ │
│               │                                                                  │
│               │  CONTENT AREA (Table or Chart)                                  │
│               │  ┌────────────────────────────────────────────────────────────┐ │
│               │  │                                                            │ │
│               │  │                                                            │ │
│               │  │                                                            │ │
│               │  │                                                            │ │
│               │  └────────────────────────────────────────────────────────────┘ │
│               │                                                                  │
│               │  PAGINATION                                                      │
│               │  ┌────────────────────────────────────────────────────────────┐ │
│               │  │ Showing 1-50 of 1,234           [◀ Prev] Page 1 [Next ▶]  │ │
│               │  └────────────────────────────────────────────────────────────┘ │
│               │                                                                  │
└───────────────┴─────────────────────────────────────────────────────────────────┘
```

---

## Page 1: Orders (`/analytics/orders`)

### Purpose

Analyze order patterns, identify trends, and track order lifecycle.

### Default Views

| View Name  | Description            | Filters            |
| ---------- | ---------------------- | ------------------ |
| All Orders | All orders in period   | None               |
| Completed  | Successfully fulfilled | status = COMPLETED |
| Cancelled  | Cancelled orders       | status = CANCELLED |
| Refunded   | Refunded orders        | status = REFUNDED  |

### Available Filters

| Filter         | Type         | Options                                  |
| -------------- | ------------ | ---------------------------------------- |
| Timeframe      | Date Range   | Today, Yesterday, Last 7/30 days, Custom |
| Status         | Multi-select | COMPLETED, CANCELLED, REFUNDED, PENDING  |
| Source         | Multi-select | pos, web, telegram, aggregator           |
| Delivery Type  | Multi-select | TABLE, PICKUP, DELIVERY                  |
| Payment Method | Multi-select | CASH, CARD, PAYME, CLICK, UZUM           |
| Staff          | Multi-select | Employee dropdown                        |
| Amount Range   | Range        | Min - Max                                |

### Columns

| Column    | Type     | Sortable | Default |
| --------- | -------- | -------- | ------- |
| Order #   | Link     | ✓        | ✓       |
| Date/Time | DateTime | ✓        | ✓       |
| Customer  | Text     | ✓        | ✓       |
| Items     | Number   | ✓        | ✗       |
| Subtotal  | Currency | ✓        | ✗       |
| Discount  | Currency | ✓        | ✗       |
| Total     | Currency | ✓        | ✓       |
| Status    | Badge    | ✓        | ✓       |
| Source    | Badge    | ✓        | ✗       |
| Payment   | Badge    | ✓        | ✓       |
| Staff     | Text     | ✓        | ✗       |

### Group By Options

| Group By      | Shows                           |
| ------------- | ------------------------------- |
| None          | Individual orders               |
| Day           | Orders per day with totals      |
| Week          | Orders per week with totals     |
| Month         | Orders per month with totals    |
| Source        | Orders grouped by source        |
| Delivery Type | Orders grouped by delivery type |
| Staff         | Orders grouped by staff member  |

### Chart Views

**Time Series (default):**

```
Orders Over Time
     │
  50 ┤     ██
  40 ┤  █  ██  █
  30 ┤  ██ ██  ██  █
  20 ┤  ██ ██  ██  ██
  10 ┤  ██ ██  ██  ██  █
   0 ├──────────────────────
     Mon Tue Wed Thu Fri Sat Sun
```

**Breakdown (pie/donut):**

```
Orders by Source          Orders by Status
    ████████                  ████████████
  ██        ██              ██            ██
 █   POS    █              █  Completed   █
  ██  67%  ██               ██    95%    ██
    ████████                  ████████████
```

### GraphQL Query

```graphql
query OrdersPage(
  $period: PeriodInput!
  $filters: OrderFiltersInput
  $groupBy: GroupBy
  $sorting: SortingInput
  $pagination: PaginationInput
  $branchId: Int
) {
  ordersAnalytics(
    period: $period
    filters: $filters
    groupBy: $groupBy
    sorting: $sorting
    pagination: $pagination
    branchId: $branchId
  ) {
    summary {
      totalOrders
      totalRevenue
      avgCheck
      completionRate
    }
    items {
      # If grouped
      groupKey
      groupLabel
      ordersCount
      revenue
      avgCheck

      # If not grouped
      orderId
      orderNumber
      createdAt
      customerName
      itemsCount
      subtotal
      discount
      total
      status
      source
      deliveryType
      paymentMethod
      staffName
    }
    pagination {
      total
      page
      pageSize
      totalPages
    }
  }
}
```

---

## Page 2: Products (`/analytics/products`)

### Purpose

Analyze menu item performance, identify top/low performers, track trends.

### Default Views

| View Name      | Description         | Filters                        |
| -------------- | ------------------- | ------------------------------ |
| All Products   | All products sold   | None                           |
| Top Sellers    | Best performers     | Sort by revenue DESC, limit 20 |
| Low Performers | Worst performers    | Sort by revenue ASC, limit 20  |
| By Category    | Grouped by category | groupBy = CATEGORY             |

### Available Filters

| Filter       | Type         | Options                                  |
| ------------ | ------------ | ---------------------------------------- |
| Timeframe    | Date Range   | Today, Yesterday, Last 7/30 days, Custom |
| Category     | Multi-select | Category dropdown                        |
| Product      | Search       | Product name search                      |
| Min Quantity | Number       | Minimum units sold                       |
| Min Revenue  | Currency     | Minimum revenue                          |

### Columns

| Column     | Type         | Sortable | Default |
| ---------- | ------------ | -------- | ------- |
| Rank       | Number       | ✗        | ✓       |
| Product    | Text + Image | ✓        | ✓       |
| Category   | Badge        | ✓        | ✓       |
| Quantity   | Number       | ✓        | ✓       |
| Orders     | Number       | ✓        | ✗       |
| Revenue    | Currency     | ✓        | ✓       |
| % of Total | Percentage   | ✓        | ✓       |
| Avg/Order  | Currency     | ✓        | ✗       |
| Trend      | Sparkline    | ✗        | ✗       |

### Group By Options

| Group By | Shows                        |
| -------- | ---------------------------- |
| None     | Individual products          |
| Category | Products grouped by category |
| Day      | Product sales per day        |
| Week     | Product sales per week       |

### Chart Views

**Horizontal Bar (default):**

```
Top 10 Products by Revenue

Margherita    ████████████████████████████  $2.1M (16.8%)
Pepperoni     █████████████████████████     $1.9M (14.8%)
Caesar Salad  ████████████████████          $1.5M (12.1%)
Americano     ██████████████████            $1.3M (10.5%)
Latte         ████████████████              $1.2M (9.2%)
```

**Category Breakdown:**

```
Revenue by Category

    ████████████
  ██            ██
 █    Pizza      █    Pizza: 45%
  ██   45%      ██    Drinks: 25%
    ██████████        Salads: 18%
                      Desserts: 12%
```

**Trend Chart:**

```
Product Sales Trend (Last 7 Days)

Revenue │     ╭──╮
        │  ╭──╯  ╰──╮
        │╭─╯        ╰─╮
        │            ╰
        └─────────────────
         Mon Tue Wed Thu Fri
```

### GraphQL Query

```graphql
query ProductsPage(
  $period: PeriodInput!
  $filters: ProductFiltersInput
  $groupBy: GroupBy
  $sorting: SortingInput
  $pagination: PaginationInput
  $branchId: Int
) {
  productsAnalytics(
    period: $period
    filters: $filters
    groupBy: $groupBy
    sorting: $sorting
    pagination: $pagination
    branchId: $branchId
  ) {
    summary {
      totalProducts
      totalQuantity
      totalRevenue
      avgRevenuePerProduct
    }
    items {
      rank
      productId
      productName
      productImage
      categoryId
      categoryName
      quantity
      ordersCount
      revenue
      percentOfTotal
      avgPerOrder
      trend # Array of last 7 days values
    }
    pagination {
      total
      page
      pageSize
      totalPages
    }
  }
}
```

---

## Page 3: Channels (`/analytics/channels`)

### Purpose

Analyze sales by order source and delivery type.

### Default Views

| View Name    | Description            | Filters                   |
| ------------ | ---------------------- | ------------------------- |
| Overview     | All channels breakdown | groupBy = SOURCE          |
| POS Sales    | In-store sales         | source = pos              |
| Online Sales | Web + Telegram         | source in (web, telegram) |
| Delivery     | Delivery orders        | deliveryType = DELIVERY   |

### Available Filters

| Filter        | Type         | Options                                  |
| ------------- | ------------ | ---------------------------------------- |
| Timeframe     | Date Range   | Today, Yesterday, Last 7/30 days, Custom |
| Source        | Multi-select | pos, web, telegram, aggregator           |
| Delivery Type | Multi-select | TABLE, PICKUP, DELIVERY                  |

### Metrics

| Metric     | Description                   |
| ---------- | ----------------------------- |
| Orders     | Total orders from channel     |
| Revenue    | Total revenue from channel    |
| Avg Check  | Average order value           |
| % of Total | Share of total orders/revenue |
| Growth     | Change vs previous period     |

### Group By Options

| Group By      | Shows                              |
| ------------- | ---------------------------------- |
| Source        | Orders grouped by source           |
| Delivery Type | Orders grouped by delivery type    |
| Day           | Channel performance by day         |
| Hour          | Channel performance by hour of day |

### Chart Views

**Source Breakdown (donut):**

```
Revenue by Source

    ████████████
  ██            ██      POS        67%  $8.4M
 █    $12.5M     █      Web        18%  $2.3M
  ██   Total    ██      Telegram   10%  $1.3M
    ████████████        Aggregator  5%  $0.5M
```

**Delivery Type Breakdown:**

```
Orders by Delivery Type

Dine-in   ████████████████████████████  52%
Takeaway  ██████████████████            32%
Delivery  ████████████                  16%
```

**Hourly Heatmap:**

```
Orders by Hour & Source

        POS     Web    Telegram
6am     ░░      ░░       ░░
9am     ██      ░░       ░░
12pm    ████    ██       █░
3pm     ██      █░       ░░
6pm     ████    ███      ██
9pm     ███     ██       █░
```

### GraphQL Query

```graphql
query ChannelsPage(
  $period: PeriodInput!
  $groupBy: ChannelGroupBy!
  $branchId: Int
) {
  channelsAnalytics(period: $period, groupBy: $groupBy, branchId: $branchId) {
    summary {
      totalOrders
      totalRevenue
      avgCheck
    }
    breakdown {
      key # 'pos', 'web', 'TABLE', etc.
      label # 'POS', 'Web', 'Dine-in', etc.
      orders
      revenue
      avgCheck
      percentOrders
      percentRevenue
      growth # vs previous period
      trend # Last 7 days array
    }
    hourlyHeatmap {
      hour
      source
      orders
      intensity # 0-1 for heatmap color
    }
  }
}
```

---

## Page 4: Staff (`/analytics/staff`)

### Purpose

Track employee performance, identify top performers, monitor metrics.

### Default Views

| View Name      | Description   | Filters              |
| -------------- | ------------- | -------------------- |
| All Staff      | All employees | None                 |
| Top Performers | By revenue    | Sort by revenue DESC |
| Cashiers       | Cashier role  | role = CASHIER       |
| Servers        | Server role   | role = SERVER        |

### Available Filters

| Filter     | Type         | Options                                  |
| ---------- | ------------ | ---------------------------------------- |
| Timeframe  | Date Range   | Today, Yesterday, Last 7/30 days, Custom |
| Employee   | Multi-select | Employee dropdown                        |
| Role       | Multi-select | Role dropdown                            |
| Min Orders | Number       | Minimum orders handled                   |

### Columns

| Column       | Type          | Sortable | Default |
| ------------ | ------------- | -------- | ------- |
| Rank         | Number        | ✗        | ✓       |
| Employee     | Text + Avatar | ✓        | ✓       |
| Role         | Badge         | ✓        | ✓       |
| Orders       | Number        | ✓        | ✓       |
| Revenue      | Currency      | ✓        | ✓       |
| Avg Check    | Currency      | ✓        | ✓       |
| Tips         | Currency      | ✓        | ✗       |
| Refunds      | Currency      | ✓        | ✗       |
| Voids        | Number        | ✓        | ✗       |
| Hours        | Duration      | ✓        | ✗       |
| Revenue/Hour | Currency      | ✓        | ✗       |

### Group By Options

| Group By | Shows                     |
| -------- | ------------------------- |
| None     | Individual employees      |
| Role     | Employees grouped by role |
| Day      | Staff performance by day  |
| Shift    | Performance by shift      |

### Chart Views

**Leaderboard:**

```
Top Staff by Revenue

🥇 John Doe       ████████████████████████  $2.1M  145 orders
🥈 Jane Smith     █████████████████████     $1.8M  128 orders
🥉 Mike Johnson   ██████████████████        $1.5M  112 orders
4. Sarah Wilson   █████████████████         $1.4M  98 orders
5. Tom Brown      ███████████████           $1.2M  89 orders
```

**Performance Comparison:**

```
Staff Performance Comparison

              Orders    Revenue    Avg Check    Tips
John Doe       145      $2.1M      $14,500     $125K
Jane Smith     128      $1.8M      $14,063     $98K
Team Avg       98       $1.2M      $12,245     $65K
```

### GraphQL Query

```graphql
query StaffPage(
  $period: PeriodInput!
  $filters: StaffFiltersInput
  $sorting: SortingInput
  $pagination: PaginationInput
  $branchId: Int
) {
  staffAnalytics(
    period: $period
    filters: $filters
    sorting: $sorting
    pagination: $pagination
    branchId: $branchId
  ) {
    summary {
      totalStaff
      totalOrders
      totalRevenue
      avgOrdersPerStaff
      avgRevenuePerStaff
    }
    items {
      rank
      employeeId
      employeeName
      employeeAvatar
      roleCode
      roleName
      ordersCount
      revenue
      avgCheck
      tips
      refunds
      voidsCount
      shiftsCount
      totalMinutes
      revenuePerHour
      trend
    }
    pagination {
      total
      page
      pageSize
      totalPages
    }
  }
}
```

---

## Page 5: Visitors (`/analytics/visitors`)

### Purpose

Analyze customer behavior, track new vs returning, identify patterns.

**Note:** "Visitors" = Customers who placed orders. We don't have foot-traffic data.

### Default Views

| View Name     | Description       | Filters                 |
| ------------- | ----------------- | ----------------------- |
| Overview      | Customer summary  | None                    |
| New Customers | First-time buyers | isNew = true            |
| Returning     | Repeat customers  | isNew = false           |
| High Value    | Top spenders      | Sort by totalSpent DESC |

### Available Filters

| Filter        | Type       | Options                                  |
| ------------- | ---------- | ---------------------------------------- |
| Timeframe     | Date Range | Today, Yesterday, Last 7/30 days, Custom |
| Customer Type | Select     | All, New, Returning                      |
| Min Orders    | Number     | Minimum orders placed                    |
| Min Spent     | Currency   | Minimum total spent                      |

### Metrics

| Metric                  | Description                |
| ----------------------- | -------------------------- |
| Total Customers         | Unique customers in period |
| New Customers           | First-time buyers          |
| Returning               | Repeat customers           |
| Retention Rate          | Returning / Total \* 100   |
| Avg Orders/Customer     | Orders / Customers         |
| Avg Spend/Customer      | Revenue / Customers        |
| Customer Lifetime Value | Total historical spend     |

### Columns

| Column      | Type     | Sortable | Default |
| ----------- | -------- | -------- | ------- |
| Customer    | Text     | ✓        | ✓       |
| Phone       | Text     | ✗        | ✓       |
| Type        | Badge    | ✓        | ✓       |
| Orders      | Number   | ✓        | ✓       |
| Total Spent | Currency | ✓        | ✓       |
| Avg Check   | Currency | ✓        | ✗       |
| Last Order  | DateTime | ✓        | ✓       |
| First Order | DateTime | ✓        | ✗       |

### Group By Options

| Group By    | Shows                      |
| ----------- | -------------------------- |
| None        | Individual customers       |
| Type        | New vs Returning           |
| Day         | Customer activity by day   |
| Order Count | Cohorts by order frequency |

### Chart Views

**New vs Returning:**

```
Customer Composition

    ████████████████
  ██                ██
 █   New: 234        █      New:       28%
  ██  (28%)        ██       Returning: 72%
    ██████████████
         ▲
    Returning: 602
       (72%)
```

**Retention Trend:**

```
Customer Retention Rate

100% │
 80% ├──────●───●───●───●───●
 60% │
 40% │
 20% │
  0% └─────────────────────────
     Week1 Week2 Week3 Week4 Week5
```

**Customer Cohort:**

```
Customer Distribution by Order Count

1 order     ████████████████████████  45%
2-3 orders  ██████████████            28%
4-5 orders  ████████                  15%
6+ orders   █████                     12%
```

### GraphQL Query

```graphql
query VisitorsPage(
  $period: PeriodInput!
  $filters: VisitorFiltersInput
  $groupBy: GroupBy
  $sorting: SortingInput
  $pagination: PaginationInput
  $branchId: Int
) {
  visitorsAnalytics(
    period: $period
    filters: $filters
    groupBy: $groupBy
    sorting: $sorting
    pagination: $pagination
    branchId: $branchId
  ) {
    summary {
      totalCustomers
      newCustomers
      returningCustomers
      retentionRate
      avgOrdersPerCustomer
      avgSpendPerCustomer
    }
    items {
      customerId
      customerName
      customerPhone
      isNew
      ordersCount
      totalSpent
      avgCheck
      lastOrderAt
      firstOrderAt
    }
    cohorts {
      label # "1 order", "2-3 orders", etc.
      count
      percentage
      totalRevenue
    }
    retention {
      date
      rate
    }
    pagination {
      total
      page
      pageSize
      totalPages
    }
  }
}
```

---

## Export Feature

### Export Options

All pages support export with the same options:

```
┌───────────────────────────────────┐
│ Export                            │
├───────────────────────────────────┤
│                                   │
│ Format:                           │
│ ○ CSV (Free)                      │
│ ○ Excel (.xlsx) 👑 Premium        │
│ ○ PDF Report 👑 Premium           │
│                                   │
│ Data:                             │
│ ○ Current page (50 rows)          │
│ ● All data (1,234 rows)           │
│                                   │
│ Include:                          │
│ ☑ Summary metrics                 │
│ ☑ Charts (PDF only)               │
│                                   │
│           [Cancel] [Export]       │
│                                   │
└───────────────────────────────────┘
```

### GraphQL Mutation

```graphql
mutation ExportAnalytics(
  $pageCode: String!
  $format: ExportFormat!
  $period: PeriodInput!
  $filters: JSON
  $viewId: ID
) {
  exportAnalytics(
    pageCode: $pageCode
    format: $format
    period: $period
    filters: $filters
    viewId: $viewId
  ) {
    downloadUrl
    fileName
    expiresAt
  }
}
```

---

## Navigation

### Sidebar Menu

```
┌───────────────────────────────────┐
│ Analytics                      ▼  │
├───────────────────────────────────┤
│   📊 Dashboard                    │
│   ─────────────────               │
│   📋 Orders                       │
│   📦 Products                     │
│   📡 Channels                     │
│   👥 Staff                        │
│   🧑‍🤝‍🧑 Visitors                     │
└───────────────────────────────────┘
```

### Route Structure

```
/analytics              → Dashboard
/analytics/orders       → Orders page
/analytics/products     → Products page
/analytics/channels     → Channels page
/analytics/staff        → Staff page
/analytics/visitors     → Visitors page
```

---

## Responsive Behavior

### Desktop (≥1280px)

- Full sidebar + full content
- All columns visible
- Charts side-by-side

### Tablet (768-1279px)

- Collapsible sidebar
- Table with horizontal scroll
- Charts stacked

### Mobile (≤767px)

- Bottom navigation
- Card-based list (no table)
- Single chart view

---

## Performance Guidelines

| Metric            | Target  |
| ----------------- | ------- |
| Initial page load | < 1s    |
| Data fetch        | < 500ms |
| Filter change     | < 300ms |
| Export start      | < 2s    |

### Optimization Strategies

1. **Pagination**: Default 50 rows, max 100
2. **Debounce**: 300ms on filter changes
3. **Prefetch**: Load adjacent views on hover
4. **Cache**: 5-minute cache on view data
5. **Skeleton**: Show loading states immediately

---

## FAQ

**Q: Why is "Visitors" not foot traffic?**
A: We don't have sensors. "Visitors" = customers who ordered. Rename later if we add sensors.

**Q: Can users see individual customer details?**
A: Only summary data. Full customer profile requires CRM module (future).

**Q: How far back can data go?**
A: Daily stats: 3 years. Hourly: 90 days. Older data in monthly aggregates.

**Q: Can staff see their own analytics?**
A: Only if they have ANALYTICS permission. Role-based access control.

**Q: Are page-specific views separate?**
A: Yes. Each page has its own views. "High Value" in Orders ≠ "High Value" in Products.

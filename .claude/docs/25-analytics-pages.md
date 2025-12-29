# 25. Analytics Pages - Complete Step-by-Step Guide

This document covers all analytics sub-pages organized by subscription tier.

**API**: GraphQL (NOT REST)
**Endpoint**: `POST /graphql`
**Authentication**: JWT Bearer Token

---

## Subscription Tiers

Analytics pages are gated by subscription plan. See `docs/about/Pricing & Billing Spec.md` for full details.

### Page Access by Tier

| Page | BASIC ($29) | PRO ($59) | ULTRA ($119) |
|------|-------------|-----------|--------------|
| Sales Overview | Yes | Yes | Yes |
| Products | Yes | Yes | Yes |
| Categories | Yes | Yes | Yes |
| Payments | Yes | Yes | Yes |
| Staff | No | Yes | Yes |
| Customers | No | Yes | Yes |
| Heatmap | No | Yes | Yes |
| Channels | No | Yes | Yes |
| Branches | No | No | Yes |
| Financial | No | No | Yes |
| Forecasting | No | No | Yes |
| Alerts | No | No | Yes |

**Entitlements:**
- `analytics_basic` - 4 basic pages (included in BASIC)
- `analytics_pro` - 8 pages including Staff, Customers (included in PRO)
- `analytics_full` - All 12 pages including Financial, Forecasting (included in ULTRA)

### Page Visibility Logic

```
function getVisiblePages(entitlements) {
  pages = ['sales', 'products', 'categories', 'payments']  // Always visible

  if (entitlements.analytics_pro || entitlements.analytics_full) {
    pages.push('staff', 'customers', 'heatmap', 'channels')
  }

  if (entitlements.analytics_full) {
    pages.push('branches', 'financial', 'forecasting', 'alerts')
  }

  return pages
}
```

### Locked Page State

When user taps a locked page (higher tier required):

```
+------------------------------------------------------------------+
|                                                                   |
|  [Lock icon]                                                      |
|                                                                   |
|  Staff Analytics                                                  |
|                                                                   |
|  This feature requires PRO plan or higher.                        |
|                                                                   |
|  Upgrade now to unlock:                                           |
|  - Staff performance tracking                                     |
|  - Customer analytics                                             |
|  - Heatmap analysis                                               |
|  - And more...                                                    |
|                                                                   |
|  +------------------------------------------------------------+  |
|  |                     [ Upgrade to PRO ]                      |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Quick Summary

```
Analytics Menu
     |
     +-- BASIC TIER PAGES (analytics_basic)
     |   |
     |   +-- Sales Overview (salesOverview)
     |   +-- Products (productAnalytics)
     |   +-- Categories (categoryAnalytics)
     |   +-- Payments (paymentMethodsAnalytics)
     |
     +-- PRO TIER PAGES (analytics_pro)
     |   |
     |   +-- Staff (staffAnalytics)
     |   +-- Customers (customerOverview, rfmAnalysis, cohortAnalysis, ltvAnalysis)
     |   +-- Heatmap (heatmap)
     |   +-- Channels (channelsAnalytics)
     |
     +-- ULTRA TIER PAGES (analytics_full)
         |
         +-- Branches (branchComparison, branchBenchmark, branchTrends)
         +-- Financial (profitLoss, marginAnalysis, cashFlow, revenueBreakdown)
         +-- Forecasting (forecast, projections)
         +-- Alerts (alertSummary, anomalyDetection)
```

---

## Design Philosophy

**Dashboard** = Overview with KPIs, charts, widgets
**Analytics Pages** = Data tables/lists for detailed analysis

Analytics pages are NOT mini-dashboards. They are data exploration tools:
- Primary focus: **Data Table**
- Secondary: Filters, sorting, export
- Optional: Small summary metrics (but not KPI cards with charts)

## Common Page Structure

Every analytics page follows this layout:

```
+------------------------------------------------------------------+
|  <- Back    [Page Title]         [Views: Default v] [Period v]    |
|                                                                   |
|  [Filters Row: Search, Category, Channel, etc.]                   |
|                                                                   |
|  Data Table                                                       |
|  +---------------------------------------------------------------+|
|  | Column 1 ^ | Column 2     | Column 3     | Column 4        ||
|  |------------|--------------|--------------|------------------|
|  | Row 1      | ...          | ...          | ...              ||
|  | Row 2      | ...          | ...          | ...              ||
|  | Row 3      | ...          | ...          | ...              ||
|  | ...        | ...          | ...          | ...              ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Showing 1-20 of 156                        [<] [1] [2] [3] [>]   |
|  [Export CSV]                                                     |
+------------------------------------------------------------------+
```

Key differences from Dashboard:
- **NO KPI cards row** (that's what Dashboard is for)
- **NO big charts** (Dashboard has the main chart)
- **Focus on table** with sorting, filtering, pagination
- **Export option** for data analysis

---

# BASIC TIER PAGES

These pages are available to all plans (BASIC, PRO, ULTRA).

**Required Entitlement:** `analytics_basic`

---

# Part 1: Sales Overview

## Screen 0: Sales Overview

### When to Show

Show this screen when:
- User navigates to Analytics > Sales
- User has at least `analytics_basic` entitlement

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Sales Overview         [Views v] [Today v]        |
|                                                                   |
|  Summary Table                                                    |
|  +---------------------------------------------------------------+|
|  | Metric          | Today      | Yesterday  | Change            ||
|  |-----------------|------------|------------|-------------------|
|  | Gross Sales     | 13,125,000 | 11,800,000 | +11.2%            ||
|  | Refunds         |   (200,000)|   (180,000)| +11.1%            ||
|  | Discounts       |   (425,000)|   (420,000)| +1.2%             ||
|  | Net Revenue     | 12,500,000 | 11,200,000 | +11.6%            ||
|  | Orders          |        156 |        148 | +5.2%             ||
|  | Avg Check       |     80,128 |     75,675 | +6.1%             ||
|  | Tips            |    625,000 |    560,000 | +11.6%            ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  [Export CSV]                                                     |
+------------------------------------------------------------------+
```

Note: This is a summary table, not a data list. It shows aggregated metrics.

### API Call

```
POST /graphql

Query:
query SalesOverview($period: PeriodInput!, $branchId: Int) {
  salesOverview(period: $period, branchId: $branchId)
}

Variables:
{
  "period": { "type": "TODAY" },
  "branchId": 1
}

Success Response:
{
  "data": {
    "salesOverview": {
      "summary": {
        "grossSales": 13125000,
        "refunds": 200000,
        "discounts": 425000,
        "netRevenue": 12500000,
        "tips": 625000,
        "orderCount": 156,
        "avgCheck": 80128
      },
      "changes": {
        "revenue": 11.6,
        "orders": 5.2,
        "avgCheck": 6.1,
        "discounts": 3.2
      },
      "hourlyBreakdown": [
        { "hour": 9, "revenue": 450000, "orders": 6 },
        { "hour": 10, "revenue": 680000, "orders": 9 },
        { "hour": 11, "revenue": 1200000, "orders": 15 }
      ]
    }
  }
}
```

---

# Part 2: Products Analytics

## Screen 1: Products List

### When to Show

Show this screen when:
- User navigates to Analytics > Products
- User has `reports:sales` permission
- User has at least `analytics_basic` entitlement

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Products            [Views v] [This Week v]      |
|                                                                   |
|  [Search: ___________] [Category: All v] [Sort: Revenue v]        |
|                                                                   |
|  +---------------------------------------------------------------+|
|  | # | Product          | Qty  | Revenue    | Share | ABC | ^   ||
|  |---|------------------|------|------------|-------|-----|-----||
|  | 1 | Pizza Margherita | 234  | 11,700,000 | 26%   | A   | +5% ||
|  | 2 | Burger Classic   | 189  |  7,560,000 | 17%   | A   | +3% ||
|  | 3 | Caesar Salad     | 156  |  4,680,000 | 10%   | B   | -2% ||
|  | 4 | Pasta Carbonara  | 134  |  4,020,000 |  9%   | B   | +1% ||
|  | 5 | Lemonade         | 312  |  3,120,000 |  7%   | B   | +8% ||
|  | 6 | ...              | ...  | ...        | ...   | ... | ... ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Showing 1-20 of 89                            [<] [1] [2] [>]    |
|  [Export CSV]                                                     |
+------------------------------------------------------------------+
```

### Column Definitions

| Column | Description | Sortable |
|--------|-------------|----------|
| # | Rank by primary metric | No |
| Product | Product name | Yes |
| Qty | Units sold | Yes |
| Revenue | Total revenue | Yes (default) |
| Share | % of total revenue | Yes |
| ABC | ABC classification | Yes |
| Change | vs previous period | Yes |

### ABC Classification Colors

| Class | Color | Description |
|-------|-------|-------------|
| A | Green | Top 20% products = 80% revenue |
| B | Yellow | Next 30% products = 15% revenue |
| C | Red | Bottom 50% products = 5% revenue |

### API Call

```
POST /graphql

Query:
query ProductAnalytics($period: PeriodInput!, $branchId: Int, $limit: Int) {
  productAnalytics(period: $period, branchId: $branchId, limit: $limit)
}

Variables:
{
  "period": { "type": "THIS_WEEK" },
  "branchId": 1,
  "limit": 20
}

Success Response:
{
  "data": {
    "productAnalytics": {
      "summary": {
        "totalRevenue": 45000000,
        "totalQuantity": 1234,
        "uniqueProducts": 89,
        "avgPrice": 36469,
        "changes": {
          "revenue": 12.5,
          "quantity": 8.2,
          "products": 3,
          "avgPrice": 4.1
        }
      },
      "products": [
        {
          "rank": 1,
          "id": 101,
          "name": "Pizza Margherita",
          "categoryId": 1,
          "categoryName": "Pizza",
          "quantity": 234,
          "revenue": 11700000,
          "share": 26,
          "abcClass": "A",
          "change": 5.2,
          "trend": "UP"
        }
      ],
      "pagination": {
        "total": 89,
        "offset": 0,
        "limit": 20
      }
    }
  }
}
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Tap product row | GO TO Screen 2 (Product Detail) |
| Tap column header | Sort by that column |
| Type in search | Filter products by name |
| Select category filter | Filter by category |
| Change period | Reload with new period |
| Tap [Views v] | Open views dropdown |

---

## Screen 2: Product Detail

### When to Show

Show this screen when:
- User taps a product row in Products List

### UI Layout

```
+------------------------------------------------------------------+
|  <- Products    Pizza Margherita                  [This Week v]   |
|                                                                   |
|  +------------+ +------------+ +------------+ +------------+      |
|  | Revenue    | | Quantity   | | Share      | | Avg Price  |      |
|  | 11,700,000 | | 234        | | 26%        | | 50,000     |      |
|  | +5.2%      | | +12        | | +2.1pp     | | -0.5%      |      |
|  +------------+ +------------+ +------------+ +------------+      |
|                                                                   |
|  Revenue Trend                                                    |
|  +---------------------------------------------------------------+|
|  |     ____                                                      ||
|  |    /    \        ____                                         ||
|  | __/      \______/    \______                                  ||
|  | Mon   Tue   Wed   Thu   Fri   Sat   Sun                       ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Performance by Day                                               |
|  +---------------------------------------------------------------+|
|  | Day       | Qty  | Revenue    | Avg Time                     ||
|  |-----------|------|------------|------------------------------|
|  | Monday    |  28  |  1,400,000 | Peak: 12:00-14:00           ||
|  | Tuesday   |  32  |  1,600,000 | Peak: 19:00-21:00           ||
|  | Wednesday |  45  |  2,250,000 | Peak: 12:00-14:00           ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

---

# Part 3: Payments Analytics

## Screen 2.5: Payments Overview

### When to Show

Show this screen when:
- User navigates to Analytics > Payments
- User has at least `analytics_basic` entitlement

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Payments              [Views v] [This Week v]     |
|                                                                   |
|  [Sort: Amount v]                                                 |
|                                                                   |
|  +---------------------------------------------------------------+|
|  | Method    | Transactions | Amount     | Share | Avg Amount   ||
|  |-----------|--------------|------------|-------|--------------|
|  | Cash      | 345          | 20,700,000 | 46%   | 60,000       ||
|  | Card      | 234          | 17,100,000 | 38%   | 73,077       ||
|  | Payme     | 89           |  4,500,000 | 10%   | 50,562       ||
|  | Click     | 56           |  2,700,000 |  6%   | 48,214       ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Total: 45,000,000 (724 transactions)                            |
|  [Export CSV]                                                     |
+------------------------------------------------------------------+
```

### API Call

```
POST /graphql

Query:
query PaymentMethodsAnalytics($period: PeriodInput!, $branchId: Int) {
  paymentMethodsAnalytics(period: $period, branchId: $branchId)
}

Variables:
{
  "period": { "type": "THIS_WEEK" },
  "branchId": 1
}

Success Response:
{
  "data": {
    "paymentMethodsAnalytics": {
      "summary": {
        "totalAmount": 45000000,
        "totalTransactions": 724,
        "changes": {
          "total": 8.5,
          "cash": 5.2,
          "card": 12.3,
          "online": 15.1
        }
      },
      "methods": [
        {
          "method": "CASH",
          "label": "Cash",
          "transactions": 345,
          "amount": 20700000,
          "share": 46,
          "avgAmount": 60000
        },
        {
          "method": "CARD",
          "label": "Card",
          "transactions": 234,
          "amount": 17100000,
          "share": 38,
          "avgAmount": 73077
        }
      ]
    }
  }
}
```

---

# PRO TIER PAGES

These pages require PRO plan or higher.

**Required Entitlement:** `analytics_pro` or `analytics_full`

---

# Part 4: Staff Analytics

## Screen 3: Staff List

### When to Show

Show this screen when:
- User navigates to Analytics > Staff
- User has `reports:staff` permission
- **User has `analytics_pro` or `analytics_full` entitlement**

Do NOT show when:
- User only has `analytics_basic` (show upgrade prompt)

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Staff               [Views v] [This Week v]      |
|                                                                   |
|  [Search: ___________] [Role: All v] [Sort: Revenue v]            |
|                                                                   |
|  +---------------------------------------------------------------+|
|  | # | Employee         | Role   | Orders | Revenue    | Tips   ||
|  |---|------------------|--------|--------|------------|--------|
|  | 1 | John Smith       | Waiter | 89     | 7,120,000  | 356,000||
|  | 2 | Maria Garcia     | Waiter | 76     | 6,080,000  | 304,000||
|  | 3 | Alex Johnson     | Cashier| 72     | 5,760,000  | 288,000||
|  | 4 | ...              | ...    | ...    | ...        | ...    ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Showing 1-20 of 45                            [<] [1] [2] [>]    |
|  [Export CSV]                                                     |
+------------------------------------------------------------------+
```

### API Call

```
POST /graphql

Query:
query StaffAnalytics($period: PeriodInput!, $branchId: Int) {
  staffAnalytics(period: $period, branchId: $branchId)
}

Variables:
{
  "period": { "type": "THIS_WEEK" },
  "branchId": 1
}

Success Response:
{
  "data": {
    "staffAnalytics": {
      "summary": {
        "totalRevenue": 45000000,
        "totalOrders": 567,
        "avgCheck": 79365,
        "totalTips": 2250000,
        "changes": {
          "revenue": 10.2,
          "orders": 5.8,
          "avgCheck": 4.2,
          "tips": 15.3
        }
      },
      "staff": [
        {
          "rank": 1,
          "id": 201,
          "name": "John Smith",
          "role": "Waiter",
          "orders": 89,
          "revenue": 7120000,
          "tips": 356000,
          "avgCheck": 80000,
          "change": 8.5
        }
      ]
    }
  }
}
```

---

# Part 5: Heatmap Analytics

## Screen 3.5: Heatmap

### When to Show

Show this screen when:
- User navigates to Analytics > Heatmap
- **User has `analytics_pro` or `analytics_full` entitlement**

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Heatmap               [Views v] [This Month v]    |
|                                                                   |
|  Orders by Hour x Day of Week                                     |
|  +---------------------------------------------------------------+|
|  |     | Mon | Tue | Wed | Thu | Fri | Sat | Sun                 ||
|  |-----|-----|-----|-----|-----|-----|-----|-----                ||
|  | 09  |  2  |  3  |  2  |  4  |  3  |  8  | 12                  ||
|  | 10  |  5  |  6  |  5  |  7  |  8  | 15  | 18                  ||
|  | 11  |  8  | 10  |  9  | 11  | 12  | 22  | 25                  ||
|  | 12  | 15  | 18  | 16  | 20  | 22  | 35  | 38                  ||
|  | 13  | 18  | 20  | 18  | 22  | 25  | 40  | 42                  ||
|  | 14  | 12  | 14  | 13  | 15  | 18  | 30  | 32                  ||
|  | ... | ... | ... | ... | ... | ... | ... | ...                 ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Legend: [Low] [Med] [High] [Peak]                               |
|                                                                   |
|  Peak Hours                                                       |
|  +---------------------------------------------------------------+|
|  | 1. Saturday 13:00 - 42 orders                                 ||
|  | 2. Sunday 13:00 - 42 orders                                   ||
|  | 3. Sunday 12:00 - 38 orders                                   ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### Heatmap Cell Colors

| Orders | Color | Level |
|--------|-------|-------|
| 0-5 | Light | Low |
| 6-15 | Yellow | Medium |
| 16-30 | Orange | High |
| 31+ | Red | Peak |

### API Call

```
POST /graphql

Query:
query Heatmap($period: PeriodInput!, $metric: KpiType, $branchId: Int) {
  heatmap(period: $period, metric: $metric, branchId: $branchId)
}

Variables:
{
  "period": { "type": "THIS_MONTH" },
  "metric": "ORDERS",
  "branchId": 1
}

Success Response:
{
  "data": {
    "heatmap": {
      "metric": "ORDERS",
      "cells": [
        { "dayOfWeek": 1, "hour": 9, "value": 2 },
        { "dayOfWeek": 1, "hour": 10, "value": 5 },
        { "dayOfWeek": 1, "hour": 11, "value": 8 }
      ],
      "peakHours": [
        { "dayOfWeek": 6, "hour": 13, "value": 42, "label": "Saturday 13:00" },
        { "dayOfWeek": 0, "hour": 13, "value": 42, "label": "Sunday 13:00" }
      ]
    }
  }
}
```

---

# Part 6: Customer Analytics

## Screen 4: Customers List

### When to Show

Show this screen when:
- User navigates to Analytics > Customers
- User has `reports:customers` permission (if exists) or `reports:sales`
- **User has `analytics_pro` or `analytics_full` entitlement**

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Customers           [Views v] [Last 30 Days v]   |
|                                                                   |
|  [Search: ___________] [Segment: All v] [Sort: Revenue v]         |
|                                                                   |
|  +---------------------------------------------------------------+|
|  | Customer        | Segment    | Orders | Revenue    | Last Ord ||
|  |-----------------|------------|--------|------------|----------|
|  | John Doe        | Champion   | 45     | 4,500,000  | Today    ||
|  | Jane Smith      | Loyal      | 23     | 2,300,000  | 3d ago   ||
|  | Bob Wilson      | At Risk    | 12     | 1,200,000  | 30d ago  ||
|  | Alice Brown     | New        | 2      |   200,000  | Yesterday||
|  | ...             | ...        | ...    | ...        | ...      ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Showing 1-20 of 1,234                         [<] [1] [2] [>]    |
|  [Export CSV]                                                     |
+------------------------------------------------------------------+
```

### Tabs (Optional Sub-views)

| Tab | Description | Content |
|-----|-------------|---------|
| All Customers | Default view | Full customer list |
| By Segment | Group by RFM segment | Champions, Loyal, At Risk, etc. |
| Top Customers | Sorted by revenue | Best customers first |

### Tab Navigation

| Tab | Query | Description |
|-----|-------|-------------|
| Overview | `customerOverview` | Summary and segments |
| RFM Analysis | `rfmAnalysis` | RFM segmentation |
| Cohorts | `cohortAnalysis` | Retention by cohort |
| LTV | `ltvAnalysis` | Lifetime value |

### API Call: Customer Overview

```
POST /graphql

Query:
query CustomerOverview($period: PeriodInput!, $branchId: Int) {
  customerOverview(period: $period, branchId: $branchId)
}

Variables:
{
  "period": { "type": "LAST_30_DAYS" },
  "branchId": 1
}

Success Response:
{
  "data": {
    "customerOverview": {
      "summary": {
        "totalCustomers": 1234,
        "activeCustomers": 456,
        "newCustomers": 123,
        "returningCustomers": 333,
        "churnedCustomers": 89
      },
      "metrics": {
        "activeRate": 36.9,
        "retentionRate": 45.2,
        "churnRate": 12.8,
        "avgOrdersPerCustomer": 2.3,
        "avgRevenuePerCustomer": 156000
      },
      "segments": [
        {
          "segment": "CHAMPIONS",
          "segmentLabel": "Champions",
          "count": 185,
          "share": 15.0,
          "revenue": 12500000
        },
        {
          "segment": "LOYAL",
          "segmentLabel": "Loyal",
          "count": 271,
          "share": 22.0,
          "revenue": 9800000
        }
      ]
    }
  }
}
```

---

## Screen 5: RFM Analysis

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Customers           [Views v] [Last 365 Days v]  |
|                                                                   |
|  [Overview] [RFM Analysis] [Cohorts] [LTV]                        |
|              ────────────                                         |
|                                                                   |
|  RFM Segments                                                     |
|  +---------------------------------------------------------------+|
|  | Segment          | Count | Share | Avg R | Avg F | Avg M     ||
|  |------------------|-------|-------|-------|-------|-----------|
|  | Champions        | 185   | 15%   | 5     | 5     | 5         ||
|  | Loyal Customers  | 271   | 22%   | 4     | 4     | 4         ||
|  | Potential Loyal  | 156   | 13%   | 4     | 3     | 4         ||
|  | At Risk          | 222   | 18%   | 2     | 4     | 4         ||
|  | Can't Lose       | 89    | 7%    | 1     | 5     | 5         ||
|  | Hibernating      | 247   | 20%   | 1     | 2     | 2         ||
|  | Lost             | 185   | 15%   | 1     | 1     | 1         ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  RFM Distribution                                                 |
|  +---------------------------------------------------------------+|
|  | Recency  | [=====] 5 | [====] 4 | [===] 3 | [==] 2 | [=] 1   ||
|  | Frequency| [====] 5  | [===] 4  | [==] 3  | [=] 2  | [=] 1   ||
|  | Monetary | [=====] 5 | [===] 4  | [==] 3  | [=] 2  | [=] 1   ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### RFM Segment Definitions

| Segment | R Score | F Score | M Score | Action |
|---------|---------|---------|---------|--------|
| Champions | 5 | 5 | 5 | Reward them |
| Loyal | 4-5 | 4-5 | 4-5 | Upsell |
| Potential Loyalist | 4-5 | 2-3 | 3-4 | Nurture |
| At Risk | 2-3 | 4-5 | 4-5 | Win back |
| Can't Lose | 1-2 | 5 | 5 | Urgent reactivation |
| Hibernating | 1-2 | 1-2 | 1-2 | Reactivation campaign |
| Lost | 1 | 1 | 1 | Ignore or special offer |

### API Call

```
POST /graphql

Query:
query RfmAnalysis($lookbackDays: Int, $branchId: Int) {
  rfmAnalysis(lookbackDays: $lookbackDays, branchId: $branchId)
}

Variables:
{
  "lookbackDays": 365,
  "branchId": 1
}
```

---

## Screen 6: Cohort Analysis

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Customers           [Views v] [6 Months v]       |
|                                                                   |
|  [Overview] [RFM Analysis] [Cohorts] [LTV]                        |
|                            ────────                               |
|                                                                   |
|  Cohort Retention Grid                                            |
|  +---------------------------------------------------------------+|
|  | Cohort    | Size | M0   | M1   | M2   | M3   | M4   | M5     ||
|  |-----------|------|------|------|------|------|------|--------|
|  | Jul 2025  | 156  | 100% | 45%  | 32%  | 28%  | 25%  | 22%    ||
|  | Aug 2025  | 189  | 100% | 48%  | 35%  | 30%  | 27%  | -      ||
|  | Sep 2025  | 201  | 100% | 52%  | 38%  | 33%  | -    | -      ||
|  | Oct 2025  | 178  | 100% | 50%  | 36%  | -    | -    | -      ||
|  | Nov 2025  | 167  | 100% | 47%  | -    | -    | -    | -      ||
|  | Dec 2025  | 123  | 100% | -    | -    | -    | -    | -      ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Average Retention                                                |
|  +---------------------------------------------------------------+|
|  | Month 1: 48.7% | Month 3: 32.3% | Month 6: 22.0%              ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### Color Coding for Retention

| Retention % | Color |
|-------------|-------|
| 50%+ | Green |
| 30-50% | Yellow |
| 15-30% | Orange |
| <15% | Red |

### API Call

```
POST /graphql

Query:
query CohortAnalysis($months: Int, $branchId: Int) {
  cohortAnalysis(months: $months, branchId: $branchId)
}

Variables:
{
  "months": 6,
  "branchId": 1
}

Success Response:
{
  "data": {
    "cohortAnalysis": {
      "cohorts": [
        {
          "cohortDate": "2025-07-01",
          "cohortLabel": "Jul 2025",
          "initialSize": 156,
          "retention": [
            { "period": 0, "activeCount": 156, "retentionRate": 100, "revenue": 7800000 },
            { "period": 1, "activeCount": 70, "retentionRate": 45, "revenue": 3500000 },
            { "period": 2, "activeCount": 50, "retentionRate": 32, "revenue": 2500000 }
          ]
        }
      ],
      "avgRetention": {
        "period1": 48.7,
        "period3": 32.3,
        "period6": 22.0
      }
    }
  }
}
```

---

# ULTRA TIER PAGES

These pages require ULTRA plan.

**Required Entitlement:** `analytics_full`

---

# Part 8: Financial Analytics

## Screen 7: Profit & Loss

### When to Show

Show this screen when:
- User navigates to Analytics > Financial
- User has `reports:financial` permission
- **User has `analytics_full` entitlement**

Do NOT show when:
- User has `analytics_basic` or `analytics_pro` only (show upgrade prompt to ULTRA)

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Financial           [Views v] [This Month v]     |
|                                                                   |
|  [P&L] [Margins] [Cash Flow] [Revenue]                            |
|  ────                                                             |
|                                                                   |
|  Profit & Loss Statement                                          |
|  +---------------------------------------------------------------+|
|  |                           | This Month  | Last Month | Change ||
|  |---------------------------|-------------|------------|--------|
|  | Revenue                   |             |            |        ||
|  |   Gross Sales             | 52,000,000  | 48,000,000 | +8.3%  ||
|  |   Refunds                 |   (800,000) |   (600,000)| +33.3% ||
|  |   Discounts               | (1,200,000) | (1,000,000)| +20.0% ||
|  | ─────────────────────────────────────────────────────────────||
|  | Net Revenue               | 50,000,000  | 46,400,000 | +7.8%  ||
|  |                           |             |            |        ||
|  | Expenses                  |             |            |        ||
|  |   Cost of Goods           | 18,000,000  | 16,500,000 | +9.1%  ||
|  |   Labor                   | 12,000,000  | 11,500,000 | +4.3%  ||
|  |   Operating               |  5,000,000  |  4,800,000 | +4.2%  ||
|  | ─────────────────────────────────────────────────────────────||
|  | Total Expenses            | 35,000,000  | 32,800,000 | +6.7%  ||
|  |                           |             |            |        ||
|  | Net Profit                | 15,000,000  | 13,600,000 | +10.3% ||
|  | Profit Margin             | 30.0%       | 29.3%      | +0.7pp ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### API Call

```
POST /graphql

Query:
query ProfitLoss($period: PeriodInput!, $branchId: Int, $comparePreviousPeriod: Boolean) {
  profitLoss(period: $period, branchId: $branchId, comparePreviousPeriod: $comparePreviousPeriod)
}

Variables:
{
  "period": { "type": "THIS_MONTH" },
  "branchId": 1,
  "comparePreviousPeriod": true
}
```

---

## Screen 8: Margin Analysis

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Financial           [Views v] [This Month v]     |
|                                                                   |
|  [P&L] [Margins] [Cash Flow] [Revenue]                            |
|        ────────                                                   |
|                                                                   |
|  +------------+ +------------+ +------------+ +------------+      |
|  | Avg Margin | | High Marg  | | Low Margin | | Negative   |      |
|  | 42.5%      | | 23 items   | | 12 items   | | 3 items    |      |
|  +------------+ +------------+ +------------+ +------------+      |
|                                                                   |
|  Products by Margin                                               |
|  +---------------------------------------------------------------+|
|  | Product          | Cost    | Price   | Margin | Class        ||
|  |------------------|---------|---------|--------|--------------|
|  | Lemonade         |  3,000  | 10,000  | 70.0%  | HIGH         ||
|  | Caesar Salad     | 12,000  | 30,000  | 60.0%  | HIGH         ||
|  | Pasta Carbonara  | 18,000  | 30,000  | 40.0%  | MEDIUM       ||
|  | Burger Classic   | 25,000  | 40,000  | 37.5%  | MEDIUM       ||
|  | Pizza Margherita | 30,000  | 50,000  | 40.0%  | MEDIUM       ||
|  | Steak Ribeye     | 65,000  | 85,000  | 23.5%  | LOW          ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### Margin Class Colors

| Class | Margin % | Color |
|-------|----------|-------|
| HIGH | 50%+ | Green |
| MEDIUM | 30-50% | Yellow |
| LOW | 15-30% | Orange |
| NEGATIVE | <15% | Red |

---

# Part 7: Channels Analytics

## Screen 9: Channels Overview

### When to Show

Show this screen when:
- User navigates to Analytics > Channels
- **User has `analytics_pro` or `analytics_full` entitlement**

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Channels            [Views v] [This Week v]      |
|                                                                   |
|  Channel Split                                                    |
|  +---------------------------------------------------------------+|
|  |                                                               ||
|  |         [PIE CHART]                                           ||
|  |                                                               ||
|  |    Dine-In: 45%     Delivery: 30%     Takeaway: 25%          ||
|  |                                                               ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Channel Breakdown                                                |
|  +---------------------------------------------------------------+|
|  | Channel   | Orders | Revenue    | Share | Avg Check | Change ||
|  |-----------|--------|------------|-------|-----------|--------|
|  | Dine-In   | 234    | 20,250,000 | 45%   | 86,538    | +5.2%  ||
|  | Delivery  | 156    | 13,500,000 | 30%   | 86,538    | +12.3% ||
|  | Takeaway  | 112    | 11,250,000 | 25%   | 100,446   | +3.1%  ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### API Call

```
POST /graphql

Query:
query ChannelsAnalytics($period: PeriodInput!, $branchId: Int) {
  channelsAnalytics(period: $period, branchId: $branchId)
}

Variables:
{
  "period": { "type": "THIS_WEEK" },
  "branchId": 1
}
```

---

# Part 9: Branch Analytics

## Screen 10: Branch Comparison

### When to Show

Show this screen when:
- User navigates to Analytics > Branches
- User has access to multiple branches
- User has `reports:sales` permission
- **User has `analytics_full` entitlement**

Do NOT show when:
- User only has one branch (hide this page entirely)
- User has `analytics_basic` or `analytics_pro` only (show upgrade prompt to ULTRA)

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Branches            [Views v] [This Week v]      |
|                                                                   |
|  [Comparison] [Benchmark] [Trends]                                |
|  ───────────                                                      |
|                                                                   |
|  Branch Comparison                                                |
|  +---------------------------------------------------------------+|
|  | Branch      | Revenue    | Orders | Avg Check | vs Avg       ||
|  |-------------|------------|--------|-----------|--------------|
|  | Main        | 25,000,000 | 312    | 80,128    | +15.2%       ||
|  | Downtown    | 18,000,000 | 234    | 76,923    | -2.3%        ||
|  | Airport     | 15,000,000 | 189    | 79,365    | +0.8%        ||
|  | Mall        | 12,000,000 | 156    | 76,923    | -3.1%        ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Comparison Chart                                                 |
|  +---------------------------------------------------------------+|
|  | [Bar chart comparing branches by revenue]                     ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### API Call

```
POST /graphql

Query:
query BranchComparison($period: PeriodInput!, $sortBy: String) {
  branchComparison(period: $period, sortBy: $sortBy)
}

Variables:
{
  "period": { "type": "THIS_WEEK" },
  "sortBy": "REVENUE"
}

Note: sortBy must be UPPERCASE (REVENUE, ORDERS, AVG_CHECK)
```

---

## Screen 11: Branch Benchmark

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Branches            [Views v] [This Week v]      |
|                                                                   |
|  [Comparison] [Benchmark] [Trends]                                |
|               ──────────                                          |
|                                                                   |
|  Benchmark vs Network Average                                     |
|  +---------------------------------------------------------------+|
|  |                  | Main    | Downtown | Airport | Mall        ||
|  |------------------|---------|----------|---------|-------------|
|  | Revenue          | ABOVE   | AVERAGE  | BELOW   | BELOW       ||
|  | Orders           | ABOVE   | ABOVE    | AVERAGE | BELOW       ||
|  | Avg Check        | ABOVE   | BELOW    | ABOVE   | BELOW       ||
|  | Customer Count   | ABOVE   | AVERAGE  | BELOW   | BELOW       ||
|  | Retention Rate   | ABOVE   | BELOW    | AVERAGE | BELOW       ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Legend: ABOVE = Green | AVERAGE = Yellow | BELOW = Red          |
|                                                                   |
+------------------------------------------------------------------+
```

### Benchmark Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| ABOVE | Green | >10% above network average |
| AVERAGE | Yellow | Within ±10% of average |
| BELOW | Red | >10% below network average |

---

# Part 10: Forecasting Analytics

## Screen 12: Forecasting

### When to Show

Show this screen when:
- User navigates to Analytics > Forecasting
- **User has `analytics_full` entitlement**

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Forecasting           [Views v] [7 Day v]         |
|                                                                   |
|  Revenue Forecast                                                 |
|  +---------------------------------------------------------------+|
|  |                                                               ||
|  |          Actual          Forecast                             ||
|  |     ____    ·····        ......                               ||
|  |    /    \  ·     ·......      .....                           ||
|  | __/      \·                        ....                       ||
|  |                                                               ||
|  | Mon  Tue  Wed  Thu  Fri  Sat  Sun  Mon  Tue  Wed              ||
|  |         (past)         |        (forecast)                    ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Predictions                                                      |
|  +---------------------------------------------------------------+|
|  | Date       | Predicted Revenue | Predicted Orders | Confidence||
|  |------------|-------------------|------------------|-----------|
|  | Dec 29     | 14,200,000        | 178              | 85%       ||
|  | Dec 30     | 15,800,000        | 198              | 82%       ||
|  | Dec 31     | 22,500,000        | 281              | 78%       ||
|  | Jan 1      | 18,000,000        | 225              | 75%       ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Key Insights                                                     |
|  +---------------------------------------------------------------+|
|  | [!] Expected 42% revenue increase on Dec 31 (New Year's Eve)  ||
|  | [i] Based on historical patterns and seasonal trends          ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### API Call

```
POST /graphql

Query:
query Forecast($metric: KpiType!, $daysAhead: Int, $branchId: Int) {
  forecast(metric: $metric, daysAhead: $daysAhead, branchId: $branchId)
}

Variables:
{
  "metric": "REVENUE",
  "daysAhead": 7,
  "branchId": 1
}

Success Response:
{
  "data": {
    "forecast": {
      "metric": "REVENUE",
      "historicalPoints": [
        { "date": "2025-12-22", "value": 12500000, "type": "ACTUAL" },
        { "date": "2025-12-23", "value": 13200000, "type": "ACTUAL" }
      ],
      "forecastPoints": [
        { "date": "2025-12-29", "value": 14200000, "confidence": 0.85, "type": "FORECAST" },
        { "date": "2025-12-30", "value": 15800000, "confidence": 0.82, "type": "FORECAST" }
      ],
      "insights": [
        {
          "type": "PEAK",
          "message": "Expected 42% revenue increase on Dec 31 (New Year's Eve)",
          "date": "2025-12-31"
        }
      ]
    }
  }
}
```

---

# Part 11: Alerts Analytics

## Screen 13: Alerts & Anomalies

### When to Show

Show this screen when:
- User navigates to Analytics > Alerts
- **User has `analytics_full` entitlement**

### UI Layout

```
+------------------------------------------------------------------+
|  <- Analytics    Alerts                [Active] [History]          |
|                                                                   |
|  Active Alerts (3)                                                |
|  +---------------------------------------------------------------+|
|  | [!] CRITICAL - Revenue Drop                                   ||
|  |     Revenue down 35% compared to same day last week           ||
|  |     Detected: Today 14:30   Branch: Downtown                  ||
|  |     [View Details] [Dismiss]                                  ||
|  +---------------------------------------------------------------+|
|  | [!] WARNING - Unusual Refund Activity                         ||
|  |     Refund rate 8.5% vs normal 2.3%                           ||
|  |     Detected: Today 12:15   Branch: Main                      ||
|  |     [View Details] [Dismiss]                                  ||
|  +---------------------------------------------------------------+|
|  | [i] INFO - New Product Trending                               ||
|  |     "Seasonal Special" up 250% in orders                      ||
|  |     Detected: Today 10:00   Branch: All                       ||
|  |     [View Details] [Dismiss]                                  ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Alert Settings                                                   |
|  +---------------------------------------------------------------+|
|  | Revenue drop threshold    | [-15%] [v]                        ||
|  | Refund spike threshold    | [+100%] [v]                       ||
|  | Discount abuse threshold  | [+50%] [v]                        ||
|  | Email notifications       | [ON] [v]                          ||
|  +---------------------------------------------------------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### Alert Types

| Type | Color | Trigger |
|------|-------|---------|
| CRITICAL | Red | Revenue drop >30%, major anomaly |
| WARNING | Orange | Unusual patterns, thresholds exceeded |
| INFO | Blue | Positive trends, opportunities |

### API Call

```
POST /graphql

Query:
query AlertSummary($branchId: Int, $status: AlertStatus) {
  alertSummary(branchId: $branchId, status: $status)
}

Variables:
{
  "branchId": null,
  "status": "ACTIVE"
}

Success Response:
{
  "data": {
    "alertSummary": {
      "activeCount": 3,
      "alerts": [
        {
          "id": "alert-001",
          "type": "REVENUE_DROP",
          "severity": "CRITICAL",
          "title": "Revenue Drop",
          "message": "Revenue down 35% compared to same day last week",
          "detectedAt": "2025-12-28T14:30:00Z",
          "branchId": 2,
          "branchName": "Downtown",
          "metadata": {
            "currentValue": 8500000,
            "expectedValue": 13000000,
            "changePercent": -35
          }
        }
      ]
    }
  }
}
```

---

## Complete Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                     ANALYTICS MENU                               │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────┐            ┌─────────┐            ┌─────────┐
   │Products │            │  Staff  │            │Customers│
   └────┬────┘            └────┬────┘            └────┬────┘
        │                      │                      │
        ▼                      ▼                      ▼
   ┌─────────┐            ┌─────────┐         ┌──────────────┐
   │ Screen  │            │ Screen  │         │   Tab Nav    │
   │   1     │            │   3     │         │ [O][R][C][L] │
   └────┬────┘            └─────────┘         └──────┬───────┘
        │                                            │
        ▼                               ┌────────────┼────────────┐
   ┌─────────┐                          ▼            ▼            ▼
   │ Screen  │                     Screen 4    Screen 5     Screen 6
   │   2     │                     Overview    RFM          Cohorts
   │ Detail  │
   └─────────┘

        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────┐            ┌─────────┐            ┌─────────┐
   │Financial│            │Channels │            │Branches │
   └────┬────┘            └────┬────┘            └────┬────┘
        │                      │                      │
        ▼                      ▼                      ▼
   ┌──────────────┐       ┌─────────┐         ┌──────────────┐
   │   Tab Nav    │       │ Screen  │         │   Tab Nav    │
   │[P&L][M][C][R]│       │   9     │         │ [Cmp][B][T]  │
   └──────┬───────┘       └─────────┘         └──────┬───────┘
          │                                          │
     ┌────┼────┐                            ┌────────┼────────┐
     ▼    ▼    ▼                            ▼        ▼        ▼
  Scr 7  Scr 8  ...                     Screen 10 Screen 11  ...
  P&L    Margin                         Compare   Benchmark
```

---

## API Reference

| Page | Query | Parameters |
|------|-------|------------|
| Products | `productAnalytics` | period, branchId, limit |
| Categories | `categoryAnalytics` | period, branchId |
| Staff | `staffAnalytics` | period, branchId |
| Customers - Overview | `customerOverview` | period, branchId |
| Customers - RFM | `rfmAnalysis` | lookbackDays, branchId |
| Customers - Cohorts | `cohortAnalysis` | months, branchId |
| Customers - LTV | `ltvAnalysis` | projectionMonths, branchId |
| Financial - P&L | `profitLoss` | period, branchId, comparePreviousPeriod |
| Financial - Margins | `marginAnalysis` | period, branchId, marginThreshold |
| Financial - Cash Flow | `cashFlow` | period, branchId |
| Financial - Revenue | `revenueBreakdown` | period, groupBy, topN, branchId |
| Channels | `channelsAnalytics` | period, branchId |
| Delivery Types | `deliveryTypesAnalytics` | period, branchId |
| Payment Methods | `paymentMethodsAnalytics` | period, branchId |
| Branches - Compare | `branchComparison` | period, sortBy |
| Branches - Benchmark | `branchBenchmark` | period |
| Branches - Trends | `branchTrends` | period |
| Year over Year | `yoyComparison` | metric |

---

## Error Handling

All pages should handle these states:

**Loading State:**
```
+------------------------------------------------------------------+
|                                                                   |
|                        [Spinner]                                  |
|                     Loading data...                               |
|                                                                   |
+------------------------------------------------------------------+
```

**Empty State:**
```
+------------------------------------------------------------------+
|                                                                   |
|                     [Chart icon]                                  |
|                                                                   |
|              No data for selected period                          |
|                                                                   |
|       Try selecting a different date range                        |
|                                                                   |
+------------------------------------------------------------------+
```

**Error State:**
```
+------------------------------------------------------------------+
|                                                                   |
|                     [Error icon]                                  |
|                                                                   |
|              Failed to load analytics data                        |
|                                                                   |
|                     [ Try Again ]                                 |
|                                                                   |
+------------------------------------------------------------------+
```

---

## FAQ

**Q: How are ABC classes calculated?**
A: Products sorted by revenue. Top 20% = A (80% revenue), next 30% = B (15% revenue), bottom 50% = C (5% revenue).

**Q: What is RFM?**
A: Recency (last purchase), Frequency (order count), Monetary (total spend). Each scored 1-5. Combination determines segment.

**Q: How is retention rate calculated?**
A: (Customers who ordered in both current and previous period) / (Customers who ordered in previous period) * 100.

**Q: What's the difference between cohort retention and overall retention?**
A: Cohort tracks a specific group over time. Overall retention compares period-to-period regardless of when customer first appeared.

**Q: Can I export analytics data?**
A: Yes, use the `exportReport` query with reportType and format parameters. Returns a download URL.

**Q: Are all metrics real-time?**
A: No. Data is cached for 5 minutes. Financial data may have longer delays depending on processing.

**Q: Why don't I see Branches page?**
A: Branches page only appears if you have access to 2+ branches. Single-branch tenants don't see it.

**Q: Are enum values case-sensitive?**
A: YES. Always use UPPERCASE: "REVENUE" not "revenue", "THIS_WEEK" not "this_week".

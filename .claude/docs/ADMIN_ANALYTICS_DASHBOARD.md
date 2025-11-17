# Admin Panel — Analytics Dashboard

This document describes frontend tasks for the **Analytics Dashboard** section in Admin Panel. The backend API is fully implemented and ready for integration. This material explains business logic, UX flows, and context for using the analytics API endpoint.

## 📋 Table of Contents

1. [Basic Concepts and Terms](#basic-concepts-and-terms)
2. [Navigation and Page Structure](#navigation-and-page-structure)
3. [Dashboard Overview](#dashboard-overview)
4. [Period Selection Controls](#period-selection-controls)
5. [Branch Scope Controls](#branch-scope-controls)
6. [KPI Cards Section](#kpi-cards-section)
7. [Chart Section](#chart-section)
8. [Top Products Section](#top-products-section)
9. [Recent Orders Section](#recent-orders-section)
10. [API Reference](#api-reference)
11. [Common Use Cases](#common-use-cases)

---

## Basic Concepts and Terms

### 🔑 Key Analytics Concepts

#### **Revenue**
Total amount from **completed payments only**. Does not include pending, failed, or voided payments.

**Calculation:**
```
Revenue = SUM(OrderPayment.amount)
WHERE status = 'COMPLETED'
AND isVoided = false
```

**Why COMPLETED payments only:**
- Accurate cash flow representation
- Excludes pending/failed transactions
- Aligns with accounting standards
- Excludes voided/refunded amounts

#### **Average Check**
Average order value calculated from paid orders.

**Formula:**
```
Average Check = Total Revenue / Number of Orders
```

**Example:**
```
Revenue: 12,345,000 som
Orders: 356
Average Check: 34,678 som
```

#### **Period-over-Period Comparison**
Percentage change compared to the previous equivalent period.

**Examples:**
- **Today vs Yesterday**: Compare 2025-11-17 with 2025-11-16
- **This Week vs Last Week**: Compare Nov 11-17 with Nov 4-10
- **This Month vs Last Month**: Compare November 2025 with October 2025
- **Custom Period**: If selecting Nov 1-10 (10 days), compare with Oct 22-31 (previous 10 days)

**Calculation:**
```
Change % = ((Current - Previous) / Previous) × 100
```

#### **Chart Grouping**
Time interval for chart data aggregation:

- **Hour**: Best for single day view (24 data points)
- **Day**: Best for week/month view (7-31 data points)
- **Week**: Best for long custom periods (>31 days)

**Auto-determination:**
- `period=day` → `groupBy=hour`
- `period=week` OR `period=month` → `groupBy=day`
- `period=custom` → Based on date range length

#### **Branch Scope**
Filter analytics by branch:

- **Single Branch**: Shows data for one specific branch
- **All Branches**: Aggregated data across all branches

**Default behavior:**
- Uses `activeBranchId` from user's JWT token
- Manager sees their current active branch by default
- Can switch to "All Branches" view

#### **Timezone-Aware Calculations**
All date boundaries are calculated in the **tenant's timezone** (default: Asia/Tashkent).

**Why this matters:**
```
Example: "Today" for a restaurant in Tashkent
- Starts: 2025-11-17 00:00:00 Tashkent time
- Ends: 2025-11-17 23:59:59 Tashkent time
- NOT UTC midnight!
```

**Business impact:**
- "Daily sales" matches restaurant's business day
- Week starts on Monday (local time)
- Month boundaries align with accounting periods

---

## Navigation and Page Structure

### 📍 Navigation
**Path:** `Admin Panel → Analytics → Dashboard`
**URL:** `/admin/analytics/dashboard`

### 🎯 Page Purpose
Provides at-a-glance business performance metrics. Manager can:
- Monitor revenue, orders, and average check
- Compare current performance vs previous period
- Identify top-selling products
- Track sales trends over time
- Review recent transactions

### 🎨 Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Dashboard                              [Branch: Main Cafe ▼]│
├─────────────────────────────────────────────────────────────────┤
│  Period: [Day] [Week] [Month] [Custom]   🔄 View All Branches  │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Revenue  │ │  Orders  │ │Avg Check │ │ Top Product      │  │
│  │12,345,000│ │   356    │ │  34,600  │ │ Cappuccino       │  │
│  │ +8.4% ↗  │ │ +5.1% ↗  │ │ +3.7% ↗  │ │ 120 orders (18%) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Revenue Trend                         Group by: [Hour] Day Week│
│  ┌───────────────────────────────────────────────────────────┐ │
│  │     📈 Line Chart                                         │ │
│  │  15M │              ╱╲                                    │ │
│  │  10M │         ╱───╯  ╲                                   │ │
│  │   5M │    ╱───╯        ╲─╮                                │ │
│  │   0  │───────────────────────────────────────            │ │
│  │      9am  12pm  3pm  6pm  9pm                            │ │
│  └───────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Top Products (This Period)                                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 1. Cappuccino        120 orders  2,200,000 som  (17.8%) │  │
│  │ 2. Espresso           98 orders  1,470,000 som  (11.9%) │  │
│  │ 3. Burger             85 orders  2,125,000 som  (17.2%) │  │
│  └─────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Recent Orders (Last 10)                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 14:32  CHK-1234  560,000  💳 Card      ✓ Paid          │  │
│  │ 14:28  CHK-1233  420,000  💵 Cash      ✓ Paid          │  │
│  │ 14:15  CHK-1232  890,000  💳 Payme     ✓ Paid          │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Dashboard Overview

### 🎯 Purpose
The dashboard is a **single-page overview** that answers key business questions:

1. **How much have we earned?** → Revenue metric
2. **How many orders did we process?** → Order count
3. **What's our average transaction value?** → Average check
4. **What's selling best?** → Top products
5. **How are sales trending?** → Chart visualization
6. **What's happening right now?** → Recent orders

### 🔄 Data Refresh
- **Auto-refresh**: Every 5 minutes (via API cache TTL)
- **Manual refresh**: Click refresh button
- **Cache**: 5-minute server-side cache for performance

### 📱 Responsive Behavior
- **Desktop**: 4-column KPI cards, full chart
- **Tablet**: 2-column KPI cards, full chart
- **Mobile**: 1-column KPI cards, simplified chart

---

## Period Selection Controls

### 🎛️ Control Layout
```
┌────────────────────────────────────────────────────┐
│  [Day]  [Week]  [Month]  [Custom]                 │
│                                                    │
│  Showing: Nov 17, 2025                            │
│  Compare to: Nov 16, 2025                         │
└────────────────────────────────────────────────────┘
```

### 📅 Period Types

#### 1. **Day** (Default)
**Behavior:**
- Shows **today's** data
- Compares to **yesterday**
- Chart groups by **hour** (24 points)

**API Call:**
```
GET /admin/analytics/dashboard?period=day
```

**UI Display:**
```
Period: Today (Nov 17, 2025)
Compare to: Yesterday (Nov 16, 2025)
```

#### 2. **Week**
**Behavior:**
- Shows **current week** (Monday to Sunday)
- Compares to **previous week**
- Chart groups by **day** (7 points)

**API Call:**
```
GET /admin/analytics/dashboard?period=week
```

**UI Display:**
```
Period: This Week (Nov 11-17, 2025)
Compare to: Last Week (Nov 4-10, 2025)
```

#### 3. **Month**
**Behavior:**
- Shows **current month**
- Compares to **previous month**
- Chart groups by **day** (~30 points)

**API Call:**
```
GET /admin/analytics/dashboard?period=month
```

**UI Display:**
```
Period: November 2025
Compare to: October 2025
```

#### 4. **Custom**
**Behavior:**
- Shows **user-selected date range**
- Compares to **equivalent previous period** (same length)
- Chart grouping **auto-determined** by range length

**UI Component:**
```
┌────────────────────────────────────────┐
│  From: [📅 2025-11-01]                │
│  To:   [📅 2025-11-10]                │
│                                        │
│  [Cancel]  [Apply]                    │
└────────────────────────────────────────┘
```

**API Call:**
```
GET /admin/analytics/dashboard?period=custom&startDate=2025-11-01&endDate=2025-11-10
```

**Response includes:**
```json
{
  "period": {
    "type": "custom",
    "startDate": "2025-11-01",
    "endDate": "2025-11-10",
    "compareTo": {
      "startDate": "2025-10-22",
      "endDate": "2025-10-31"
    }
  }
}
```

### ⚙️ Chart Grouping Override

Users can manually change chart grouping:

```
┌────────────────────────────────────┐
│  Group by: [Hour] [Day] [Week]    │
└────────────────────────────────────┘
```

**API Call:**
```
GET /admin/analytics/dashboard?period=week&groupBy=hour
```

**Use case:**
- Manager wants hourly breakdown for the week
- Manager wants weekly summary for a 3-month custom period

---

## Branch Scope Controls

### 🏢 Branch Selector

```
┌────────────────────────────────────────┐
│  Current Branch: Main Cafe        [▼] │
│  ─────────────────────────────────     │
│  ✓ Main Cafe (current)                │
│    Downtown Branch                     │
│    Airport Branch                      │
│  ─────────────────────────────────     │
│  📊 View All Branches                  │
└────────────────────────────────────────┘
```

### 🔄 Mode: Single Branch (Default)

**Behavior:**
- Uses `activeBranchId` from JWT
- Shows data for **one branch only**
- Recent orders **do not** show branch column

**API Call:**
```
GET /admin/analytics/dashboard
(scope defaults to "branch")
```

**Response:**
```json
{
  "scope": "branch",
  "branch": {
    "id": 1,
    "name": "Main Cafe"
  },
  "recentOrders": [
    {
      "orderId": 1234,
      "branch": null  // ← Not included in single-branch mode
    }
  ]
}
```

### 🌐 Mode: All Branches

**Behavior:**
- Aggregates data **across all branches**
- Shows combined metrics
- Recent orders **include** branch info

**API Call:**
```
GET /admin/analytics/dashboard?scope=all_branches
```

**Response:**
```json
{
  "scope": "all_branches",
  "branch": null,  // ← No specific branch
  "recentOrders": [
    {
      "orderId": 1234,
      "branch": {  // ← Branch info included
        "id": 1,
        "name": "Main Cafe"
      }
    }
  ]
}
```

**UI Changes in All Branches Mode:**

1. **KPI Cards**: Show combined totals
2. **Top Products**: Ranked across all branches
3. **Chart**: Combined revenue from all branches
4. **Recent Orders**: Show branch name column

```
┌─────────────────────────────────────────────────────────┐
│  Recent Orders (All Branches)                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Time   Order    Branch         Amount   Status   │ │
│  │ 14:32  CHK-1234 Main Cafe      560,000  ✓ Paid   │ │
│  │ 14:28  CHK-1233 Downtown       420,000  ✓ Paid   │ │
│  │ 14:15  CHK-1232 Airport        890,000  ✓ Paid   │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## KPI Cards Section

### 📊 Card Layout

Each KPI card shows:
1. **Primary Value**: Main metric
2. **Comparison**: % change vs previous period
3. **Trend Indicator**: ↗ up, ↘ down, → neutral

```
┌───────────────────┐
│  Revenue          │
│                   │
│  12,345,000       │  ← Primary value (large, bold)
│  +8.4% ↗          │  ← Comparison (smaller, colored)
│  vs yesterday     │  ← Context label
└───────────────────┘
```

### 💰 Card 1: Revenue

**Displays:**
- Total revenue from completed payments
- Percentage change vs previous period
- Trend direction

**Color coding:**
- Green text + ↗ if positive change
- Red text + ↘ if negative change
- Gray text + → if 0% change

**Example:**
```
Revenue
12,345,000 som
+8.4% ↗
vs last week
```

**Data source:**
```json
{
  "summary": {
    "revenue": 12345000,
    "revenueChangePct": 8.4
  }
}
```

### 📦 Card 2: Orders

**Displays:**
- Total number of paid orders
- Percentage change vs previous period
- Trend direction

**Example:**
```
Orders
356
+5.1% ↗
vs last week
```

**Data source:**
```json
{
  "summary": {
    "orders": 356,
    "ordersChangePct": 5.1
  }
}
```

### 💵 Card 3: Average Check

**Displays:**
- Average order value (revenue ÷ orders)
- Percentage change vs previous period
- Trend direction

**Example:**
```
Avg Check
34,600 som
+3.7% ↗
vs last week
```

**Data source:**
```json
{
  "summary": {
    "avgCheck": 34600,
    "avgCheckChangePct": 3.7
  }
}
```

**Note:** Backend returns average already calculated and rounded.

### ⭐ Card 4: Top Product

**Displays:**
- Best-selling product name
- Number of orders
- Revenue share percentage

**Example:**
```
Top Product
Cappuccino
120 orders
17.8% of revenue
```

**Data source:**
```json
{
  "summary": {
    "topProduct": {
      "productId": 5,
      "name": "Cappuccino",
      "orders": 120,
      "revenue": 2200000,
      "sharePct": 17.8
    }
  }
}
```

**Click behavior:**
- Opens product details page
- Or filters Products page by this product

### 🎨 Empty State

**When no data available:**
```
┌───────────────────┐
│  Revenue          │
│                   │
│  0 som            │
│  No data          │
│  for this period  │
└───────────────────┘
```

**Data:**
```json
{
  "summary": {
    "revenue": 0,
    "revenueChangePct": null,
    "orders": 0,
    "ordersChangePct": null,
    "avgCheck": 0,
    "avgCheckChangePct": null,
    "topProduct": null
  }
}
```

---

## Chart Section

### 📈 Chart Layout

```
┌────────────────────────────────────────────────────────┐
│  Revenue Trend                Group by: [Hour] Day Week│
├────────────────────────────────────────────────────────┤
│                                                        │
│  15M │                ╱╲                               │
│  10M │           ╱───╯  ╲                              │
│   5M │      ╱───╯        ╲─╮                           │
│   0  │─────────────────────────────────                │
│      │                                                 │
│      9am   12pm   3pm   6pm   9pm   12am              │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Revenue: 12,345,000 som                              │
│  vs Last Period: +8.4% ↗                               │
└────────────────────────────────────────────────────────┘
```

### 📊 Chart Configuration

**Type:** Line chart
**X-Axis:** Time (based on groupBy)
**Y-Axis:** Revenue (auto-scaled)

**Tooltip on hover:**
```
┌──────────────────┐
│ 3:00 PM          │
│ Revenue: 1.5M    │
│ Orders: 40       │
└──────────────────┘
```

### ⚙️ Grouping Options

#### Hour Grouping
**Best for:** Single day view
**Data points:** 24 hours (00:00 to 23:00)
**X-Axis labels:** `9am, 12pm, 3pm, 6pm, 9pm, 12am`

**Data source:**
```json
{
  "chart": {
    "groupBy": "hour",
    "points": [
      { "timestamp": "2025-11-17T09:00:00Z", "revenue": 1500000, "orders": 40 },
      { "timestamp": "2025-11-17T10:00:00Z", "revenue": 1200000, "orders": 35 }
    ]
  }
}
```

#### Day Grouping
**Best for:** Week/month view
**Data points:** 7-31 days
**X-Axis labels:** `Mon, Tue, Wed, Thu, Fri, Sat, Sun` or `1, 5, 10, 15, 20, 25, 30`

**Data source:**
```json
{
  "chart": {
    "groupBy": "day",
    "points": [
      { "timestamp": "2025-11-11T00:00:00Z", "revenue": 5000000, "orders": 150 },
      { "timestamp": "2025-11-12T00:00:00Z", "revenue": 4800000, "orders": 140 }
    ]
  }
}
```

#### Week Grouping
**Best for:** Long custom periods (>1 month)
**Data points:** Variable (4-13 weeks)
**X-Axis labels:** `Week 1, Week 2, Week 3, Week 4`

**Data source:**
```json
{
  "chart": {
    "groupBy": "week",
    "points": [
      { "timestamp": "2025-11-03T00:00:00Z", "revenue": 30000000, "orders": 950 },
      { "timestamp": "2025-11-10T00:00:00Z", "revenue": 32000000, "orders": 1020 }
    ]
  }
}
```

### 🎨 Chart Styling

**Colors:**
- Line: Primary brand color (e.g., blue #4F46E5)
- Fill: Gradient from primary to transparent
- Grid: Light gray #E5E7EB
- Text: Dark gray #374151

**Responsive:**
- Desktop: Full width, 400px height
- Tablet: Full width, 300px height
- Mobile: Full width, 250px height

### 📊 Empty Chart State

**When no data:**
```
┌────────────────────────────────────┐
│                                    │
│         📊                         │
│     No data available              │
│     for this period                │
│                                    │
└────────────────────────────────────┘
```

---

## Top Products Section

### 🏆 Layout

```
┌──────────────────────────────────────────────────────────┐
│  Top Products (This Period)                              │
├──────────────────────────────────────────────────────────┤
│  # │ Product      │ Orders │ Revenue   │ Share          │
│  1 │ Cappuccino   │ 120    │ 2,200,000 │ ███████ 17.8% │
│  2 │ Espresso     │  98    │ 1,470,000 │ █████   11.9% │
│  3 │ Burger       │  85    │ 2,125,000 │ ██████  17.2% │
│  4 │ Caesar Salad │  72    │ 1,800,000 │ █████   14.6% │
│  5 │ Latte        │  65    │   975,000 │ ███      7.9% │
│  6 │ Pizza        │  58    │ 1,450,000 │ ████    11.7% │
│  7 │ Pasta        │  54    │ 1,350,000 │ ████    10.9% │
│  8 │ Cheesecake   │  45    │   675,000 │ ██       5.5% │
│  9 │ Juice        │  40    │   400,000 │ █        3.2% │
│ 10 │ Tea          │  38    │   285,000 │ █        2.3% │
└──────────────────────────────────────────────────────────┘
```

### 📊 Table Columns

1. **Rank (#)**: Position (1-10)
2. **Product**: Product name (clickable)
3. **Orders**: Number of times ordered
4. **Revenue**: Total revenue from this product
5. **Share**: Visual bar + percentage of total revenue

### 📈 Data Source

```json
{
  "topProducts": [
    {
      "productId": 5,
      "name": "Cappuccino",
      "orders": 120,
      "revenue": 2200000,
      "sharePct": 17.8
    },
    {
      "productId": 12,
      "name": "Espresso",
      "orders": 98,
      "revenue": 1470000,
      "sharePct": 11.9
    }
  ]
}
```

### 🎨 UI Behavior

**Hover state:**
- Highlight row
- Show pointer cursor
- Display subtle shadow

**Click behavior:**
- Navigate to product details page
- Pass productId to filter

**Share bar:**
- Width proportional to sharePct
- Color: Brand primary color
- Max width: 100% at highest share

**Sorting:**
- Always sorted by **revenue** (descending)
- Cannot be manually reordered
- Backend handles sorting

### 📱 Responsive

**Desktop:** 5 columns (all visible)
**Tablet:** 4 columns (hide share bar, show % only)
**Mobile:** 3 columns (hide orders, show name + revenue + %)

### 🎨 Empty State

**When no products:**
```
┌────────────────────────────────┐
│  🍽️                            │
│  No products sold              │
│  in this period                │
└────────────────────────────────┘
```

---

## Recent Orders Section

### 📋 Layout (Single Branch Mode)

```
┌─────────────────────────────────────────────────────────┐
│  Recent Orders (Last 10)                                │
├─────────────────────────────────────────────────────────┤
│  Time  │ Order    │ Amount    │ Payment │ Status       │
│  14:32 │ CHK-1234 │   560,000 │ 💳 Card │ ✓ Paid       │
│  14:28 │ CHK-1233 │   420,000 │ 💵 Cash │ ✓ Paid       │
│  14:15 │ CHK-1232 │   890,000 │ 📱 Payme│ ✓ Paid       │
│  14:10 │ CHK-1231 │   750,000 │ 💳 Card │ ✓ Paid       │
│  14:05 │ CHK-1230 │   320,000 │ 💵 Cash │ ✓ Paid       │
│  13:58 │ CHK-1229 │   480,000 │ 💳 Uzum │ ✓ Paid       │
│  13:45 │ CHK-1228 │   610,000 │ 💵 Cash │ ✓ Paid       │
│  13:30 │ CHK-1227 │   890,000 │ 📱 Click│ ✓ Paid       │
│  13:20 │ CHK-1226 │   440,000 │ 💳 Card │ ✓ Paid       │
│  13:10 │ CHK-1225 │   720,000 │ 💵 Cash │ ✓ Paid       │
└─────────────────────────────────────────────────────────┘
```

### 📋 Layout (All Branches Mode)

```
┌───────────────────────────────────────────────────────────────┐
│  Recent Orders (All Branches)                                 │
├───────────────────────────────────────────────────────────────┤
│  Time  │ Order    │ Branch    │ Amount    │ Payment │ Status │
│  14:32 │ CHK-1234 │ Main      │   560,000 │ 💳 Card │ ✓ Paid │
│  14:28 │ CHK-1233 │ Downtown  │   420,000 │ 💵 Cash │ ✓ Paid │
│  14:15 │ CHK-1232 │ Airport   │   890,000 │ 📱 Payme│ ✓ Paid │
└───────────────────────────────────────────────────────────────┘
```

### 📊 Data Source

**Single branch:**
```json
{
  "recentOrders": [
    {
      "orderId": 1234,
      "number": "CHK-1234",
      "branch": null,
      "createdAt": "2025-11-17T14:32:10Z",
      "total": 560000,
      "paymentMethod": "CARD",
      "status": "PAID"
    }
  ]
}
```

**All branches:**
```json
{
  "recentOrders": [
    {
      "orderId": 1234,
      "number": "CHK-1234",
      "branch": {
        "id": 1,
        "name": "Main Cafe"
      },
      "createdAt": "2025-11-17T14:32:10Z",
      "total": 560000,
      "paymentMethod": "CARD",
      "status": "PAID"
    }
  ]
}
```

### 💳 Payment Method Icons

**Mapping:**
- `CASH` → 💵 Cash
- `CARD` → 💳 Card
- `CREDIT` → 💳 Credit
- `PAYME` → 📱 Payme
- `CLICK` → 📱 Click
- `UZUM` → 💳 Uzum
- `BANK_TRANSFER` → 🏦 Bank
- `MIXED` → 🔀 Mixed

### ✅ Status Icons

**Mapping:**
- `PAID` → ✓ Paid (green)
- `PARTIALLY_PAID` → ⏳ Partial (orange)
- `NOT_PAID` → ⏸️ Unpaid (gray)

### 🎨 UI Behavior

**Hover state:**
- Highlight row
- Show pointer cursor

**Click behavior:**
- Open order details modal
- Or navigate to Orders page with this order selected

**Time display:**
- Format: HH:MM (24-hour format)
- Timezone: Local branch time
- Example: `14:32` not `2:32 PM`

**Amount display:**
- Format with thousands separator
- Right-aligned for easy scanning
- Example: `560,000` not `560000`

### 📱 Responsive

**Desktop:** All columns visible
**Tablet:** Hide payment method, show icon only
**Mobile:** Show only: Time, Order #, Amount, Status

### 🎨 Empty State

**When no orders:**
```
┌────────────────────────────────┐
│  📝                            │
│  No orders yet                 │
│  in this period                │
└────────────────────────────────┘
```

---

## API Reference

### 🔌 Endpoint

```
GET /admin/analytics/dashboard
```

### 🔐 Authentication

**Required:** JWT token with admin role
**Header:** `Authorization: Bearer <token>`

### 📥 Request Parameters

All parameters are **optional**. Defaults are used if not provided.

| Parameter   | Type   | Default      | Description                                    |
|-------------|--------|--------------|------------------------------------------------|
| `scope`     | enum   | `branch`     | `branch` or `all_branches`                     |
| `period`    | enum   | `day`        | `day`, `week`, `month`, or `custom`            |
| `startDate` | string | -            | ISO date (YYYY-MM-DD). Required if `custom`    |
| `endDate`   | string | -            | ISO date (YYYY-MM-DD). Required if `custom`    |
| `groupBy`   | enum   | auto         | `hour`, `day`, or `week`                       |
| `timezone`  | string | `Asia/Tashkent` | IANA timezone string                        |

### 📤 Response Structure

```json
{
  "scope": "branch",
  "branch": {
    "id": 1,
    "name": "Main Cafe"
  },
  "period": {
    "type": "day",
    "startDate": "2025-11-17",
    "endDate": "2025-11-17",
    "compareTo": {
      "startDate": "2025-11-16",
      "endDate": "2025-11-16"
    }
  },
  "summary": {
    "revenue": 12345000,
    "revenueChangePct": 8.4,
    "orders": 356,
    "ordersChangePct": 5.1,
    "avgCheck": 34600,
    "avgCheckChangePct": 3.7,
    "topProduct": {
      "productId": 5,
      "name": "Cappuccino",
      "orders": 120,
      "revenue": 2200000,
      "sharePct": 17.8
    }
  },
  "chart": {
    "groupBy": "hour",
    "points": [
      {
        "timestamp": "2025-11-17T09:00:00Z",
        "revenue": 1500000,
        "orders": 40
      },
      {
        "timestamp": "2025-11-17T10:00:00Z",
        "revenue": 1200000,
        "orders": 35
      }
    ]
  },
  "topProducts": [
    {
      "productId": 5,
      "name": "Cappuccino",
      "orders": 120,
      "revenue": 2200000,
      "sharePct": 17.8
    }
  ],
  "recentOrders": [
    {
      "orderId": 1234,
      "number": "CHK-1234",
      "branch": null,
      "createdAt": "2025-11-17T14:32:10Z",
      "total": 560000,
      "paymentMethod": "CARD",
      "status": "PAID"
    }
  ]
}
```

### 📋 Request Examples

#### Example 1: Today's dashboard (default)
```
GET /admin/analytics/dashboard
```

**Equivalent to:**
```
GET /admin/analytics/dashboard?scope=branch&period=day
```

#### Example 2: This week across all branches
```
GET /admin/analytics/dashboard?scope=all_branches&period=week
```

#### Example 3: Custom date range (Nov 1-10)
```
GET /admin/analytics/dashboard?period=custom&startDate=2025-11-01&endDate=2025-11-10
```

#### Example 4: This month with hourly breakdown
```
GET /admin/analytics/dashboard?period=month&groupBy=hour
```

#### Example 5: All branches, custom period, weekly grouping
```
GET /admin/analytics/dashboard?scope=all_branches&period=custom&startDate=2025-10-01&endDate=2025-11-17&groupBy=week
```

### ⚠️ Error Responses

#### Invalid custom period
```
Status: 400 Bad Request
{
  "statusCode": 400,
  "message": "Custom period requires startDate and endDate parameters",
  "error": "Bad Request"
}
```

#### Invalid date format
```
Status: 400 Bad Request
{
  "statusCode": 400,
  "message": "startDate must be in ISO 8601 format (YYYY-MM-DD)",
  "error": "Bad Request"
}
```

#### Invalid timezone
```
Status: 400 Bad Request
{
  "statusCode": 400,
  "message": "Invalid timezone string",
  "error": "Bad Request"
}
```

### ✅ Success Response

**Status:** `200 OK`
**Content-Type:** `application/json`
**Cache:** Server-side cache for 5 minutes

---

## Common Use Cases

### Use Case 1: Manager checks today's performance

**User flow:**
1. Manager opens Admin Panel
2. Navigates to Analytics → Dashboard
3. Sees today's data by default
4. Reviews KPI cards for quick insights

**API call:**
```
GET /admin/analytics/dashboard
```

**Expected response:**
- Revenue, orders, avg check for today
- Hourly chart showing sales trend
- Top products sold today
- Last 10 orders

### Use Case 2: Manager compares this week to last week

**User flow:**
1. Opens dashboard
2. Clicks "Week" button in period selector
3. Sees week-over-week comparison

**API call:**
```
GET /admin/analytics/dashboard?period=week
```

**Expected response:**
- Summary metrics with % change vs last week
- Daily breakdown chart (7 points)
- Top products for current week

**UI displays:**
```
Revenue: 45,000,000 som
+12.5% ↗ vs last week
```

### Use Case 3: Owner reviews all branches performance

**User flow:**
1. Opens dashboard
2. Clicks "View All Branches" button
3. Sees aggregated metrics

**API call:**
```
GET /admin/analytics/dashboard?scope=all_branches
```

**UI changes:**
- Branch selector shows "All Branches"
- Recent orders table includes branch column
- KPI cards show combined totals

**Expected response:**
```json
{
  "scope": "all_branches",
  "branch": null,
  "summary": {
    "revenue": 85000000,  // Sum across all branches
    "orders": 2400
  }
}
```

### Use Case 4: Manager analyzes October performance

**User flow:**
1. Opens dashboard
2. Clicks "Custom" period
3. Selects Oct 1 - Oct 31
4. Clicks "Apply"

**API call:**
```
GET /admin/analytics/dashboard?period=custom&startDate=2025-10-01&endDate=2025-10-31
```

**Expected response:**
- Summary for October
- Comparison to September (previous 31 days)
- Daily breakdown chart (31 points)

**UI displays:**
```
Period: Oct 1-31, 2025 (31 days)
Compare to: Sep 1-30, 2025
```

### Use Case 5: Manager wants hourly breakdown for last week

**User flow:**
1. Opens dashboard
2. Clicks "Week" period
3. Changes chart grouping to "Hour"

**API call:**
```
GET /admin/analytics/dashboard?period=week&groupBy=hour
```

**Expected response:**
- Chart with 168 data points (7 days × 24 hours)
- Allows manager to see peak hours across the week

**Chart display:**
```
X-Axis: Mon 9am, Mon 12pm, ... Sun 9pm
Y-Axis: Revenue per hour
```

### Use Case 6: Manager investigates low average check

**User flow:**
1. Opens dashboard
2. Sees avgCheck = 25,000 (-15% ↘)
3. Clicks on "Top Products" section
4. Identifies that low-priced items dominate
5. Navigates to product details for strategic review

**Data analysis:**
```
Top Products:
1. Coffee - 15,000 som (high orders, low price)
2. Tea - 12,000 som
3. Juice - 18,000 som

Insight: High volume, low-ticket items
Action: Consider upselling strategies
```

### Use Case 7: Manager tracks real-time orders

**User flow:**
1. Opens dashboard
2. Scrolls to "Recent Orders" section
3. Monitors incoming orders in real-time
4. Clicks refresh to update (every 5 min auto-refresh)

**Expected behavior:**
- New orders appear at top of list
- Old orders scroll down
- Always shows last 10 orders

### Use Case 8: Troubleshooting: No data showing

**Scenario:** Manager opens dashboard but sees zeros

**Possible causes:**
1. **No orders in selected period**
   - Solution: Change period to broader range

2. **Wrong branch selected**
   - Solution: Switch to "All Branches" view

3. **Orders not yet paid**
   - Remember: Dashboard only counts PAID orders
   - Check Orders page for pending payments

**Debug steps:**
1. Check period selection (is it future date?)
2. Check branch scope (is active branch correct?)
3. Verify orders exist in Orders page
4. Verify payment status of orders

---

## 🎨 Design Recommendations

### Color Scheme

**Positive changes (increase):**
- Text: Green (#10B981)
- Icon: ↗ green arrow

**Negative changes (decrease):**
- Text: Red (#EF4444)
- Icon: ↘ red arrow

**Neutral (no change):**
- Text: Gray (#6B7280)
- Icon: → gray arrow

### Typography

**KPI Values:**
- Font size: 32px
- Font weight: 700 (bold)
- Color: Primary text (#111827)

**KPI Change %:**
- Font size: 14px
- Font weight: 600 (semi-bold)
- Color: Based on direction (green/red/gray)

**Section Headers:**
- Font size: 18px
- Font weight: 600
- Color: Primary text (#111827)

### Spacing

**Card gaps:** 16px
**Section margins:** 24px
**Content padding:** 16px

### Loading States

**On data fetch:**
```
┌───────────────────┐
│  Revenue          │
│                   │
│  ⏳ Loading...    │
│                   │
└───────────────────┘
```

**Skeleton screen:**
- Show card outlines
- Animated shimmer effect
- Display for max 3 seconds

---

## ✅ Validation Rules

### Period Selection

1. **Custom dates:**
   - `startDate` must be before or equal to `endDate`
   - Cannot select future dates
   - Max range: 1 year

2. **Date format:**
   - Must be `YYYY-MM-DD`
   - Invalid formats are rejected by API

### Chart Grouping

1. **Auto-determination:**
   - Day period → hour grouping
   - Week/month → day grouping
   - Custom → based on range length

2. **Manual override:**
   - User can change grouping
   - May result in many data points (warning if >100)

### Branch Selection

1. **Single branch:**
   - Must be a valid branch for this tenant
   - Defaults to user's active branch

2. **All branches:**
   - Requires manager/owner role
   - Shows all branches user has access to

---

## 🔄 Refresh and Caching

### Auto-refresh

**Behavior:**
- Dashboard data is cached for **5 minutes**
- After 5 minutes, new request fetches fresh data
- No page reload needed

### Manual refresh

**UI element:**
```
┌─────────────────────────────┐
│  📊 Dashboard       🔄      │  ← Refresh button
└─────────────────────────────┘
```

**Behavior:**
- Bypasses cache
- Fetches latest data immediately
- Shows loading indicator

### Cache invalidation

**When cache is cleared:**
- User clicks manual refresh
- 5 minutes elapsed since last fetch
- User changes period/scope parameters

---

## 📱 Mobile Considerations

### Layout Adjustments

**Desktop (>1024px):**
- 4-column KPI cards
- Full chart with all labels
- All table columns visible

**Tablet (768-1024px):**
- 2-column KPI cards
- Simplified chart labels
- Hide less critical columns

**Mobile (<768px):**
- 1-column KPI cards (stacked)
- Minimal chart (key points only)
- Show only essential columns

### Touch Interactions

**KPI Cards:**
- Tap to drill down (if implemented)
- Long press for details

**Chart:**
- Pinch to zoom
- Swipe to see more data points
- Tap data point for tooltip

**Tables:**
- Horizontal scroll for extra columns
- Tap row to open details

---

## 🎓 Tips for Developers

### Performance

1. **Lazy load charts:**
   - Load chart library only when needed
   - Use code splitting

2. **Debounce period changes:**
   - Don't fetch on every keystroke in custom date picker
   - Wait 300ms after user stops typing

3. **Optimize chart rendering:**
   - Limit data points to 100 max
   - Use canvas instead of SVG for large datasets

### Accessibility

1. **Keyboard navigation:**
   - Tab through period buttons
   - Arrow keys to navigate chart
   - Enter to select date in picker

2. **Screen readers:**
   - Add ARIA labels to KPI cards
   - Announce trend direction (up/down)
   - Provide text alternatives for chart

3. **Color blindness:**
   - Don't rely only on red/green
   - Use icons (↗↘) in addition to colors

### Error Handling

1. **Network errors:**
   - Show retry button
   - Cache last successful data
   - Display error message clearly

2. **Invalid params:**
   - Validate dates client-side before API call
   - Show inline error messages
   - Don't allow submission if invalid

3. **Empty states:**
   - Clearly explain why no data
   - Suggest alternative period
   - Provide help link

---

## 📚 Related Pages

This dashboard integrates with other admin sections:

1. **Orders Page:** Click recent order to view details
2. **Products Page:** Click top product to filter
3. **Branch Management:** Switch active branch updates dashboard
4. **Settings:** Timezone configuration affects date boundaries

---

**Document version:** 1.0
**Last updated:** November 17, 2025
**API endpoint:** `GET /admin/analytics/dashboard`
**Backend implementation:** ✅ Complete and ready

# 24. Analytics Dashboard - Complete Implementation Guide

This document provides a comprehensive guide to implementing the Analytics Dashboard feature. It covers every component, visual design, API integration, and customization capability.

**API**: GraphQL (NOT REST)
**Endpoint**: `POST /graphql`
**Authentication**: JWT Bearer Token
**Route**: `/dashboard/overview`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Subscription Tiers & Entitlements](#subscription-tiers--entitlements)
3. [Dashboard Overview Page](#dashboard-overview-page)
4. [KPI Cards with Sparklines](#kpi-cards-with-sparklines)
5. [Main Chart Component](#main-chart-component)
6. [Dashboard Widgets](#dashboard-widgets)
7. [Period Selector](#period-selector)
8. [Branch Selector](#branch-selector)
9. [Dashboard Edit Mode](#dashboard-edit-mode)
10. [API Reference](#api-reference)
11. [TypeScript Interfaces](#typescript-interfaces)
12. [File Structure](#file-structure)

---

## Architecture Overview

### Flow Diagram

```
User Opens /dashboard/overview
        |
        v
+-------------------+
| Load Dashboard    |
| Config (GraphQL)  |
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
Config    Config (4 KPIs + 4 widgets)
   |         |
   +----+----+
        |
        v
+-------------------+
| ANALYTICS OVERVIEW |
| - Header + Title   |
| - Period Selector  |
| - Branch Selector  |
| - KPI Cards (4)    |
| - Main Chart       |
| - Widget Grid      |
+-------------------+
        |
   +----+----+
   |         |
  Edit     Change
  Mode     Period/Branch
   |         |
   v         v
+----------+ Reload all
| Edit     | data with
| Mode     | new params
+----------+
```

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **State**: React Query (TanStack Query)
- **Drag & Drop**: @dnd-kit/core
- **Icons**: Tabler Icons

---

## Subscription Tiers & Entitlements

Dashboard access and customization is gated by subscription plan.

| Feature | BASIC ($29) | PRO ($59) | ULTRA ($119) |
|---------|-------------|-----------|--------------|
| View Dashboard | Yes | Yes | Yes |
| Customize KPI Slots | No | Yes | Yes |
| Choose Chart Type | No | Yes | Yes |
| Add/Remove Widgets | No | Yes | Yes |
| Reorder Widgets | No | Yes | Yes |
| Save Dashboard Config | No | Yes | Yes |

### Entitlements Object

```typescript
interface IEntitlements {
  analytics_basic: boolean    // Can view default dashboard (BASIC+)
  analytics_pro: boolean      // Advanced analytics pages (PRO+)
  analytics_full: boolean     // Full analytics + forecasting (ULTRA)
  dashboard_custom: boolean   // Can customize dashboard (PRO+)
}
```

### Entitlements Query

```graphql
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
```

### UI Behavior Based on Entitlements

**BASIC Users**:
- See default dashboard (cannot customize)
- "Настроить" button is replaced with disabled "PRO" badge with crown icon
- Cannot access edit mode

**PRO/ULTRA Users**:
- See "Настроить" button (outline variant)
- Can enter edit mode and customize everything
- Changes are saved to backend

---

## Dashboard Overview Page

### Route

`/dashboard/overview` -> `src/app/dashboard/overview/page.tsx`

### Visual Layout

```
+------------------------------------------------------------------+
| Аналитика                                    [PRO] or [Настроить] |
| Отслеживайте ключевые показатели вашего бизнеса                   |
|                                                                   |
| [Сегодня] [Вчера] [Неделя] [Месяц] [📅 Произвольно]  |  Филиал: [▼] |
|                                                                   |
| +------------+ +------------+ +------------+ +------------+       |
| | 💵 Выручка | | 🛒 Заказы  | | 🧾 Ср.чек  | | 👤 Новые   |       |
| | 12,500,000 | | 156        | | 80,128     | | 23         |       |
| | ↑ +11.6%   | | ↑ +5.2%    | | ↑ +6.1%    | | ↓ -2.3%    |       |
| | [sparkline]| | [sparkline]| | [sparkline]| | [sparkline]|       |
| +------------+ +------------+ +------------+ +------------+       |
|                                                                   |
| +---------------------------------------------------------------+|
| | Выручка                              [Часы] [Дни] [Неделя]     ||
| | 45,000,000 сум  ↑ +12.5%                                       ||
| |                                                                 ||
| |     ____                                                        ||
| |    /    \        ____                                           ||
| | __/      \______/    \______                                    ||
| |                              \____                              ||
| |                                                                 ||
| | Mon   Tue   Wed   Thu   Fri   Sat   Sun                         ||
| +---------------------------------------------------------------+|
|                                                                   |
| +---------------------------+ +---------------------------+       |
| | WIDE WIDGET: Revenue      | | WIDE WIDGET: Transactions |       |
| | Overview with chart       | | Summary with bar chart    |       |
| +---------------------------+ +---------------------------+       |
|                                                                   |
| +---------------------------+ +---------------------------+       |
| | Топ продукты              | | Способы оплаты            |       |
| | 1. Pizza Margherita  45%  | | [Donut Chart]             |       |
| | 2. Burger Classic    23%  | | • Наличные      46%       |       |
| | 3. Caesar Salad      12%  | | • Карта         38%       |       |
| | 4. Pasta Carbonara    8%  | | • Payme         10%       |       |
| | 5. Lemonade           5%  | | • Click          6%       |       |
| +---------------------------+ +---------------------------+       |
+------------------------------------------------------------------+
```

### Component Structure

```typescript
// src/widgets/overview/components/analytics-overview.tsx
export function AnalyticsOverview() {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(PeriodType.TODAY)
  const [customRange, setCustomRange] = useState<{ start?: string; end?: string }>({})
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined)
  const [isEditMode, setIsEditMode] = useState(false)
  const [localGroupBy, setLocalGroupBy] = useState<GroupBy | null>(null)

  // Queries
  const { data: dashboardConfig } = useDashboardConfig()
  const config = dashboardConfig ?? getDefaultDashboardConfig()
  const canCustomize = useCanCustomizeDashboard()
  const { data: kpiMetrics } = useKpiMetrics(...)
  const { data: timeSeries } = useTimeSeries(...)

  return (
    <div className="w-full space-y-6">
      {/* Header with title and customize button */}
      {/* Period and Branch selectors */}
      {/* Error state if any */}
      {/* Loading skeleton */}
      {/* KPI Cards */}
      {/* Main Chart */}
      {/* Widgets Section */}
    </div>
  )
}
```

---

## KPI Cards with Sparklines

### Visual Design

Each KPI card displays:
1. **Icon** - Colored icon in rounded container (color varies by KPI type)
2. **Label** - KPI name (e.g., "Выручка", "Заказы")
3. **Value** - Large formatted number
4. **Trend Badge** - Pill with arrow and percentage
5. **Comparison Label** - "vs вчера", "vs прошлая неделя"
6. **Mini Sparkline** - Small area chart showing trend (generated from data)

```
+--------------------------------------------------+
| [💵]  Выручка                                     |
|                                                   |
| 12,500,000 сум                      [sparkline]   |
| [↑ +11.6%] vs вчера                 ~~~~~~~~~~~~~ |
+--------------------------------------------------+
```

### KPI Types Configuration

```typescript
const KPI_CONFIG: Record<KpiType, { label: string; icon: Icon; color: string; bgColor: string }> = {
  REVENUE: {
    label: 'Выручка',
    icon: IconCurrencyDollar,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  ORDERS: {
    label: 'Заказы',
    icon: IconShoppingCart,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  AVG_CHECK: {
    label: 'Средний чек',
    icon: IconReceipt,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
  },
  CUSTOMERS: {
    label: 'Клиенты',
    icon: IconUsers,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  NEW_CUSTOMERS: {
    label: 'Новые клиенты',
    icon: IconUserPlus,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
  },
  RETURNING_CUSTOMERS: {
    label: 'Постоянные',
    icon: IconRefresh,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  TIPS: {
    label: 'Чаевые',
    icon: IconCash,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  REFUNDS: {
    label: 'Возвраты',
    icon: IconReceiptRefund,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  CANCELLATIONS: {
    label: 'Отмены',
    icon: IconX,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  MARGIN: {
    label: 'Маржа',
    icon: IconChartBar,
    color: 'text-lime-600 dark:text-lime-400',
    bgColor: 'bg-lime-100 dark:bg-lime-900/30',
  },
  RETENTION_RATE: {
    label: 'Удержание',
    icon: IconPercentage,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  STAFF_PRODUCTIVITY: {
    label: 'Продуктивность',
    icon: IconActivity,
    color: 'text-fuchsia-600 dark:text-fuchsia-400',
    bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
  },
}
```

### Sparkline Generation

When real sparkline data is not provided, generate synthetic data based on trend:

```typescript
function generateSparklineData(baseValue: number, trend: Trend): number[] {
  const points = 12
  const data: number[] = []
  let value = baseValue * 0.7

  for (let i = 0; i < points; i++) {
    const trendFactor = trend === Trend.UP ? 1.05 : trend === Trend.DOWN ? 0.95 : 1
    const randomFactor = 0.9 + Math.random() * 0.2
    value = value * trendFactor * randomFactor
    data.push(Math.round(value))
  }

  return data
}
```

### Trend Badge Colors

- **Positive (UP)**: `bg-emerald-100 text-emerald-700` / dark: `bg-emerald-900/30 text-emerald-400`
- **Negative (DOWN)**: `bg-red-100 text-red-700` / dark: `bg-red-900/30 text-red-400`
- **Neutral (FLAT)**: `bg-muted text-muted-foreground`

### Sparkline Chart Colors

```typescript
// Hardcoded colors (CSS variables with oklch don't work in Recharts)
const CHART_SUCCESS = '#22c55e'  // Green for UP trend
const CHART_DANGER = '#ef4444'   // Red for DOWN trend
const CHART_NEUTRAL = '#9ca3af'  // Gray for FLAT trend
```

---

## Main Chart Component

### Visual Design

Large chart card with:
1. **Header**: Metric name, total value, change badge, groupBy toggle
2. **Chart Area**: 350px height, supports multiple chart types
3. **Interactive Tooltip**: Shows formatted value on hover

```
+------------------------------------------------------------------+
| Выручка                               [Часы] [Дни] [Неделя]      |
| 45,000,000 сум  [↑ +12.5%]                                       |
|------------------------------------------------------------------|
|                                                                   |
|     ____                                                          |
|    /    \        ____                                             |
| __/      \______/    \______                                      |
|                              \____                                |
|                                                                   |
| Mon   Tue   Wed   Thu   Fri   Sat   Sun                           |
+------------------------------------------------------------------+
```

### Chart Types

```typescript
type ChartType = 'area' | 'bar' | 'line' | 'radial' | 'radar'
```

| Type | Visual | Best For |
|------|--------|----------|
| `area` | Filled area under line with gradient | Trends over time, default |
| `bar` | Vertical bars | Comparisons between periods |
| `line` | Simple line with dots | Precise value tracking |
| `radial` | Circular progress bar | Single value progress |
| `radar` | Spider/radar chart | Multi-dimensional comparison |

### Primary Chart Color

```typescript
const PRIMARY_COLOR = '#fe4a49'  // Brand red color
```

### GroupBy Toggle

```typescript
const GROUPBY_OPTIONS = [
  { value: GroupBy.HOUR, label: 'Часы' },
  { value: GroupBy.DAY, label: 'Дни' },
  { value: GroupBy.WEEK, label: 'Неделя' },
]
```

The toggle is styled as pill buttons with `ToggleGroup` component:
- Container: `rounded-lg border bg-muted/30 p-1`
- Active item: `bg-background shadow-sm`

### Value Formatting

```typescript
// For currency metrics (REVENUE, AVG_CHECK, TIPS, REFUNDS, MARGIN)
formatPrice(value)  // "12,500,000 сум"

// For axis labels (abbreviated)
formatAxisValue(1500000)  // "1.5M"
formatAxisValue(1500)     // "2K"
```

---

## Dashboard Widgets

### Widget Types

```typescript
type WidgetType =
  // === Core Analytics Widgets ===
  | 'TOP_PRODUCTS'           // Ranked list of products by revenue
  | 'PAYMENT_METHODS'        // Donut chart of payment types
  | 'CHANNEL_SPLIT'          // Donut chart of sales channels
  | 'STAFF_RANKING'          // Ranked list of staff by revenue
  | 'HOURLY_BREAKDOWN'       // Heatmap by hour/day
  | 'GOAL_PROGRESS'          // Progress bars for goals
  | 'ALERTS'                 // List of alerts
  | 'REVENUE_OVERVIEW'       // Wide card with chart + metrics (WIDE)
  | 'TRANSACTIONS_SUMMARY'   // Wide card with bar chart (WIDE)
  | 'PERFORMANCE_RADAR'      // Radar chart
  | 'DAILY_COMPARISON'       // Line chart comparing days
  | 'INCOME_EXPENSE'         // Bar chart income vs expense (WIDE)
  | 'CUSTOMER_RATINGS'       // Star ratings widget with trend line
  | 'CONVERSION_FUNNEL'      // Funnel visualization
  | 'ORDERS_BY_CATEGORY'     // Donut chart by category
  | 'ANOMALY_DETECTION'      // Anomaly alert with highlighted bar
  | 'VISITORS_TRAFFIC'       // Traffic breakdown
  | 'SALES_METRICS'          // Multi-metric card (WIDE)
  | 'GOAL_RADIAL'            // Radial progress for goals

  // === NEW Enhanced Interactive Widgets ===
  | 'EARNINGS_REPORT'        // Metric cards + weekly bar chart
  | 'GROWTH_GAUGE'           // Semi-circular gauge showing growth %
  | 'COMBO_CHART'            // Bar + line overlay for dual metrics (WIDE)
  | 'CHANNEL_SALES_BREAKDOWN'// Total sales with channel breakdown + chart
  | 'PERFORMANCE_TABS'       // Tabbed widget (New Users, Sales, etc.)
  | 'SALES_PLAN_PROGRESS'    // Large % with cohort progress indicator
  | 'YEAR_COMPARISON'        // Side-by-side bar comparison (2024 vs 2023)
  | 'FINANCE_REPORT'         // Stacked bar chart + sidebar metrics (WIDE)
  | 'TOP_SERVICES_BARS'      // Horizontal colored bars with legend grid
  | 'TOTAL_EARNING_DUAL'     // Dual-color vertical bars with summary
  | 'WEEKLY_OVERVIEW_COMBO'  // Bar + line with performance message
```

### Widget Size Categories

Widgets are displayed in two sections:

**Wide Widgets** (full width, `col-span-full`):
- `REVENUE_OVERVIEW` - Area chart with sidebar metrics
- `TRANSACTIONS_SUMMARY` - Bar chart with summary
- `INCOME_EXPENSE` - Financial comparison bars
- `SALES_METRICS` - Multi-metric card
- `COMBO_CHART` - Bar + line overlay (NEW)
- `YEAR_COMPARISON` - Year over year comparison (NEW)
- `FINANCE_REPORT` - Stacked bar with report sidebar (NEW)

**Normal Widgets** (2-column grid):
- All other widgets fit in half-width cards
- On mobile, all widgets become full-width

**Sizing Logic**:
```typescript
const WIDE_WIDGETS: WidgetType[] = [
  'REVENUE_OVERVIEW',
  'TRANSACTIONS_SUMMARY',
  'INCOME_EXPENSE',
  'SALES_METRICS',
  'COMBO_CHART',
  'YEAR_COMPARISON',
  'FINANCE_REPORT',
]

const isWideWidget = (type: WidgetType) => WIDE_WIDGETS.includes(type)
```

### Revenue Overview Widget (WIDE)

Most feature-rich widget showing:
- Total revenue with trend
- Mini area chart
- Side panel with 3 metrics (Income, Expenses, Profit)

```
+------------------------------------------------------------------+
| Обзор дохода                                        [Детали →]   |
| Еженедельный отчет                                               |
|                                                                   |
| 45,000,000 сум  ↑ +12.5%     |  Отчет                            |
|                               |  +---------------------------+    |
|   ~~~~~~~~~~~~~~~~~~~~        |  | 💰 Доход      38,250,000 |    |
|  /                    \       |  |              +12.5%      |    |
| /                      \___   |  +---------------------------+    |
|                               |  | 💳 Расходы    6,750,000  |    |
|                               |  |              -8.2%       |    |
|                               |  +---------------------------+    |
|                               |  | 💵 Прибыль   31,500,000  |    |
|                               |  |              +15.3%      |    |
|                               |  +---------------------------+    |
+------------------------------------------------------------------+
```

### Top Products Widget

Ranked list with progress bars:

```
+---------------------------+
| Топ продукты              |
|                           |
| ████████████████████ 1 Pizza Margherita    3,500,000   45.0% |
| █████████████        2 Burger Classic      1,794,872   23.0% |
| ████████             3 Caesar Salad          935,897   12.0% |
| █████                4 Pasta Carbonara       624,359    8.0% |
| ███                  5 Lemonade              390,224    5.0% |
+---------------------------+
```

### Payment Methods Widget

Donut chart with legend:

```
+---------------------------+
| Способы оплаты            |
|                           |
|        ╭────────╮         |
|       ╱  ████   ╲         |
|      │  ██████   │        |
|       ╲  ████   ╱         |
|        ╰────────╯         |
|                           |
| • Наличные      46%       |
| • Карта         38%       |
| • Payme         10%       |
| • Click          6%       |
+---------------------------+
```

### Widget Color Scheme

```typescript
const PAYMENT_COLORS: Record<string, string> = {
  CASH: 'hsl(var(--chart-1))',        // First chart color
  CARD: 'hsl(var(--chart-2))',        // Second chart color
  PAYME: 'hsl(var(--chart-3))',       // Third chart color
  CLICK: 'hsl(var(--chart-4))',       // Fourth chart color
  UZUM: 'hsl(var(--chart-5))',        // Fifth chart color
  BANK_TRANSFER: 'hsl(var(--primary))',
  OTHER: 'hsl(var(--muted-foreground))',
}
```

---

## Enhanced Interactive Widgets (NEW)

These widgets provide advanced interactivity and visual appeal inspired by modern dashboard designs.

### Earnings Report Widget

**Type**: `EARNINGS_REPORT`
**Size**: Normal (2-column)

Weekly earning overview with metric cards and bar chart:

```
+------------------------------------------+
| Earning Report                      [⋮]  |
| Weekly Earning overview                   |
|                                          |
| +--------+ +-----------+ +-------------+ |
| | ⏱️     | | 💵        | | 📋          | |
| | Net    | | Total     | | Total       | |
| | profit | | income    | | expense     | |
| | Sales  | | Sales,    | | ADVT,       | |
| |        | | Affil.    | | Marketing   | |
| |$1,623  | | $5,600    | | $3,200      | |
| |↑ 20.3% | | ↑ 16.2%   | | ↑ 10.5%     | |
| +--------+ +-----------+ +-------------+ |
|                                          |
| ▁ ▃ ▄ ▅ ███ ▃ ▂                         |
| MO TU WE TH FR SA SU                     |
+------------------------------------------+
```

**Features**:
- 3 metric cards with icon, label, source tags, value, trend
- Interactive bar chart with highlighted current day
- Hover shows tooltip with detailed breakdown

**API Query**: `EarningsReport`
```graphql
query EarningsReport($period: PeriodInput!, $branchId: Int) {
  earningsReport(period: $period, branchId: $branchId) {
    netProfit { value changePercent sources }
    totalIncome { value changePercent sources }
    totalExpense { value changePercent sources }
    dailyBreakdown { day value isHighlighted }
  }
}
```

---

### Growth Gauge Widget

**Type**: `GROWTH_GAUGE`
**Size**: Normal (2-column)

Semi-circular gauge showing growth percentage with year comparison:

```
+------------------------------------------+
| Total Revenue                Report [▼]  |
| ● 2024  ● 2023                           |
|                                          |
|    30 ─ ─ ─ ─ ─ ─ ─ ─                    |
|    20 ▁ ▂ ▃ ▄ ▁ ▂ ▃ ▄                    |
|    10                                    |
|     0 ▄ ▅ ▆ ▇ ▄ ▅ ▆ ▇                    |
|   -10                                    |
|   -20                                    |
|       Jan Feb Mar Apr May Jun Jul        |
|                                          |
|          ╭─────────────╮                 |
|         ╱ ▓▓▓▓▓▓▓▓░░░░ ╲                |
|        │      78%       │                |
|         ╲    Growth    ╱                 |
|          ╰─────────────╯                 |
|                                          |
|    62% Company Growth                    |
| +------+ +------+                        |
| | 💵   | | 📋   |                        |
| | 2024 | | 2023 |                        |
| |$32.5K| |$41.2K|                        |
| +------+ +------+                        |
+------------------------------------------+
```

**Features**:
- Dual bar chart comparing two periods (positive/negative values)
- Semi-circular gauge with segmented fill (like speedometer)
- Year-over-year comparison cards at bottom
- Report dropdown for different views

**Visual Implementation**:
```typescript
// Gauge uses custom SVG arc with segmented design
const GaugeChart = ({ percentage }: { percentage: number }) => {
  const segments = 20
  const filledSegments = Math.round((percentage / 100) * segments)

  return (
    <svg viewBox="0 0 200 120">
      {Array.from({ length: segments }).map((_, i) => (
        <rect
          key={i}
          x={...}
          y={...}
          fill={i < filledSegments ? 'hsl(var(--foreground))' : 'hsl(var(--muted))'}
          transform={`rotate(${...})`}
        />
      ))}
      <text className="text-3xl font-bold" textAnchor="middle">
        {percentage}%
      </text>
    </svg>
  )
}
```

---

### Combo Chart Widget (WIDE)

**Type**: `COMBO_CHART`
**Size**: Wide (full width)

Combined bar + line chart for showing two related metrics:

```
+------------------------------------------------------------------+
| Weekly overview                                              [⋮]  |
|                                                                   |
|    90k ─ ─ ─ ─ ─ ─ ─ ─ ─                                          |
|    60k    ●─────●                   ●                             |
|              ▓▓▓    ●───●     ●───●   ●                           |
|    30k ▓▓▓▓▓████▓▓▓▓▓▓▓▓▓███▓▓▓▓▓▓▓▓▓▓▓▓                         |
|     0k                                                            |
|        Mon  Tue  Wed  Thu  Fri  Sat  Sun                          |
|                                                                   |
|  80%  Your sales performance is 60% Better compare to Last month  |
|                                                                   |
|                    [ Details ]                                    |
+------------------------------------------------------------------+
```

**Features**:
- Bar chart (primary metric) with line overlay (secondary metric)
- Highlighted bar for peak/selected day
- Performance summary message with percentage
- Details button linking to full analytics

**Chart Configuration**:
```typescript
interface IComboChartConfig {
  primaryMetric: KpiType      // Shown as bars
  secondaryMetric: KpiType    // Shown as line
  highlightPeak: boolean      // Auto-highlight highest bar
  showSummaryMessage: boolean // Show performance text
}
```

---

### Channel Sales Breakdown Widget

**Type**: `CHANNEL_SALES_BREAKDOWN`
**Size**: Normal (2-column)

Sales breakdown by channel with combined bar + line chart:

```
+------------------------------------------+
| ↗️ Total sales               [Details]   |
|                                          |
| $2,150.00  [+5%]                         |
|                                          |
| 🌐 Online Store     $20k      +12.6%     |
| 🏠 Offline Store    $20k      -4.2%      |
|                                          |
|      ▁▃▅▇███▅▃▁▃▅███                    |
|     ╱           ╲    ╲                   |
|    ●─────────────●────●                  |
|    10:00  12:00  14:00  16:00  18:00     |
+------------------------------------------+
```

**Features**:
- Main value with trend badge
- Channel breakdown list (Online vs Offline, or by source)
- Mini combo chart (bar + line) at bottom
- Time-based x-axis for intraday view

---

### Performance Tabs Widget

**Type**: `PERFORMANCE_TABS`
**Size**: Normal (2-column)

Tabbed interface showing different performance views:

```
+------------------------------------------+
| 📊 Performance                      [⋮]  |
| [New Users] [Online Sales] [Daily Sales] |
|──────────────────────────────────────────|
|                                          |
| +--------------------------------------+ |
| | 👤 Product Manager                   | |
| |    Angel George                      | |
| +--------------------------------------+ |
|                                          |
| [ Daily purchase ]          10 Items     |
|                                          |
| +--------------------------------------+ |
| | Physical product                     | |
| | $78,263              ↑ 14.78%        | |
| | 👤👤👤👤              [View all →]    | |
| +--------------------------------------+ |
|                                          |
| Increase 24% More email marketing to...  |
+------------------------------------------+
```

**Features**:
- 3 tabs switching between different views
- User/manager card with avatar
- Daily purchase count badge
- Product metrics card with avatars (team members)
- Actionable insight text at bottom

**Tab Configuration**:
```typescript
interface IPerformanceTabsConfig {
  tabs: Array<{
    id: string
    label: string
    dataQuery: string  // Which query to run for this tab
  }>
  defaultTab: string
}
```

---

### Sales Plan Progress Widget

**Type**: `SALES_PLAN_PROGRESS`
**Size**: Normal or Wide

Large percentage display with cohort analysis progress:

```
+------------------------------------------+
| Sales plan           Cohort analysis     |
|                      indicators          |
|                                          |
|    54%               Analyzes the        |
|                      behaviour of a      |
| Percentage profit    group of users who  |
| from total sales     joined a product/   |
|                      service at the same |
|                      time over a certain |
|                      period.             |
|                                          |
|                      📊 Open Statistics  |
|                      📈 Percentage Change|
|                                          |
| ●●●●●●●●●●●●●○○○○○○○○○○○○               |
+------------------------------------------+
```

**Features**:
- Large percentage display (54%)
- Descriptive text explaining the metric
- Quick action buttons (Open Statistics, Percentage Change)
- Visual progress indicator (filled/empty circles)

---

### Year Comparison Widget

**Type**: `YEAR_COMPARISON`
**Size**: Wide (full width)

Side-by-side bar chart comparing two years:

```
+------------------------------------------------------------------+
| Finance                                                      [⋮]  |
| Yearly report overview                                            |
|                                                                   |
|    50 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                              |
|    40 ▓▓ ▓▓ ██ ▓▓ ██ ██ ██                                       |
|    30 ██ ██ ██ ██ ██ ██ ██                                       |
|    20 ██ ██ ██ ██ ██ ██ ██          Report                       |
|    10 ██ ██ ██ ██ ██ ██ ██          Monthly Avg. $45.578k        |
|     0                                                             |
|       Jan Feb Mar Apr May Jun Jul   +------------------------+    |
|                                     | 💰 Total Profit        |    |
|    ● Revenue ● Expense ● Profit     |    $48,568.20          |    |
|                                     +------------------------+    |
|                                     | 📋 Total Income        |    |
|                                     |    $38,453.25          |    |
|                                     +------------------------+    |
|                                     | 💳 Total Expense       |    |
|                                     |    $2,453.45           |    |
|                                     +------------------------+    |
|                                                                   |
|                                     [ View Report ]               |
+------------------------------------------------------------------+
```

**Features**:
- Stacked/grouped bar chart by month
- 3 data series (Revenue, Expense, Profit) with legend
- Side panel showing summary totals
- "View Report" button for drill-down

---

### Finance Report Widget (WIDE)

**Type**: `FINANCE_REPORT`
**Size**: Wide (full width)

Comprehensive financial overview with stacked bars and report sidebar:

```
+------------------------------------------------------------------+
| Finance                          [⋮] │ Report                [⋮] |
| Yearly report overview                │ Monthly Avg. $45.578k     |
|                                       │                           |
|    50 ─ ─ ─ ─ ─ ─ ─ ─ ─              │ +---------------------+   |
|       ▓▓▓▓                            │ | 💰 Total Profit    |   |
|    40 ████ ████                       │ |    $48,568.20      |   |
|       ████ ████▓▓▓▓▓▓▓▓              │ +---------------------+   |
|    30 ████ ████████████              │ +---------------------+   |
|       ████ ████████████▓▓▓▓          │ | 📋 Total Income    |   |
|    20 ████ ████████████████          │ |    $38,453.25      |   |
|       ████ ████████████████          │ +---------------------+   |
|    10 ████ ████████████████████      │ +---------------------+   |
|       ████ ████████████████████      │ | 💳 Total Expense   |   |
|     0 ─────────────────────────      │ |    $2,453.45       |   |
|       Jan Feb Mar Apr May Jun Jul    │ +---------------------+   |
+------------------------------------------------------------------+
```

**Features**:
- Stacked bar chart (3 colors: green, blue, purple for profit/income/expense)
- Vertical divider separating chart from report panel
- Report panel with monthly average
- 3 summary metric cards with icons

---

### Top Services Bars Widget

**Type**: `TOP_SERVICES_BARS`
**Size**: Normal or Wide

Horizontal colored bars with percentage legend grid:

```
+------------------------------------------------------------------+
| Top Services by Sales                                        [⋮]  |
|                                                                   |
| 1  ████████████████████████████████████   │  ● UI design    99%  |
| 2  █████████████████████████████████      │  ● UX design    94%  |
| 3  ████████████████████████               │                       |
| 4  ██████████████████████                 │  ● Music        80%  |
| 5  ███████████████                        │  ● Animation    68%  |
| 6  ██████████                             │                       |
|    ├────┼────┼────┼────┼────┤            │  ● React        52%  |
|    0%   25%  50%  75%  100%              │  ● SEO          45%  |
+------------------------------------------------------------------+
```

**Features**:
- Ranked horizontal bars (1-6) with unique colors per item
- X-axis showing percentage scale
- Right-side legend grid showing name + percentage
- Each bar labeled with service name inside

**Color Assignment**:
```typescript
const SERVICE_BAR_COLORS = [
  '#3b82f6', // Blue (1st)
  '#22c55e', // Green (2nd)
  '#f59e0b', // Amber (3rd)
  '#a855f7', // Purple (4th)
  '#ef4444', // Red (5th)
  '#6b7280', // Gray (6th)
]
```

---

### Total Earning Dual Widget

**Type**: `TOTAL_EARNING_DUAL`
**Size**: Normal (2-column)

Dual-color vertical bars with summary metrics:

```
+------------------------------------------+
| Total earning                       [⋮]  |
|                                          |
| 87%  ↑ +38%                              |
|                                          |
|    ▓▓  ▓▓  ▓▓      ▓▓  ▓▓               |
|    ██  ██  ██  ▓▓  ██  ██  ▓▓           |
|    ██  ██  ██  ██  ██  ██  ██           |
|    ██  ██  ██  ██  ██  ██  ██           |
|    ██  ██  ██  ██  ██  ██  ██           |
|                                          |
| +------+ Total revenue         +$250     |
| | 💵   | Successful payments            |
| +------+                                 |
|                                          |
| +------+ Total sales           +$80      |
| | 🛒   | Refund                         |
| +------+                                 |
+------------------------------------------+
```

**Features**:
- Large percentage with trend
- Dual-color bars (e.g., coral/orange gradient per bar)
- Two summary rows with icon, label, description, value

**Bar Style**:
```typescript
// Each bar has gradient from top (coral) to bottom (orange)
const DualBarStyle = {
  topColor: '#fe6b6b',    // Coral
  bottomColor: '#fab005', // Orange/Amber
  radius: 12,             // Rounded caps
}
```

---

### Weekly Overview Combo Widget

**Type**: `WEEKLY_OVERVIEW_COMBO`
**Size**: Normal (2-column)

Combined bar and line chart with performance message:

```
+------------------------------------------+
| Weekly overview                     [⋮]  |
|                                          |
|    90k ─ ─ ─ ─ ─ ─ ─                     |
|         ●                                |
|    60k ▓▓▓▓███●───●                      |
|        ▓▓▓▓███▓▓▓▓  ●──●                 |
|    30k ▓▓▓▓███▓▓▓▓▓▓▓▓  ●               |
|     0k                                   |
|        Mon Tue Wed Thu Fri Sat Sun       |
|                                          |
| 80%  Your sales performance is 60%       |
|      Better compare to Last month        |
|                                          |
|            [ Details ]                   |
+------------------------------------------+
```

**Features**:
- Bar chart with one highlighted (peak) bar
- Line overlay with dots
- Performance percentage (80%) large
- Natural language performance message
- CTA button "Details"

---

### Customer Ratings Widget (Enhanced)

**Type**: `CUSTOMER_RATINGS`
**Size**: Normal (2-column)

Star rating with comparison trend line:

```
+------------------------------------------+
| Customer Ratings                    [⋮]  |
|                                          |
| 4.5  ★★★★☆                              |
|                                          |
| [+5.0] Points from last month            |
|                                          |
|        ╭───╮      ╭─────╮                |
|    ───╯    ╰──────╯     ╰──── (actual)  |
|   - - - - - - - - - - - - - - (previous)|
|                                  ●       |
|   Jan  Feb  Mar  Apr  May  Jun  Jul      |
+------------------------------------------+
```

**Features**:
- Large rating number with star visualization
- Change badge with descriptive text
- Comparison line chart (solid = actual, dashed = previous period)
- Endpoint dot on current value

---

### Anomaly Detection Widget (Enhanced)

**Type**: `ANOMALY_DETECTION`
**Size**: Normal (2-column)

Alert-style widget with anomaly bar chart:

```
+------------------------------------------+
| Anomaly detected               [⚠️]      |
|                                          |
| Your product reach increasing            |
| beyond our predictions.                  |
|                                          |
|    ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                   |
|             ███                          |
|    ─ ─ ─ ─ ─███─ ─ ─ ─                   |
|        ▓▓▓▓████▓▓  ▓▓▓▓                  |
|     ▓▓▓▓▓▓████▓▓▓▓▓████                  |
|    ▓█▓▓▓▓▓████▓▓▓▓▓████▓▓               |
|                                          |
| 96.5%                                    |
| Prediction 78%        [ See details ]    |
+------------------------------------------+
```

**Features**:
- Warning icon in top right
- Alert message describing the anomaly
- Bar chart with anomaly bar highlighted (white/bright)
- Percentage metrics (actual vs prediction)
- Action button "See details"

---

### Total Income Widget (Enhanced)

**Type**: `TOTAL_INCOME` (variant of `REVENUE_OVERVIEW`)
**Size**: Wide (full width)

Area chart with report sidebar showing breakdown:

```
+------------------------------------------------------------------+
| Total Income                         [⋮] │ Report           [⋮]  |
| Weekly report overview                    │ Weekly activity       |
|                                           │                       |
|    $6k ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─             │ +------------------+  |
|    $5k          ╱╲         ╱              │ | 📗 Income       |  |
|    $4k    ╱────╯  ╲───────╯               │ |    $5,550       |  |
|    $3k ──╯                                │ |         +2.34K  |  |
|    $2k                                    │ +------------------+  |
|    $1k                                    │ +------------------+  |
|        MO  TU  WE  TH  FR  SA  SU        │ | 📘 Expense      |  |
|                                           │ |    $3,520       |  |
|                                           │ |         -1.4K   |  |
|                                           │ +------------------+  |
|                                           │ +------------------+  |
|                                           │ | 📕 Profit       |  |
|                                           │ |    $2,350       |  |
|                                           │ |         +3.22K  |  |
|                                           │ +------------------+  |
+------------------------------------------------------------------+
```

**Features**:
- Gradient area chart (green fill)
- Dashed grid lines
- Side panel with 3 metric cards (Income, Expense, Profit)
- Each card shows value and delta change

---

### Widget Categories for Edit Mode Gallery

```typescript
const WIDGET_CATEGORIES = [
  {
    id: 'charts',
    label: 'Графики и диаграммы',
    widgets: [
      'REVENUE_OVERVIEW',
      'TRANSACTIONS_SUMMARY',
      'INCOME_EXPENSE',
      'DAILY_COMPARISON',
      'CUSTOMER_RATINGS',
      'COMBO_CHART',           // NEW
      'WEEKLY_OVERVIEW_COMBO', // NEW
      'YEAR_COMPARISON',       // NEW
    ]
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    widgets: [
      'PERFORMANCE_RADAR',
      'CONVERSION_FUNNEL',
      'GOAL_RADIAL',
      'HOURLY_BREAKDOWN',
      'GOAL_PROGRESS',
      'GROWTH_GAUGE',          // NEW
      'SALES_PLAN_PROGRESS',   // NEW
    ]
  },
  {
    id: 'data',
    label: 'Данные',
    widgets: [
      'TOP_PRODUCTS',
      'PAYMENT_METHODS',
      'CHANNEL_SPLIT',
      'STAFF_RANKING',
      'ORDERS_BY_CATEGORY',
      'VISITORS_TRAFFIC',
      'TOP_SERVICES_BARS',      // NEW
      'CHANNEL_SALES_BREAKDOWN',// NEW
    ]
  },
  {
    id: 'insights',
    label: 'Аналитические выводы',
    widgets: [
      'ANOMALY_DETECTION',
      'SALES_METRICS',
      'ALERTS',
      'EARNINGS_REPORT',       // NEW
      'FINANCE_REPORT',        // NEW
      'TOTAL_EARNING_DUAL',    // NEW
      'PERFORMANCE_TABS',      // NEW
    ]
  },
]
```

---

## Widget Interaction Patterns

### Hover States

All widgets implement consistent hover behaviors:

```typescript
// Card hover
className="transition-shadow hover:shadow-md"

// Chart element hover
onMouseEnter={() => setHoveredIndex(index)}
onMouseLeave={() => setHoveredIndex(null)}

// Highlight on hover
<Bar
  fill={hoveredIndex === index ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
/>
```

### Click Actions

Widgets support various click interactions:

```typescript
interface IWidgetClickAction {
  type: 'navigate' | 'modal' | 'expand' | 'drill-down'
  target?: string  // Route or modal ID
  params?: Record<string, unknown>
}
```

### Responsive Behavior

```typescript
// Widget grid adapts to screen size
<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
  {widgets.map(widget => (
    <WidgetCard key={widget.id} {...widget} />
  ))}
</div>

// Wide widgets span full width
<div className="col-span-full">
  <WideWidget />
</div>
```

---

## Period Selector

### Visual Design

Horizontal row of pill buttons + custom date picker:

```
[Сегодня] [Вчера] [Неделя] [Месяц] [📅 Произвольно]
```

### Period Types

```typescript
enum PeriodType {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  THIS_WEEK = 'THIS_WEEK',
  LAST_WEEK = 'LAST_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  THIS_QUARTER = 'THIS_QUARTER',
  LAST_QUARTER = 'LAST_QUARTER',
  THIS_YEAR = 'THIS_YEAR',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
}
```

### Quick Select Options (Visible in UI)

```typescript
const PERIOD_OPTIONS = [
  { value: PeriodType.TODAY, label: 'Сегодня' },
  { value: PeriodType.YESTERDAY, label: 'Вчера' },
  { value: PeriodType.THIS_WEEK, label: 'Неделя' },
  { value: PeriodType.THIS_MONTH, label: 'Месяц' },
]
```

### Custom Date Range Picker

When user clicks "Произвольно":
- Opens Popover with Calendar component (2 months side by side)
- Range selection mode
- Russian locale (`ru` from date-fns)
- Week starts on Monday (`weekStartsOn={1}`)
- Disables future dates

### API Format

```typescript
interface IPeriodInput {
  type: PeriodType
  customStart?: string  // "2025-12-01" (ISO date)
  customEnd?: string    // "2025-12-28" (ISO date)
}

// Example for custom range
const period = {
  type: PeriodType.CUSTOM,
  customStart: "2025-12-01",
  customEnd: "2025-12-28",
}
```

---

## Branch Selector

### Visual Design

Dropdown select with "All Branches" option:

```
Филиал: [Все филиалы           ▼]
        ├─ Все филиалы
        ├─ Main Branch
        ├─ Downtown
        └─ Airport
```

### Behavior

- Fetches branches list from `useGetAllBranches` hook
- Shows loading state while fetching
- `"all"` value = `undefined` branchId (aggregated data)
- Specific branch = `number` branchId (filtered data)

### API Behavior

When `branchId` is `undefined`:
- Returns aggregated data across ALL branches user has access to

When `branchId` is specified:
- Returns data filtered to that specific branch

---

## Dashboard Edit Mode

### Access Control

Edit mode is ONLY available to users with:
- `dashboard_custom: true` entitlement (PRO plan)
- OR `analytics_full: true` entitlement (ULTRA plan)

### Visual Layout

Edit mode replaces the entire dashboard view with a tabbed configuration interface:

```
+------------------------------------------------------------------+
| [Layout icon] Настройка дашборда                 [Отмена] [Сохранить] |
| Визуальный редактор с превью                                      |
|------------------------------------------------------------------|
| [✨ KPI карточки] [📊 Основной график] [⚙️ Виджеты]               |
|------------------------------------------------------------------|
|                                                                   |
|                    TAB CONTENT                                    |
|                                                                   |
+------------------------------------------------------------------+
```

### Tab 1: KPI Cards Configuration

**Active KPIs Section** (draggable grid):
```
+-------------+ +-------------+ +-------------+ +-------------+
| ≡ 💵        | | ≡ 🛒        | | ≡ 🧾        | | ≡ 👤        |
|   Выручка   | |   Заказы    | |   Ср.чек    | |   Новые     |
|   1,234,567 | |   156       | |   80,128    | |   23        |
|   ↑ +12.5%  | |   ↑ +5.2%   | |   ↑ +6.1%   | |   ↓ -2.3%   |
| [sparkline] | | [sparkline] | | [sparkline] | | [sparkline] |
|         [X] | |         [X] | |         [X] | |         [X] |
+-------------+ +-------------+ +-------------+ +-------------+
```

**Add KPI Section** (shows unused KPIs with visual preview):
- Each KPI shows icon, name, mini sparkline preview, demo values
- Click to add (max 6 KPIs total)
- Already added KPIs are hidden from this section

### Tab 2: Main Chart Configuration

**Chart Type Selection** (visual selector with live previews):
```
+----------+ +----------+ +----------+ +----------+ +----------+
|  [area   | |  [bar    | |  [line   | | [radial  | | [radar   |
|  chart]  | |  chart]  | |  chart]  | |  chart]  | |  chart]  |
|          | |          | |          | |          | |          |
|  Область | |  Столбцы | |  Линия   | | Радиальн.| |  Радар   |
+----------+ +----------+ +----------+ +----------+ +----------+
      ✓
```

**Large Chart Preview** (shows selected type with demo data):
- 256px height
- Uses brand color (#fe4a49)
- Live animated preview

**Metric Selector**:
```
Метрика для графика:
[Выручка                                    ▼]
```

### Tab 3: Widgets Configuration

**Active Widgets** (draggable 2-column grid):
```
+---------------------------+ +---------------------------+
| ≡ Обзор дохода        [X] | | ≡ Топ продукты        [X] |
| График с суммарной статис.| | Лучшие товары по выручке  |
| [chart preview]           | | [list preview]            |
+---------------------------+ +---------------------------+
```

**Widget Gallery** (categorized with visual previews):

Categories:
1. **Графики и диаграммы**: REVENUE_OVERVIEW, TRANSACTIONS_SUMMARY, INCOME_EXPENSE, DAILY_COMPARISON, CUSTOMER_RATINGS
2. **Аналитика**: PERFORMANCE_RADAR, CONVERSION_FUNNEL, GOAL_RADIAL, HOURLY_BREAKDOWN, GOAL_PROGRESS
3. **Данные**: TOP_PRODUCTS, PAYMENT_METHODS, CHANNEL_SPLIT, STAFF_RANKING, ORDERS_BY_CATEGORY, VISITORS_TRAFFIC
4. **Аналитические выводы**: ANOMALY_DETECTION, SALES_METRICS

Each widget card shows:
- Visual preview (mini chart/list/heatmap)
- Widget name
- Description
- "Добавлен" badge if already in use

### Widget Preview Types

```typescript
type WidgetPreviewType = 'area' | 'bar' | 'line' | 'pie' | 'donut' | 'radar' | 'list' | 'funnel' | 'heatmap'
```

### Drag & Drop Implementation

Uses `@dnd-kit/core` with:
- `DndContext` - Context provider
- `SortableContext` - Enables sorting
- `useSortable` - Hook for individual items
- `DragOverlay` - Shows dragged item
- `rectSortingStrategy` - Grid sorting strategy

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
)
```

### Save Configuration

On save:
1. Validate configuration
2. Call `saveDashboardConfig` mutation
3. Show success toast "Дашборд сохранен"
4. Exit edit mode
5. Reload dashboard with new config

On error:
- If `ENTITLEMENT_REQUIRED`: Show "Кастомизация доступна только на PRO плане"
- Otherwise: Show "Не удалось сохранить: {error}"

---

## API Reference

### Dashboard Config Query

```graphql
query DashboardConfig {
  dashboardConfig {
    kpiSlots {
      position
      type
      visible
    }
    chartMetric
    chartGroupBy
    chartType
    widgets {
      id
      type
      position
      config
    }
  }
}
```

### Save Dashboard Config Mutation

```graphql
mutation SaveDashboardConfig($config: DashboardConfigInput!) {
  saveDashboardConfig(config: $config) {
    success
  }
}
```

Variables:
```json
{
  "config": {
    "kpiSlots": [
      { "position": 0, "type": "REVENUE", "visible": true },
      { "position": 1, "type": "ORDERS", "visible": true }
    ],
    "chartMetric": "REVENUE",
    "chartGroupBy": "DAY",
    "chartType": "area",
    "widgets": [
      { "id": "w1", "type": "TOP_PRODUCTS", "position": 0 }
    ]
  }
}
```

### KPI Metrics Query

```graphql
query KpiMetrics($types: [KpiType!]!, $period: PeriodInput!, $branchId: Int) {
  kpiMetrics(types: $types, period: $period, branchId: $branchId) {
    type
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

### Time Series Query

```graphql
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
```

### Widget Data Queries

**Ranked List** (TOP_PRODUCTS, STAFF_RANKING):
```graphql
query RankedList($dataset: Dataset!, $period: PeriodInput!, $sortBy: SortBy, $limit: Int, $branchId: Int) {
  rankedList(dataset: $dataset, period: $period, sortBy: $sortBy, limit: $limit, branchId: $branchId) {
    rank
    id
    name
    value
    formattedValue
    percentage
    secondaryValue
    secondaryLabel
  }
}
```

Variables for TOP_PRODUCTS:
```json
{ "dataset": "PRODUCTS", "sortBy": "REVENUE", "limit": 5 }
```

Variables for STAFF_RANKING:
```json
{ "dataset": "STAFF", "sortBy": "REVENUE", "limit": 5 }
```

**Proportions** (PAYMENT_METHODS, CHANNEL_SPLIT):
```graphql
query Proportions($dimension: String!, $period: PeriodInput!, $branchId: Int) {
  proportions(dimension: $dimension, period: $period, branchId: $branchId) {
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

Variables for PAYMENT_METHODS:
```json
{ "dimension": "PAYMENT_METHOD" }
```

Variables for CHANNEL_SPLIT:
```json
{ "dimension": "CHANNEL" }
```

**Heatmap** (HOURLY_BREAKDOWN):
```graphql
query Heatmap($period: PeriodInput!, $metric: KpiType, $branchId: Int) {
  heatmap(period: $period, metric: $metric, branchId: $branchId) {
    cells {
      hour
      dayOfWeek
      value
      label
    }
    maxValue
    minValue
  }
}
```

**Goals Summary** (GOAL_PROGRESS):
```graphql
query GoalsSummary($branchId: Int) {
  goalsSummary(branchId: $branchId) {
    goals {
      id
      name
      target
      current
      percentage
      status
    }
    completedCount
    totalCount
  }
}
```

**Alert Summary** (ALERTS):
```graphql
query AlertSummary($branchId: Int) {
  alertSummary(branchId: $branchId) {
    alerts {
      id
      type
      message
      timestamp
      isRead
    }
    unreadCount
    totalCount
  }
}
```

### Enhanced Widget Queries (NEW)

**Earnings Report** (EARNINGS_REPORT):
```graphql
query EarningsReport($period: PeriodInput!, $branchId: Int) {
  earningsReport(period: $period, branchId: $branchId) {
    netProfit { value changePercent sources }
    totalIncome { value changePercent sources }
    totalExpense { value changePercent sources }
    dailyBreakdown { day value isHighlighted }
  }
}
```

**Growth Gauge** (GROWTH_GAUGE):
```graphql
query GrowthGauge($period: PeriodInput!, $branchId: Int) {
  growthGauge(period: $period, branchId: $branchId) {
    currentYear
    previousYear
    growthPercentage
    companyGrowth
    yearComparison { year value formattedValue }
    monthlyComparison { month currentValue previousValue }
  }
}
```

**Combo Chart** (COMBO_CHART):
```graphql
query ComboChart(
  $primaryMetric: KpiType!
  $secondaryMetric: KpiType!
  $period: PeriodInput!
  $groupBy: GroupBy
  $branchId: Int
) {
  comboChart(
    primaryMetric: $primaryMetric
    secondaryMetric: $secondaryMetric
    period: $period
    groupBy: $groupBy
    branchId: $branchId
  ) {
    points { label primaryValue secondaryValue isHighlighted }
    primaryTotal
    secondaryTotal
    performancePercentage
    performanceMessage
  }
}
```

**Channel Sales Breakdown** (CHANNEL_SALES_BREAKDOWN):
```graphql
query ChannelSalesBreakdown($period: PeriodInput!, $branchId: Int) {
  channelSalesBreakdown(period: $period, branchId: $branchId) {
    totalSales
    formattedTotal
    changePercent
    channels { id name icon value formattedValue changePercent }
    hourlyBreakdown { hour barValue lineValue }
  }
}
```

**Performance Tabs** (PERFORMANCE_TABS):
```graphql
query PerformanceTabs($tab: String!, $period: PeriodInput!, $branchId: Int) {
  performanceTabs(tab: $tab, period: $period, branchId: $branchId) {
    tabs { id label }
    activeTab
    user { id name role avatar }
    dailyCount
    dailyLabel
    primaryMetric { label value formattedValue changePercent teamAvatars }
    insightMessage
  }
}
```

**Sales Plan Progress** (SALES_PLAN_PROGRESS):
```graphql
query SalesPlanProgress($period: PeriodInput!, $branchId: Int) {
  salesPlanProgress(period: $period, branchId: $branchId) {
    percentage
    description
    cohortDescription
    actions { icon label onClick }
    progressIndicator { filled total }
  }
}
```

**Year Comparison** (YEAR_COMPARISON):
```graphql
query YearComparison($currentYear: Int!, $compareYear: Int!, $branchId: Int) {
  yearComparison(currentYear: $currentYear, compareYear: $compareYear, branchId: $branchId) {
    title
    subtitle
    legend { key label color }
    monthlyData { month values }
    report {
      monthlyAverage
      formattedAverage
      summaryMetrics { icon label value formattedValue }
    }
  }
}
```

**Finance Report** (FINANCE_REPORT):
```graphql
query FinanceReport($period: PeriodInput!, $branchId: Int) {
  financeReport(period: $period, branchId: $branchId) {
    title
    subtitle
    chartData { month stacks { key value color } }
    report {
      title
      subtitle
      metrics { icon iconBgColor label value formattedValue }
    }
  }
}
```

**Top Services Bars** (TOP_SERVICES_BARS):
```graphql
query TopServicesBars($period: PeriodInput!, $limit: Int, $branchId: Int) {
  topServicesBars(period: $period, limit: $limit, branchId: $branchId) {
    items { rank name percentage color }
    legend { name percentage color }
  }
}
```

**Total Earning Dual** (TOTAL_EARNING_DUAL):
```graphql
query TotalEarningDual($period: PeriodInput!, $branchId: Int) {
  totalEarningDual(period: $period, branchId: $branchId) {
    percentage
    changePercent
    bars { label topValue bottomValue }
    summaryRows { icon label description value formattedValue }
  }
}
```

**Anomaly Detection** (ANOMALY_DETECTION - Enhanced):
```graphql
query AnomalyDetection($period: PeriodInput!, $branchId: Int) {
  anomalyDetection(period: $period, branchId: $branchId) {
    title
    message
    bars { value isAnomaly }
    actualPercentage
    predictionPercentage
  }
}
```

**Customer Ratings** (CUSTOMER_RATINGS - Enhanced):
```graphql
query CustomerRatings($period: PeriodInput!, $branchId: Int) {
  customerRatings(period: $period, branchId: $branchId) {
    rating
    maxRating
    changePoints
    changeDescription
    trendData { month actualValue previousValue }
  }
}
```

---

## TypeScript Interfaces

### Dashboard Config

```typescript
interface IKpiSlot {
  position: number
  type: KpiType
  visible: boolean
}

interface IDashboardWidget {
  id: string
  type: WidgetType
  position: number
  config: Record<string, unknown> | null
}

interface IDashboardConfig {
  kpiSlots: IKpiSlot[]
  chartMetric: KpiType
  chartGroupBy: GroupBy | null
  chartType: ChartType
  widgets: IDashboardWidget[]
}

interface IDashboardConfigInput {
  kpiSlots: IKpiSlot[]
  chartMetric: KpiType
  chartGroupBy: GroupBy | null
  chartType: ChartType
  widgets: Omit<IDashboardWidget, 'config'>[]
}
```

### KPI Metrics

```typescript
interface IKpiMetricValue {
  type: KpiType
  value: number
  previousValue: number
  changePercent: number
  trend: Trend  // 'UP' | 'DOWN' | 'FLAT'
  formattedValue: string
  periodLabel: string
  comparisonLabel: string
}
```

### Time Series

```typescript
interface ITimeSeriesPoint {
  timestamp: string
  value: number
  label: string
  isHighlighted: boolean
}

interface ITimeSeriesData {
  metric: KpiType
  groupBy: GroupBy
  totalValue: number
  changePercent: number
  points: ITimeSeriesPoint[]
}
```

### Widget Data

```typescript
interface IRankedItem {
  rank: number
  id: number
  name: string
  value: number
  formattedValue: string
  percentage: number
  secondaryValue?: number
  secondaryLabel?: string
}

interface IProportionSegment {
  key: string
  label: string
  value: number
  percentage: number
  color?: string
}

interface IProportionsData {
  total: number
  formattedTotal: string
  segments: IProportionSegment[]
}

interface IGoalProgress {
  id: string
  name: string
  target: number
  current: number
  percentage: number
  status: 'ON_TRACK' | 'AT_RISK' | 'BEHIND'
}

interface IAlert {
  id: string
  type: 'WARNING' | 'INFO' | 'ERROR'
  message: string
  timestamp: string
  isRead: boolean
}
```

### Enhanced Widget Data (NEW)

```typescript
// === Earnings Report Widget ===
interface IEarningsMetric {
  value: number
  changePercent: number
  sources: string[]  // e.g., ["Sales", "Affiliation"]
}

interface IEarningsReportData {
  netProfit: IEarningsMetric
  totalIncome: IEarningsMetric
  totalExpense: IEarningsMetric
  dailyBreakdown: Array<{
    day: string        // "MO", "TU", etc.
    value: number
    isHighlighted: boolean
  }>
}

// === Growth Gauge Widget ===
interface IGrowthGaugeData {
  currentYear: number
  previousYear: number
  growthPercentage: number   // The gauge value (0-100)
  companyGrowth: number      // Secondary percentage
  yearComparison: Array<{
    year: number
    value: number
    formattedValue: string
  }>
  monthlyComparison: Array<{
    month: string
    currentValue: number
    previousValue: number
  }>
}

// === Combo Chart Widget ===
interface IComboChartData {
  points: Array<{
    label: string
    primaryValue: number    // Bar value
    secondaryValue: number  // Line value
    isHighlighted: boolean
  }>
  primaryTotal: number
  secondaryTotal: number
  performancePercentage: number
  performanceMessage: string  // e.g., "60% Better compare to Last month"
}

// === Channel Sales Breakdown Widget ===
interface IChannelSalesData {
  totalSales: number
  formattedTotal: string
  changePercent: number
  channels: Array<{
    id: string
    name: string
    icon: string      // Icon name (e.g., "globe", "home")
    value: number
    formattedValue: string
    changePercent: number
  }>
  hourlyBreakdown: Array<{
    hour: string      // "10:00", "12:00", etc.
    barValue: number
    lineValue: number
  }>
}

// === Performance Tabs Widget ===
interface IPerformanceTab {
  id: string
  label: string
}

interface IPerformanceUserCard {
  id: string
  name: string
  role: string
  avatar?: string
}

interface IPerformanceMetric {
  label: string
  value: number
  formattedValue: string
  changePercent: number
  teamAvatars?: string[]
}

interface IPerformanceTabsData {
  tabs: IPerformanceTab[]
  activeTab: string
  user: IPerformanceUserCard
  dailyCount: number
  dailyLabel: string
  primaryMetric: IPerformanceMetric
  insightMessage: string
}

// === Sales Plan Progress Widget ===
interface ISalesPlanData {
  percentage: number          // Large percentage (54%)
  description: string         // "Percentage profit from total sales"
  cohortDescription: string   // Explanation text
  actions: Array<{
    icon: string
    label: string
    onClick: string  // Action identifier
  }>
  progressIndicator: {
    filled: number   // Number of filled circles
    total: number    // Total circles
  }
}

// === Year Comparison Widget ===
interface IYearComparisonData {
  title: string               // "Finance"
  subtitle: string            // "Yearly report overview"
  legend: Array<{
    key: string
    label: string
    color: string
  }>
  monthlyData: Array<{
    month: string
    values: Record<string, number>  // { revenue: 40, expense: 10, profit: 30 }
  }>
  report: {
    monthlyAverage: number
    formattedAverage: string
    summaryMetrics: Array<{
      icon: string
      label: string
      value: number
      formattedValue: string
    }>
  }
}

// === Finance Report Widget ===
interface IFinanceReportData {
  title: string
  subtitle: string
  chartData: Array<{
    month: string
    stacks: Array<{
      key: string
      value: number
      color: string
    }>
  }>
  report: {
    title: string
    subtitle: string
    metrics: Array<{
      icon: string
      iconBgColor: string
      label: string
      value: number
      formattedValue: string
    }>
  }
}

// === Top Services Bars Widget ===
interface ITopServicesData {
  items: Array<{
    rank: number
    name: string
    percentage: number
    color: string
  }>
  legend: Array<{
    name: string
    percentage: number
    color: string
  }>
}

// === Total Earning Dual Widget ===
interface ITotalEarningDualData {
  percentage: number
  changePercent: number
  bars: Array<{
    label: string
    topValue: number    // Coral portion
    bottomValue: number // Orange portion
  }>
  summaryRows: Array<{
    icon: string
    label: string
    description: string
    value: number
    formattedValue: string
  }>
}

// === Anomaly Detection Widget (Enhanced) ===
interface IAnomalyDetectionData {
  title: string              // "Anomaly detected"
  message: string            // Alert message
  bars: Array<{
    value: number
    isAnomaly: boolean
  }>
  actualPercentage: number   // 96.5%
  predictionPercentage: number // 78%
}

// === Customer Ratings Widget (Enhanced) ===
interface ICustomerRatingsData {
  rating: number             // 4.5
  maxRating: number          // 5
  changePoints: number       // +5.0
  changeDescription: string  // "Points from last month"
  trendData: Array<{
    month: string
    actualValue: number
    previousValue: number    // For dashed line comparison
  }>
}

// === Widget Configuration Interfaces ===
interface IComboChartConfig {
  primaryMetric: KpiType
  secondaryMetric: KpiType
  highlightPeak: boolean
  showSummaryMessage: boolean
}

interface IPerformanceTabsConfig {
  tabs: Array<{
    id: string
    label: string
    dataQuery: string
  }>
  defaultTab: string
}

interface IYearComparisonConfig {
  currentYear: number
  compareYear: number
  metrics: Array<{
    key: string
    label: string
    color: string
  }>
}
```

### Enums (from GraphQL schema)

```typescript
enum KpiType {
  REVENUE = 'REVENUE',
  ORDERS = 'ORDERS',
  AVG_CHECK = 'AVG_CHECK',
  CUSTOMERS = 'CUSTOMERS',
  NEW_CUSTOMERS = 'NEW_CUSTOMERS',
  RETURNING_CUSTOMERS = 'RETURNING_CUSTOMERS',
  TIPS = 'TIPS',
  REFUNDS = 'REFUNDS',
  CANCELLATIONS = 'CANCELLATIONS',
  MARGIN = 'MARGIN',
  RETENTION_RATE = 'RETENTION_RATE',
  STAFF_PRODUCTIVITY = 'STAFF_PRODUCTIVITY',
}

enum GroupBy {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

enum Trend {
  UP = 'UP',
  DOWN = 'DOWN',
  FLAT = 'FLAT',
}

enum PeriodType {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  THIS_WEEK = 'THIS_WEEK',
  LAST_WEEK = 'LAST_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  THIS_QUARTER = 'THIS_QUARTER',
  LAST_QUARTER = 'LAST_QUARTER',
  THIS_YEAR = 'THIS_YEAR',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
}
```

---

## File Structure

```
src/
├── app/dashboard/overview/
│   ├── page.tsx              # Route entry point
│   ├── layout.tsx            # Layout wrapper
│   └── error.tsx             # Error boundary
│
├── entities/dashboard/
│   ├── index.ts              # Public exports
│   └── model/
│       ├── api.ts            # API functions
│       ├── hooks.ts          # React Query hooks
│       ├── queries.ts        # GraphQL query strings
│       ├── query-keys.ts     # Query key factories
│       └── types.ts          # TypeScript interfaces
│
├── features/dashboard-builder/
│   ├── index.ts              # Public exports
│   ├── model/
│   │   └── use-widget-data.ts
│   └── ui/
│       ├── add-widget-button.tsx
│       ├── add-widget-modal.tsx
│       ├── dashboard-edit-mode.tsx  # Main edit mode component
│       ├── edit-mode-toggle.tsx
│       ├── widget-actions.tsx
│       ├── widget-config-modal.tsx
│       └── widget-drag-handle.tsx
│
├── widgets/overview/
│   ├── index.ts              # Public exports
│   └── components/
│       ├── analytics-overview.tsx    # Main dashboard view
│       ├── dashboard-kpi-cards.tsx   # KPI cards container
│       ├── kpi-card-sparkline.tsx    # Individual KPI card
│       ├── dashboard-main-chart.tsx  # Main chart component
│       ├── dashboard-period-selector.tsx
│       ├── dashboard-branch-selector.tsx
│       └── [other charts...]
│
└── widgets/analytics-widgets/
    ├── index.ts              # Public exports
    └── ui/
        ├── dashboard-widgets-section.tsx  # Widget grid container
        ├── widget-card.tsx               # Widget wrapper
        │
        │   # === Core Widgets ===
        ├── top-products-widget.tsx
        ├── payment-methods-widget.tsx
        ├── channel-split-widget.tsx
        ├── staff-ranking-widget.tsx
        ├── revenue-overview-widget.tsx   # Wide widget
        ├── transactions-summary-widget.tsx
        ├── performance-radar-widget.tsx
        ├── daily-comparison-widget.tsx
        ├── income-expense-widget.tsx
        ├── customer-ratings-widget.tsx   # Enhanced with trend line
        ├── conversion-funnel-widget.tsx
        ├── orders-by-category-widget.tsx
        ├── anomaly-detection-widget.tsx  # Enhanced with prediction
        ├── visitors-traffic-widget.tsx
        ├── sales-metrics-widget.tsx
        ├── goal-radial-widget.tsx
        │
        │   # === NEW Enhanced Widgets ===
        ├── earnings-report-widget.tsx     # Metric cards + bar chart
        ├── growth-gauge-widget.tsx        # Semi-circular gauge
        ├── combo-chart-widget.tsx         # Bar + line overlay (WIDE)
        ├── channel-sales-breakdown-widget.tsx  # Channel breakdown
        ├── performance-tabs-widget.tsx    # Tabbed interface
        ├── sales-plan-progress-widget.tsx # Large % with progress
        ├── year-comparison-widget.tsx     # Year over year (WIDE)
        ├── finance-report-widget.tsx      # Stacked bar + sidebar (WIDE)
        ├── top-services-bars-widget.tsx   # Horizontal colored bars
        ├── total-earning-dual-widget.tsx  # Dual-color bars
        └── weekly-overview-combo-widget.tsx # Bar + line + message
```

---

## Default Configuration

When no custom config exists (new user or BASIC plan):

```typescript
function getDefaultDashboardConfig(): IDashboardConfig {
  return {
    kpiSlots: [
      { position: 0, type: KpiType.REVENUE, visible: true },
      { position: 1, type: KpiType.ORDERS, visible: true },
      { position: 2, type: KpiType.AVG_CHECK, visible: true },
      { position: 3, type: KpiType.NEW_CUSTOMERS, visible: true },
    ],
    chartMetric: KpiType.REVENUE,
    chartGroupBy: null,  // Auto based on period
    chartType: 'area',
    widgets: [
      { id: 'w1', type: 'REVENUE_OVERVIEW', position: 0, config: null },
      { id: 'w2', type: 'TOP_PRODUCTS', position: 1, config: null },
      { id: 'w3', type: 'PAYMENT_METHODS', position: 2, config: null },
      { id: 'w4', type: 'CHANNEL_SPLIT', position: 3, config: null },
    ],
  }
}
```

---

## Error Handling

### Loading States

All components have skeleton states:
- KPI Cards: Gray animated rectangles
- Main Chart: Gray animated card
- Widgets: Gray animated cards

### Error States

**Network Error** (entire dashboard):
```
+------------------------------------------------------------------+
| ⚠️ Не удалось загрузить данные. Проверьте подключение к интернету.|
+------------------------------------------------------------------+
```

**Individual Widget Error**:
```
+---------------------------+
| Топ продукты              |
|                           |
| [!] Не удалось загрузить  |
|     [ Повторить ]         |
|                           |
+---------------------------+
```

### Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| UNAUTHENTICATED | Token invalid/expired | Redirect to login |
| FORBIDDEN | No permission | Show "Access Denied" |
| BAD_USER_INPUT | Invalid parameters | Show validation error |
| ENTITLEMENT_REQUIRED | Feature requires higher tier | Show upgrade prompt |
| RATE_LIMITED | Too many requests | Show "Please wait" |

---

## Caching Strategy

React Query configuration:
- **staleTime**: 5 minutes (`5 * 60 * 1000`)
- **Cache invalidation**: On save, on period/branch change
- **Refetch on focus**: Enabled (default)

Query keys structure:
```typescript
const dashboardKeys = {
  all: ['dashboard'] as const,
  config: () => [...dashboardKeys.all, 'config'] as const,
  entitlements: () => [...dashboardKeys.all, 'entitlements'] as const,
  kpiMetrics: (params: IKpiMetricsParams) => [...dashboardKeys.all, 'kpi', params] as const,
  timeSeries: (params: ITimeSeriesParams) => [...dashboardKeys.all, 'timeseries', params] as const,
  // ... widget-specific keys
}
```

---

## FAQ

**Q: Can user add more than 4 KPI cards?**
A: Yes, up to 6 KPIs maximum. Requires PRO/ULTRA plan.

**Q: What grouping is used for "Auto"?**
A: Backend determines based on period: TODAY=HOUR, THIS_WEEK=DAY, THIS_MONTH=DAY, THIS_YEAR=MONTH.

**Q: Are enum values case-sensitive?**
A: YES. Always use UPPERCASE: "REVENUE" not "revenue".

**Q: What happens if user downgrades from PRO to BASIC?**
A: Their custom config is preserved but they can no longer edit. Dashboard shows default config.

**Q: How do charts handle dark mode?**
A: Colors use Tailwind's dark mode variants. Chart colors are CSS variables that adapt automatically.

**Q: What is the brand primary color?**
A: `#fe4a49` (red) - used for charts and accents.

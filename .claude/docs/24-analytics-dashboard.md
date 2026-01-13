# 24. Analytics Dashboard - Complete Implementation Guide

This document covers the Dashboard Overview page (`/dashboard/overview`) and its Edit Mode. It provides complete implementation details including UI components, API integration, and visual design specifications.

**API**: GraphQL (NOT REST)
**Endpoint**: `POST /graphql`
**Authentication**: JWT Bearer Token

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Types](#data-types)
3. [Dashboard Overview Page](#dashboard-overview-page)
4. [Edit Mode](#edit-mode)
5. [KPI Cards](#kpi-cards)
6. [Main Chart](#main-chart)
7. [Widgets](#widgets)
8. [GraphQL API](#graphql-api)
9. [Drag and Drop](#drag-and-drop)
10. [Subscription & Entitlements](#subscription--entitlements)

---

## Architecture Overview

### File Structure

```
src/
├── app/dashboard/overview/
│   └── page.tsx                    # Route: /dashboard/overview
├── entities/dashboard/
│   ├── index.ts                    # Public API exports
│   └── model/
│       ├── types.ts                # TypeScript types
│       ├── hooks.ts                # React Query hooks
│       ├── api.ts                  # GraphQL API functions
│       ├── queries.ts              # GraphQL query definitions
│       └── query-keys.ts           # React Query keys
├── features/dashboard-builder/
│   └── ui/
│       └── dashboard-edit-mode.tsx # Edit mode component
└── widgets/
    ├── overview/
    │   └── components/
    │       ├── analytics-overview.tsx       # Main dashboard container
    │       ├── dashboard-kpi-cards.tsx      # KPI cards grid
    │       ├── dashboard-chart.tsx          # Main chart component
    │       ├── dashboard-period-selector.tsx
    │       └── dashboard-branch-selector.tsx
    └── analytics-widgets/
        └── ui/
            ├── dashboard-widgets-section.tsx # Widget container
            ├── widget-card.tsx               # Widget wrapper
            ├── top-products-widget.tsx
            ├── payment-methods-widget.tsx
            ├── channel-split-widget.tsx
            ├── staff-ranking-widget.tsx
            └── ... (other widgets)
```

### Component Hierarchy

```
AnalyticsOverview (main container)
├── Header (title + edit button)
├── Filters (period selector, branch selector)
├── DashboardKpiCards
│   └── KpiCardSparkline[] (individual KPI cards with mini charts)
├── DashboardChart (main area chart)
└── DashboardWidgetsSection
    └── WidgetRenderer[] (individual widgets)

DashboardEditMode (edit container)
├── Header (cancel + save buttons)
└── Tabs
    ├── KPI Tab
    │   ├── Active KPIs (sortable grid with DragOverlay)
    │   └── Available KPIs (add new)
    ├── Chart Tab
    │   ├── Chart Type Selector (visual previews)
    │   ├── Chart Preview
    │   └── Metric Selector
    └── Widgets Tab
        ├── Active Widgets (sortable grid with DragOverlay)
        └── Widget Gallery (categorized with previews)
```

---

## Data Types

### Core Types (src/entities/dashboard/model/types.ts)

```typescript
// KPI Slot Configuration
interface IKpiSlot {
  position: number      // 0-5 (max 6 slots)
  type: KpiType         // REVENUE, ORDERS, etc.
  visible: boolean      // Always true for active slots
}

// Widget Configuration
type WidgetType =
  | 'TOP_PRODUCTS'
  | 'PAYMENT_METHODS'
  | 'CHANNEL_SPLIT'
  | 'STAFF_RANKING'
  | 'HOURLY_BREAKDOWN'
  | 'GOAL_PROGRESS'
  | 'ALERTS'
  | 'CUSTOMER_SEGMENTS'
  | 'BRANCH_COMPARISON'
  | 'REVENUE_OVERVIEW'
  | 'ORDERS_CHART'
  | 'TRANSACTIONS_SUMMARY'
  | 'PERFORMANCE_RADAR'
  | 'DAILY_COMPARISON'
  | 'INCOME_EXPENSE'
  | 'CUSTOMER_RATINGS'
  | 'CONVERSION_FUNNEL'
  | 'ORDERS_BY_CATEGORY'
  | 'ANOMALY_DETECTION'
  | 'VISITORS_TRAFFIC'
  | 'SALES_METRICS'
  | 'GOAL_RADIAL'

interface IDashboardWidget {
  id: string                           // Unique ID (e.g., "w1", "w1736789012345")
  type: WidgetType
  position: number                     // Display order
  config: Record<string, unknown> | null
}

// Chart Type for Main Chart
type ChartType = 'area' | 'bar' | 'line' | 'radial' | 'radar'

// Dashboard Configuration (stored on backend)
interface IDashboardConfig {
  kpiSlots: IKpiSlot[]
  chartMetric: KpiType
  chartType: ChartType          // NEW: type of chart visualization
  chartGroupBy: GroupBy | null  // null = auto (backend decides)
  widgets: IDashboardWidget[]
}
```

### KPI Types (from GraphQL schema)

```typescript
enum KpiType {
  REVENUE = 'REVENUE'
  ORDERS = 'ORDERS'
  AVG_CHECK = 'AVG_CHECK'
  CUSTOMERS = 'CUSTOMERS'
  NEW_CUSTOMERS = 'NEW_CUSTOMERS'
  RETURNING_CUSTOMERS = 'RETURNING_CUSTOMERS'
  TIPS = 'TIPS'
  REFUNDS = 'REFUNDS'
  CANCELLATIONS = 'CANCELLATIONS'
  MARGIN = 'MARGIN'
  RETENTION_RATE = 'RETENTION_RATE'
  STAFF_PRODUCTIVITY = 'STAFF_PRODUCTIVITY'
}
```

### KPI Display Configuration

```typescript
const KPI_CONFIG: Record<KpiType, { label: string; icon: Icon; color: string; bgColor: string }> = {
  REVENUE:             { label: 'Выручка',       icon: IconCurrencyDollar, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ORDERS:              { label: 'Заказы',        icon: IconShoppingCart,   color: 'text-blue-600',    bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  AVG_CHECK:           { label: 'Средний чек',   icon: IconReceipt,        color: 'text-violet-600',  bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
  CUSTOMERS:           { label: 'Клиенты',       icon: IconUsers,          color: 'text-cyan-600',    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  NEW_CUSTOMERS:       { label: 'Новые клиенты', icon: IconUserPlus,       color: 'text-teal-600',    bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  RETURNING_CUSTOMERS: { label: 'Постоянные',    icon: IconRefresh,        color: 'text-indigo-600',  bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  TIPS:                { label: 'Чаевые',        icon: IconCash,           color: 'text-amber-600',   bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  REFUNDS:             { label: 'Возвраты',      icon: IconReceiptRefund,  color: 'text-orange-600',  bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  CANCELLATIONS:       { label: 'Отмены',        icon: IconX,              color: 'text-red-600',     bgColor: 'bg-red-100 dark:bg-red-900/30' },
  MARGIN:              { label: 'Маржа',         icon: IconChartBar,       color: 'text-lime-600',    bgColor: 'bg-lime-100 dark:bg-lime-900/30' },
  RETENTION_RATE:      { label: 'Удержание',     icon: IconPercentage,     color: 'text-pink-600',    bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  STAFF_PRODUCTIVITY:  { label: 'Продуктивность',icon: IconActivity,       color: 'text-fuchsia-600', bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' },
}
```

---

## Dashboard Overview Page

### UI Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│  Аналитика                                              [Редактировать] │
│                                                                         │
│  [Сегодня ▾]  |  [Все филиалы ▾]                                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ ₽ Выручка    │ │ 🛒 Заказы    │ │ 🧾 Ср. чек   │ │ 👤 Новые     │   │
│  │ 12,500,000   │ │     156      │ │   80,128     │ │     23       │   │
│  │ ▲ +11.6%     │ │ ▲ +5.2%      │ │ ▲ +6.1%      │ │ ▼ -2.3%      │   │
│  │ ~~~~mini~~~~│ │ ~~~~mini~~~~│ │ ~~~~mini~~~~│ │ ~~~~mini~~~~│   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Выручка                              12,500,000 сум  ▲ +11.6% │   │
│  │                                                                  │   │
│  │        ╱╲                                                        │   │
│  │       ╱  ╲        ╱╲                                             │   │
│  │      ╱    ╲______╱  ╲______                                      │   │
│  │  ___╱                      ╲____                                 │   │
│  │                                                                  │   │
│  │  Mon   Tue   Wed   Thu   Fri   Sat   Sun                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────┐  ┌──────────────────────────┐           │
│  │  Топ продукты            │  │  Способы оплаты          │           │
│  │  1. Pizza Margherita 45% │  │  ┌────┐ Наличные 46%     │           │
│  │  2. Burger Classic   23% │  │  │    │ Карта     38%    │           │
│  │  3. Caesar Salad     12% │  │  │    │ Payme     10%    │           │
│  │  4. Pasta Carbonara   8% │  │  └────┘ Click      6%    │           │
│  │  5. Lemonade          5% │  │                          │           │
│  └──────────────────────────┘  └──────────────────────────┘           │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### State Management

```typescript
// Component state
const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(PeriodType.TODAY)
const [customRange, setCustomRange] = useState<{ start?: string; end?: string }>({})
const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined)
const [isEditMode, setIsEditMode] = useState(false)

// Derived state
const periodInput = useMemo<IPeriodInput>(() => {
  if (selectedPeriod === PeriodType.CUSTOM && customRange.start && customRange.end) {
    return { type: PeriodType.CUSTOM, customStart: customRange.start, customEnd: customRange.end }
  }
  return { type: selectedPeriod }
}, [selectedPeriod, customRange])

// Dashboard config from backend
const { data: dashboardConfig } = useDashboardConfig()
const config = dashboardConfig ?? getDefaultDashboardConfig()
const canCustomize = useCanCustomizeDashboard()
```

### Default Configuration

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
    chartType: 'area',
    chartGroupBy: null,  // Auto-detect based on period
    widgets: [
      { id: 'w1', type: 'TOP_PRODUCTS', position: 0, config: null },
      { id: 'w2', type: 'PAYMENT_METHODS', position: 1, config: null },
    ],
  }
}
```

---

## Edit Mode

### UI Layout - Tabbed Interface

The edit mode uses a **3-tab interface** with visual previews:

```
┌────────────────────────────────────────────────────────────────────────┐
│  🎛️ Настройка дашборда                                                 │
│     Визуальный редактор с превью                   [Отмена] [Сохранить]│
├────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┬─────────────────┬─────────────────┐               │
│  │ ✨ KPI карточки │ 📊 Осн. график  │ ⚙️ Виджеты      │               │
│  └─────────────────┴─────────────────┴─────────────────┘               │
│                                                                         │
│  [Tab Content - see below for each tab]                                │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### Tab 1: KPI Cards

**Active KPIs Section** - Sortable grid with drag-and-drop:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Активные KPI карточки                                              │
│  Перетащите для изменения порядка                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ [X]              │  │ [X]              │  │ [X]              │   │
│  │ ⠿ ₽ Выручка      │  │ ⠿ 🛒 Заказы      │  │ ⠿ 🧾 Ср. чек     │   │
│  │   1,234,567      │  │     1,234,567    │  │     1,234,567    │   │
│  │   ▲ +12.5%       │  │     ▲ +12.5%     │  │     ▲ +12.5%     │   │
│  │   ~sparkline~    │  │   ~sparkline~    │  │   ~sparkline~    │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

**Available KPIs Section** - Click to add:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Добавить KPI                                                        │
│  Выберите показатели для отображения                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │ 👤 Клиенты  │ │ 👥 Постоянные│ │ 💰 Чаевые   │ │ ↩️ Возвраты  │   │
│  │ ~sparkline~ │ │ ~sparkline~ │ │ ~sparkline~ │ │ ~sparkline~ │    │
│  │  1,234,567  │ │  1,234,567  │ │  1,234,567  │ │  1,234,567  │    │
│  │  ▲ +12.5%   │ │  ▲ +12.5%   │ │  ▲ +12.5%   │ │  ▲ +12.5%   │    │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Tab 2: Main Chart

**Chart Type Selector** - Visual buttons with live previews:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Выберите тип графика                                                │
│  Нажмите для выбора визуализации                                     │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐│
│  │  ~area~   │ │  ~bar~    │ │  ~line~   │ │  ~radial~ │ │ ~radar~ ││
│  │  preview  │ │  preview  │ │  preview  │ │  preview  │ │ preview ││
│  │           │ │           │ │           │ │           │ │         ││
│  │  Область  │ │  Столбцы  │ │  Линия    │ │ Радиальный│ │  Радар  ││
│  │  [selected]│ │           │ │           │ │           │ │         ││
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └─────────┘│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Предпросмотр графика                                                │
│  Так будет выглядеть ваш основной график                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │        ╱╲                    [Large Chart Preview]               ││
│  │       ╱  ╲        ╱╲                                             ││
│  │      ╱    ╲______╱  ╲______                                      ││
│  │  ___╱                      ╲____                                 ││
│  │                                                                  ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Метрика для графика                                                 │
│  Выберите показатель для отображения на графике                      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────┐                               │
│  │  Выручка                      ▾  │                               │
│  └──────────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

### Tab 3: Widgets

**Active Widgets** - Sortable grid with large previews:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Активные виджеты                                                    │
│  Перетащите для изменения порядка                                    │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │  [⠿] [X]  Топ продукты     │  │  [⠿] [X]  Способы оплаты    │   │
│  │  Лучшие товары по выручке  │  │  Распределение по типам     │   │
│  ├─────────────────────────────┤  ├─────────────────────────────┤   │
│  │                             │  │                             │   │
│  │   [Large Widget Preview]   │  │   [Large Widget Preview]    │   │
│  │   ~chart/list preview~     │  │   ~pie chart preview~       │   │
│  │                             │  │                             │   │
│  └─────────────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

**Widget Gallery** - Categorized with visual previews:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Галерея виджетов                                                    │
│  Выберите виджеты с визуальным превью                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ГРАФИКИ И ДИАГРАММЫ                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ ~preview~  │ │ ~preview~  │ │ ~preview~  │ │ ~preview~  │        │
│  │ Обзор      │ │ Сводка     │ │ Доходы/    │ │ Дневное    │        │
│  │ дохода     │ │ транзакций │ │ Расходы    │ │ сравнение  │        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│                                                                      │
│  АНАЛИТИКА                                                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ ~preview~  │ │ ~preview~  │ │ ~preview~  │ │ ~preview~  │        │
│  │ Эффектив-  │ │ Воронка    │ │ Прогресс   │ │ По часам   │        │
│  │ ность      │ │ конверсии  │ │ целей      │ │            │        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│                                                                      │
│  ДАННЫЕ                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ ~preview~  │ │ ~preview~  │ │ ~preview~  │ │ ~preview~  │        │
│  │ Топ        │ │ Способы    │ │ Каналы     │ │ Рейтинг    │        │
│  │ продукты   │ │ оплаты     │ │ продаж     │ │ сотрудников│        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Widget Categories and Types

```typescript
const WIDGET_TYPE_OPTIONS = [
  // CHARTS CATEGORY
  { value: 'REVENUE_OVERVIEW',     label: 'Обзор дохода',        description: 'График с суммарной статистикой',   category: 'charts',    preview: 'area' },
  { value: 'TRANSACTIONS_SUMMARY', label: 'Сводка транзакций',   description: 'Анализ транзакций',                category: 'charts',    preview: 'bar' },
  { value: 'INCOME_EXPENSE',       label: 'Доходы и расходы',    description: 'Финансовый отчет',                 category: 'charts',    preview: 'bar' },
  { value: 'DAILY_COMPARISON',     label: 'Дневное сравнение',   description: 'Сравнение с предыдущим днем',      category: 'charts',    preview: 'line' },
  { value: 'CUSTOMER_RATINGS',     label: 'Рейтинг клиентов',    description: 'Звездный рейтинг с графиком',      category: 'charts',    preview: 'line' },

  // ANALYTICS CATEGORY
  { value: 'PERFORMANCE_RADAR',    label: 'Эффективность',       description: 'Radar-анализ показателей',         category: 'analytics', preview: 'radar' },
  { value: 'CONVERSION_FUNNEL',    label: 'Конверсионная воронка', description: 'Воронка продаж',                 category: 'analytics', preview: 'funnel' },
  { value: 'GOAL_RADIAL',          label: 'Прогресс целей',      description: 'Радиальный прогресс',              category: 'analytics', preview: 'donut' },
  { value: 'HOURLY_BREAKDOWN',     label: 'По часам',            description: 'Тепловая карта',                   category: 'analytics', preview: 'heatmap' },
  { value: 'GOAL_PROGRESS',        label: 'Цели',                description: 'Прогресс по целям',                category: 'analytics', preview: 'donut' },

  // DATA CATEGORY
  { value: 'TOP_PRODUCTS',         label: 'Топ продукты',        description: 'Лучшие товары по выручке',         category: 'data',      preview: 'list' },
  { value: 'PAYMENT_METHODS',      label: 'Способы оплаты',      description: 'Распределение по типам',           category: 'data',      preview: 'pie' },
  { value: 'CHANNEL_SPLIT',        label: 'Каналы продаж',       description: 'Доставка, зал, самовывоз',         category: 'data',      preview: 'donut' },
  { value: 'STAFF_RANKING',        label: 'Рейтинг сотрудников', description: 'Топ сотрудников',                  category: 'data',      preview: 'list' },
  { value: 'ORDERS_BY_CATEGORY',   label: 'Заказы по категориям', description: 'Пончиковая диаграмма',            category: 'data',      preview: 'donut' },
  { value: 'VISITORS_TRAFFIC',     label: 'Трафик посетителей',  description: 'Разбивка по устройствам',          category: 'data',      preview: 'bar' },

  // INSIGHTS CATEGORY
  { value: 'ANOMALY_DETECTION',    label: 'Обнаружение аномалий', description: 'Выявление отклонений',            category: 'insights',  preview: 'bar' },
  { value: 'SALES_METRICS',        label: 'Метрики продаж',      description: 'Комплексная аналитика',            category: 'insights',  preview: 'donut' },
]
```

---

## KPI Cards

### Visual Design

Each KPI card contains:
1. **Icon** with colored background (matches KPI type)
2. **Label** (KPI name in Russian)
3. **Value** (formatted number, large font)
4. **Change indicator** (trend icon + percentage)
5. **Mini sparkline chart** (last 8 data points)

### Card Dimensions

```css
/* Card container */
.kpi-card {
  @apply rounded-xl border bg-card p-4 shadow-sm;
}

/* Grid layout */
.kpi-grid {
  @apply grid gap-4 sm:grid-cols-2 lg:grid-cols-4;
}
```

### Sparkline Chart

Mini area chart showing trend:
- Height: 48px (h-12)
- Width: 80px (w-20)
- Gradient fill matching KPI color
- No axis labels, dots, or grid

---

## Main Chart

### Chart Types

| Type | Description | Use Case |
|------|-------------|----------|
| `area` | Filled area chart with gradient | Revenue, totals over time |
| `bar` | Vertical bar chart | Comparing discrete periods |
| `line` | Simple line chart | Trends, comparisons |
| `radial` | Donut/pie chart | Proportions |
| `radar` | Spider/radar chart | Multi-dimensional comparison |

### Chart Configuration

```typescript
// Primary brand color for all charts
const PRIMARY_COLOR = '#fe4a49'

// Gradient for area charts
<linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#fe4a49" stopOpacity={1} />
  <stop offset="95%" stopColor="#fe4a49" stopOpacity={0.1} />
</linearGradient>
```

### Chart Card Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Выручка                                                             │
│  12,500,000 сум                                          ▲ +11.6%   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Chart Area - 300px height]                                         │
│                                                                      │
│  Mon     Tue     Wed     Thu     Fri     Sat     Sun                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Widgets

### Widget Size Categories

```typescript
const WIDGET_CONFIG = {
  // Wide widgets (full width)
  'REVENUE_OVERVIEW':     { size: 'wide' },
  'TRANSACTIONS_SUMMARY': { size: 'wide' },
  'INCOME_EXPENSE':       { size: 'wide' },
  'SALES_METRICS':        { size: 'wide' },

  // Normal widgets (half width on md+)
  'TOP_PRODUCTS':         { size: 'normal' },
  'PAYMENT_METHODS':      { size: 'normal' },
  // ... all others default to 'normal'
}
```

### Widget Layout

```css
/* Wide widgets - full width */
.widget-wide {
  @apply w-full;
}

/* Normal widgets - 2-column grid on md+ */
.widgets-grid {
  @apply grid gap-4 md:grid-cols-2;
}
```

### Widget Card Structure

```typescript
interface WidgetCardProps {
  title: string
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
  contentClassName?: string
  children: React.ReactNode
}
```

---

## GraphQL API

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
    chartType      # NEW FIELD
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

### Save Dashboard Config Mutation

```graphql
mutation SaveDashboardConfig($config: DashboardConfigInput!) {
  saveDashboardConfig(config: $config) {
    success
  }
}

# Variables:
{
  "config": {
    "kpiSlots": [
      { "position": 0, "type": "REVENUE", "visible": true },
      { "position": 1, "type": "ORDERS", "visible": true }
    ],
    "chartMetric": "REVENUE",
    "chartType": "area",
    "chartGroupBy": null,
    "widgets": [
      { "id": "w1", "type": "TOP_PRODUCTS", "position": 0 },
      { "id": "w2", "type": "PAYMENT_METHODS", "position": 1 }
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

**Ranked List (for TOP_PRODUCTS, STAFF_RANKING):**
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

**Proportions (for PAYMENT_METHODS, CHANNEL_SPLIT):**
```graphql
query Proportions($dimension: Dimension!, $period: PeriodInput!, $branchId: Int) {
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

### Dimension Enum Values

```graphql
enum Dimension {
  PAYMENT_METHOD
  CHANNEL
}
```

**Note:** The `proportions` query uses `Dimension` enum, not string:
```typescript
// CORRECT
useProportions({ dimension: 'PAYMENT_METHOD', period, branchId })

// Query sends:
{ "dimension": "PAYMENT_METHOD" }  # Enum value, not "PAYMENT_METHOD" string
```

---

## Drag and Drop

### Implementation with @dnd-kit

The edit mode uses `@dnd-kit` for drag-and-drop with these key patterns:

### Required Imports

```typescript
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,  // For grid layouts
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
```

### Sensor Configuration

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
)
```

### Sortable Item Pattern

```typescript
function SortableItem({ item, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  // IMPORTANT: Disable transition while dragging to prevent snap-back
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('...base-styles', isDragging && 'opacity-0')}  // Hide original when dragging
    >
      {/* Item content */}
      <button {...attributes} {...listeners}>
        <IconGripVertical />
      </button>
    </div>
  )
}
```

### DragOverlay Pattern

```typescript
// Track active item
const [activeId, setActiveId] = useState<string | null>(null)
const activeItem = activeId ? items.find(i => i.id === activeId) : null

// Handlers
const handleDragStart = (event: DragStartEvent) => {
  setActiveId(event.active.id as string)
}

const handleDragEnd = (event: DragEndEvent) => {
  setActiveId(null)
  const { active, over } = event
  if (over && active.id !== over.id) {
    setItems(items => {
      const oldIndex = items.findIndex(i => i.id === active.id)
      const newIndex = items.findIndex(i => i.id === over.id)
      return arrayMove(items, oldIndex, newIndex).map((item, idx) => ({ ...item, position: idx }))
    })
  }
}

// JSX
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
  <SortableContext items={itemIds} strategy={rectSortingStrategy}>
    {items.map(item => <SortableItem key={item.id} item={item} />)}
  </SortableContext>
  <DragOverlay>
    {activeItem && <ItemOverlay item={activeItem} />}  {/* Separate visual component */}
  </DragOverlay>
</DndContext>
```

### Key Rules

1. **Use `rectSortingStrategy`** for grid layouts (not `horizontalListSortingStrategy`)
2. **Use stable IDs** - For KPIs, use `slot.type` as ID (not position-based)
3. **Hide original when dragging** - `isDragging && 'opacity-0'`
4. **Disable transition during drag** - `transition: isDragging ? undefined : transition`
5. **Use DragOverlay** - Renders a separate visual that follows cursor

---

## Subscription & Entitlements

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

### Access Control

| Entitlement | Description | Required Plan |
|-------------|-------------|---------------|
| `analytics_basic` | View default dashboard | BASIC+ |
| `analytics_pro` | Advanced analytics pages | PRO+ |
| `analytics_full` | Full analytics + forecasting | ULTRA |
| `dashboard_custom` | Edit/customize dashboard | PRO+ |

### UI Behavior

```typescript
const canCustomize = useCanCustomizeDashboard()

// Edit button
{canCustomize ? (
  <Button onClick={handleEnterEditMode}>
    <IconPencil /> Редактировать
  </Button>
) : (
  <Button variant="ghost" disabled>
    <IconCrown /> Upgrade to edit
  </Button>
)}
```

---

## Period Types

```typescript
enum PeriodType {
  TODAY = 'TODAY'
  YESTERDAY = 'YESTERDAY'
  THIS_WEEK = 'THIS_WEEK'
  LAST_WEEK = 'LAST_WEEK'
  THIS_MONTH = 'THIS_MONTH'
  LAST_MONTH = 'LAST_MONTH'
  LAST_7_DAYS = 'LAST_7_DAYS'
  LAST_30_DAYS = 'LAST_30_DAYS'
  LAST_90_DAYS = 'LAST_90_DAYS'
  THIS_QUARTER = 'THIS_QUARTER'
  LAST_QUARTER = 'LAST_QUARTER'
  THIS_YEAR = 'THIS_YEAR'
  LAST_YEAR = 'LAST_YEAR'
  CUSTOM = 'CUSTOM'
}
```

---

## Error Handling

### Error States

1. **Network Error** - Show error banner with retry button
2. **No Data** - Show "Нет данных" in chart area
3. **Partial Load** - Individual widget error states with retry

### Error UI

```tsx
{hasError && (
  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
    <p className="text-sm text-destructive">
      Не удалось загрузить данные. Проверьте подключение к интернету.
    </p>
  </div>
)}
```

---

## FAQ

**Q: Maximum KPI slots?**
A: 6 slots (positions 0-5). Default is 4.

**Q: What if `dashboardConfig` returns null?**
A: Use `getDefaultDashboardConfig()` which provides 4 KPIs and 2 widgets.

**Q: How is chart grouping determined when `chartGroupBy` is null?**
A: Backend auto-selects based on period:
- TODAY → HOUR
- THIS_WEEK → DAY
- THIS_MONTH → DAY
- THIS_YEAR → MONTH

**Q: Can widgets be duplicated?**
A: No, each widget type can only appear once. The gallery disables already-added widgets.

**Q: Are enum values case-sensitive?**
A: YES. Always use UPPERCASE: `"REVENUE"` not `"revenue"`.

**Q: What happens when user downgrades from PRO to BASIC?**
A: Custom config is preserved but editing is disabled. Dashboard shows default view until they upgrade again.

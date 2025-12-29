# 23. Analytics & Reporting System (GraphQL API)

## Overview

Комплексная система аналитики и отчётности для бизнеса. Включает дашборды, финансовые отчёты, когортный анализ клиентов, сравнение филиалов, экспорт данных, алерты и систему целей.

**API**: GraphQL (не REST)  
**Endpoint**: `/graphql`  
**Authentication**: JWT Bearer Token (все запросы требуют авторизации)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GraphQL Analytics Resolver                   │
│                    AnalyticsResolver                             │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐    ┌───────────────────┐    ┌────────────────┐
│   Snapshot    │    │   Extended        │    │   Customer     │
│   Service     │    │   Analytics       │    │   Analytics    │
│               │    │   Service         │    │   Service      │
└───────────────┘    └───────────────────┘    └────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐    ┌───────────────────┐    ┌────────────────┐
│   Branch      │    │   Financial       │    │   Goals        │
│   Analytics   │    │   Analytics       │    │   Service      │
│   Service     │    │   Service         │    │                │
└───────────────┘    └───────────────────┘    └────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Analytics Entities                           │
│  AnDailyStat │ AnHourlyStat │ AnProductStat │ AnStaffStat       │
└─────────────────────────────────────────────────────────────────┘
```

---

## GraphQL Schema Overview

### Query Categories

| Category         | Queries                                                                                                                                        | Description                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **KPI**          | `kpiMetric`, `kpiMetrics`                                                                                                                      | Ключевые показатели с сравнением |
| **Time Series**  | `timeSeries`                                                                                                                                   | Данные для графиков              |
| **Ranked Lists** | `rankedList`                                                                                                                                   | Топ продуктов, персонала и т.д.  |
| **Proportions**  | `proportions`                                                                                                                                  | Данные для круговых диаграмм     |
| **Extended**     | `heatmap`, `categoryAnalytics`, `productAnalytics`, `paymentMethodsAnalytics`, `channelsAnalytics`, `deliveryTypesAnalytics`, `staffAnalytics` | Расширенная аналитика            |
| **Customers**    | `customerOverview`, `cohortAnalysis`, `rfmAnalysis`, `ltvAnalysis`                                                                             | Аналитика клиентов               |
| **Branches**     | `branchComparison`, `branchBenchmark`, `branchTrends`, `yoyComparison`                                                                         | Аналитика филиалов               |
| **Financial**    | `financialSummary`, `profitLoss`, `marginAnalysis`, `cashFlow`, `revenueBreakdown`                                                             | Финансовая аналитика             |
| **Alerts**       | `alerts`, `alertSummary`, `alertThresholds`, `detectAnomalies`                                                                                 | Алерты и аномалии                |
| **Goals**        | `goals`, `goalsSummary`, `goalDetails`, `goalPresets`                                                                                          | Цели и KPI                       |
| **Views**        | `views`, `view`, `dashboardConfig`                                                                                                             | Сохранённые представления        |
| **Export**       | `exportReport`                                                                                                                                 | Экспорт отчётов                  |

### Mutations

| Mutation              | Description                         |
| --------------------- | ----------------------------------- |
| `createGoal`          | Создание новой цели                 |
| `createView`          | Создание сохранённого представления |
| `updateView`          | Обновление представления            |
| `deleteView`          | Удаление представления              |
| `saveDashboardConfig` | Сохранение конфигурации дашборда    |

---

## Enums Reference

### PeriodType

```graphql
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
  THIS_QUARTER
  LAST_QUARTER
  THIS_YEAR
  LAST_YEAR
  CUSTOM # Требует customStart и customEnd
}
```

### KpiType

```graphql
enum KpiType {
  REVENUE
  ORDERS
  AVG_CHECK
  CUSTOMERS
  NEW_CUSTOMERS
  RETURNING_CUSTOMERS
  TIPS
  REFUNDS
  CANCELLATIONS
  MARGIN # Premium only
  RETENTION_RATE
  STAFF_PRODUCTIVITY
}
```

### Dataset

```graphql
enum Dataset {
  ORDERS
  PRODUCTS
  CATEGORIES
  STAFF
  CHANNELS
  PAYMENT_METHODS
  DELIVERY_TYPES
  CUSTOMERS
  BRANCHES
}
```

### GroupBy

```graphql
enum GroupBy {
  HOUR
  DAY
  WEEK
  MONTH
  QUARTER
  YEAR
}
```

### SortBy / SortDirection

```graphql
enum SortBy {
  REVENUE
  ORDERS
  QUANTITY
  PERCENTAGE
  AVG_CHECK
  CUSTOMERS
  GROWTH
}

enum SortDirection {
  ASC
  DESC
}
```

### GoalType / GoalPeriod / GoalStatus

```graphql
enum GoalType {
  REVENUE
  ORDERS
  AVG_CHECK
  CUSTOMERS
  NEW_CUSTOMERS
  RETENTION_RATE
  MARGIN
  TIPS
  STAFF_PRODUCTIVITY
}

enum GoalPeriod {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
}

enum GoalStatus {
  NOT_STARTED
  IN_PROGRESS
  AT_RISK
  ON_TRACK
  ACHIEVED
  MISSED
}
```

### AlertType / AlertSeverity / AlertStatus

```graphql
enum AlertType {
  REVENUE_DROP
  HIGH_REFUNDS
  LOW_INVENTORY
  STAFF_PERFORMANCE
  CUSTOMER_CHURN
  ANOMALY_DETECTED
  GOAL_AT_RISK
}

enum AlertSeverity {
  CRITICAL
  WARNING
  INFO
}

enum AlertStatus {
  ACTIVE
  ACKNOWLEDGED
  RESOLVED
}
```

### RfmSegment

```graphql
enum RfmSegment {
  CHAMPIONS # Лучшие клиенты
  LOYAL # Лояльные
  POTENTIAL_LOYALIST # Потенциально лояльные
  NEW_CUSTOMERS # Новые клиенты
  PROMISING # Перспективные
  NEED_ATTENTION # Требуют внимания
  ABOUT_TO_SLEEP # Засыпающие
  AT_RISK # В зоне риска
  CANT_LOSE # Нельзя терять
  HIBERNATING # В спячке
  LOST # Потерянные
}
```

### ExportFormat / ReportType

```graphql
enum ExportFormat {
  CSV
  XLSX
  PDF
}

enum ReportType {
  DASHBOARD
  PRODUCTS
  CATEGORIES
  CUSTOMERS
  STAFF
  FINANCIAL
  BRANCHES
}
```

### WidgetType

```graphql
enum WidgetType {
  TOP_PRODUCTS
  RECENT_ORDERS
  PAYMENT_METHODS
  CHANNEL_SPLIT
  STAFF_RANKING
  HOURLY_BREAKDOWN
  CUSTOMER_SEGMENTS
  BRANCH_COMPARISON
  GOAL_PROGRESS
  ALERTS
}
```

---

## Input Types

### PeriodInput

```graphql
input PeriodInput {
  type: PeriodType!
  customStart: String # Format: "YYYY-MM-DD", required if type is CUSTOM
  customEnd: String # Format: "YYYY-MM-DD", required if type is CUSTOM
}
```

### CreateGoalInput

```graphql
input CreateGoalInput {
  name: String!
  type: GoalType!
  period: GoalPeriod!
  targetValue: Float!
  startDate: String! # YYYY-MM-DD
  endDate: String! # YYYY-MM-DD
  branchId: Int
  description: String
  isActive: Boolean = true
}
```

### CreateViewInput / UpdateViewInput

```graphql
input CreateViewInput {
  pageCode: String!
  name: String!
  config: ViewConfigInput!
  isPinned: Boolean = false
}

input UpdateViewInput {
  name: String
  config: ViewConfigInput
  isPinned: Boolean
  isShared: Boolean
}

input ViewConfigInput {
  timeframe: PeriodInput!
  filters: String # JSON string of filters
  columns: [String]
  groupBy: GroupBy
  sorting: SortingInput
  display: String
}
```

### DashboardConfigInput

```graphql
input DashboardConfigInput {
  kpiSlots: [KpiSlotInput!]!
  chartMetric: String = "REVENUE"
  chartGroupBy: GroupBy
  widgets: [WidgetConfigInput!]!
}

input KpiSlotInput {
  position: Int! # 0-5
  type: KpiType!
  visible: Boolean = true
}

input WidgetConfigInput {
  id: String!
  type: WidgetType!
  position: Int!
  config: String # JSON string of widget-specific config
}
```

---

## Output Types

### KpiMetric

```graphql
type KpiMetric {
  value: Float!
  previousValue: Float
  changePercent: Float
  trend: Trend # UP, DOWN, NEUTRAL
  formattedValue: String
  periodLabel: String
  comparisonLabel: String
}
```

### TimeSeries

```graphql
type TimeSeries {
  metric: String!
  groupBy: GroupBy!
  totalValue: Float!
  changePercent: Float
  points: [TimeSeriesPoint!]!
}

type TimeSeriesPoint {
  timestamp: String!
  value: Float!
  label: String
  isHighlighted: Boolean
}
```

### RankedItem

```graphql
type RankedItem {
  rank: Int!
  id: Int!
  name: String!
  value: Float!
  formattedValue: String
  percentage: Float!
  secondaryValue: Float
  secondaryLabel: String
  color: String
}
```

### Proportions

```graphql
type Proportions {
  total: Float!
  formattedTotal: String
  segments: [ProportionSegment!]!
}

type ProportionSegment {
  key: String!
  label: String!
  value: Float!
  percentage: Float!
  color: String
}
```

### View

```graphql
type View {
  id: ID!
  name: String!
  pageCode: String!
  isDefault: Boolean!
  isPinned: Boolean!
  isShared: Boolean!
  config: ViewConfigOutput!
  createdAt: String!
  updatedAt: String
}
```

### DashboardConfig

```graphql
type DashboardConfig {
  kpiSlots: [KpiSlotOutput!]!
  chartMetric: String!
  chartGroupBy: GroupBy
  widgets: [WidgetConfigOutput!]!
}
```

---

## 1. KPI Queries

### kpiMetric

Получение одного KPI с сравнением с предыдущим периодом.

```graphql
query KpiMetric($type: KpiType!, $period: PeriodInput!, $branchId: Int) {
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

```json
{
  "type": "REVENUE",
  "period": { "type": "TODAY" },
  "branchId": 1
}
```

**Response:**

```json
{
  "data": {
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
}
```

### kpiMetrics

Получение нескольких KPI одним запросом.

```graphql
query KpiMetrics($types: [KpiType!]!, $period: PeriodInput!, $branchId: Int) {
  kpiMetrics(types: $types, period: $period, branchId: $branchId) {
    value
    previousValue
    changePercent
    trend
    formattedValue
  }
}
```

**Variables:**

```json
{
  "types": ["REVENUE", "ORDERS", "AVG_CHECK", "NEW_CUSTOMERS"],
  "period": { "type": "THIS_MONTH" }
}
```

---

## 2. Time Series Query

### timeSeries

Получение данных для построения графиков.

```graphql
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

```json
{
  "metric": "REVENUE",
  "period": { "type": "THIS_WEEK" },
  "groupBy": "DAY"
}
```

**Response:**

```json
{
  "data": {
    "timeSeries": {
      "metric": "REVENUE",
      "groupBy": "DAY",
      "totalValue": 45000000,
      "changePercent": 12.5,
      "points": [
        {
          "timestamp": "2025-12-09T00:00:00Z",
          "value": 5800000,
          "label": "Mon",
          "isHighlighted": false
        },
        {
          "timestamp": "2025-12-10T00:00:00Z",
          "value": 7200000,
          "label": "Tue",
          "isHighlighted": false
        },
        {
          "timestamp": "2025-12-11T00:00:00Z",
          "value": 8100000,
          "label": "Wed",
          "isHighlighted": true
        }
      ]
    }
  }
}
```

---

## 3. Ranked List Query

### rankedList

Получение отсортированного списка (топ продуктов, персонала и т.д.).

```graphql
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

```json
{
  "dataset": "PRODUCTS",
  "period": { "type": "LAST_7_DAYS" },
  "sortBy": "REVENUE",
  "sortDirection": "DESC",
  "limit": 10
}
```

---

## 4. Proportions Query

### proportions

Получение данных для круговых/кольцевых диаграмм.

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

**Variables:**

```json
{
  "dimension": "PAYMENT_METHOD",
  "period": { "type": "TODAY" }
}
```

**Response:**

```json
{
  "data": {
    "proportions": {
      "total": 12500000,
      "formattedTotal": "12,500,000",
      "segments": [
        {
          "key": "CASH",
          "label": "Cash",
          "value": 5750000,
          "percentage": 46.0,
          "color": "#FF6B6B"
        },
        {
          "key": "CARD",
          "label": "Card",
          "value": 4750000,
          "percentage": 38.0,
          "color": "#4ECDC4"
        },
        {
          "key": "PAYME",
          "label": "Payme",
          "value": 1250000,
          "percentage": 10.0,
          "color": "#45B7D1"
        }
      ]
    }
  }
}
```

---

## 5. Extended Analytics Queries

Все extended analytics queries возвращают типизированные ответы. Только `alerts` и `goals` возвращают `GraphQLJSON`.

### heatmap

Тепловая карта активности по часам и дням недели (PRO feature).

```graphql
query Heatmap(
  $period: PeriodInput!
  $metric: String # "orders" | "revenue", default: "orders"
  $branchId: Int
) {
  heatmap(period: $period, metric: $metric, branchId: $branchId) {
    scope
    period { type startDate endDate label compareTo { startDate endDate } }
    metric
    maxValue
    minValue
    peakHour
    peakDay
    cells {
      dayOfWeek
      hour
      value
      intensity
    }
  }
}
```

### categoryAnalytics

Аналитика по категориям меню с ABC-классификацией.

```graphql
query CategoryAnalytics($period: PeriodInput!, $branchId: Int) {
  categoryAnalytics(period: $period, branchId: $branchId) {
    scope
    period { type startDate endDate label compareTo { startDate endDate } }
    summary {
      totalCategories
      totalRevenue
      totalOrders
      revenueChange { percent trend absolute }
    }
    categories {
      categoryId
      name
      revenue
      orders
      quantity
      avgCheck
      revenueShare
      ordersShare
      revenueChange { percent trend absolute }
      productCount
      abcClass
    }
  }
}
```

### productAnalytics

Детальная аналитика по продуктам с ABC-классификацией и пагинацией.

```graphql
query ProductAnalytics(
  $period: PeriodInput!
  $branchId: Int
  $offset: Int
  $limit: Int
) {
  productAnalytics(
    period: $period
    branchId: $branchId
    offset: $offset
    limit: $limit
  ) {
    scope
    period { type startDate endDate label compareTo { startDate endDate } }
    summary {
      totalProducts
      uniqueProducts
      totalRevenue
      totalOrders
      totalQuantity
      avgPrice
      revenueChange { percent trend absolute }
      changes { revenue quantity products avgPrice }
    }
    products {
      id
      productId
      name
      categoryId
      categoryName
      revenue
      orders
      quantity
      avgPrice
      revenueShare
      share
      revenueChange { percent trend absolute }
      change { percent trend absolute }
      trend
      rank
      abcClass
    }
    pagination { total offset limit }
  }
}
```

### paymentMethodsAnalytics

Аналитика по способам оплаты.

```graphql
query PaymentMethodsAnalytics($period: PeriodInput!, $branchId: Int) {
  paymentMethodsAnalytics(period: $period, branchId: $branchId) {
    scope
    period { type startDate endDate label compareTo { startDate endDate } }
    summary {
      totalAmount
      totalTransactions
      changes { total cash card online }
    }
    methods {
      method
      label
      amount
      transactions
      share
      avgAmount
      color
      change { percent trend absolute }
    }
  }
}
```

### channelsAnalytics

Аналитика по каналам продаж (PRO feature).

```graphql
query ChannelsAnalytics($period: PeriodInput!, $branchId: Int) {
  channelsAnalytics(period: $period, branchId: $branchId) {
    scope
    period { type startDate endDate label compareTo { startDate endDate } }
    totalOrders
    totalRevenue
    channels {
      channel
      label
      orders
      revenue
      ordersShare
      revenueShare
      avgCheck
      color
      ordersChange { percent trend absolute }
    }
  }
}
```

### deliveryTypesAnalytics

Аналитика по типам доставки/обслуживания.

```graphql
query DeliveryTypesAnalytics($period: PeriodInput!, $branchId: Int) {
  deliveryTypesAnalytics(period: $period, branchId: $branchId) {
    scope
    period { type startDate endDate label compareTo { startDate endDate } }
    totalOrders
    totalRevenue
    deliveryTypes {
      type
      label
      orders
      revenue
      ordersShare
      revenueShare
      avgCheck
      color
      ordersChange { percent trend absolute }
    }
  }
}
```

### staffAnalytics

Аналитика производительности персонала (PRO feature).

```graphql
query StaffAnalytics($period: PeriodInput!, $branchId: Int) {
  staffAnalytics(period: $period, branchId: $branchId) {
    scope
    period { type startDate endDate label compareTo { startDate endDate } }
    summary {
      totalStaff
      totalRevenue
      totalOrders
      totalTips
      avgRevenuePerStaff
    }
    staff {
      employeeId
      name
      roleCode
      revenue
      orders
      avgCheck
      tips
      refunds
      voids
      revenueShare
      rank
      revenueChange { percent trend absolute }
    }
  }
}
```

---

## 6. Customer Analytics Queries

### customerOverview

Общая аналитика по клиентам.

```graphql
query CustomerOverview($period: PeriodInput!, $branchId: Int) {
  customerOverview(period: $period, branchId: $branchId)
}
```

**Response structure:**

```typescript
{
  summary: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    churnedCustomers: number;
  }
  metrics: {
    activeRate: number;
    retentionRate: number;
    churnRate: number;
    avgOrdersPerCustomer: number;
    avgRevenuePerCustomer: number;
  }
  segments: Array<{
    segment: string;
    segmentLabel: string;
    count: number;
    share: number;
    revenue: number;
  }>;
}
```

### cohortAnalysis

Когортный анализ удержания клиентов.

```graphql
query CohortAnalysis($months: Int = 6, $branchId: Int) {
  cohortAnalysis(months: $months, branchId: $branchId)
}
```

**Response structure:**

```typescript
{
  cohorts: Array<{
    cohortDate: string;
    cohortLabel: string;
    initialSize: number;
    retention: Array<{
      period: number;
      activeCount: number;
      retentionRate: number;
      revenue: number;
    }>;
  }>;
  avgRetention: {
    period1: number;
    period3: number;
    period6: number;
  }
}
```

### rfmAnalysis

RFM-сегментация клиентов (Recency, Frequency, Monetary).

```graphql
query RfmAnalysis($lookbackDays: Int = 365, $branchId: Int) {
  rfmAnalysis(lookbackDays: $lookbackDays, branchId: $branchId)
}
```

**Response structure:**

```typescript
{
  segments: Array<{
    segment: RfmSegment;
    segmentLabel: string;
    description: string;
    count: number;
    share: number;
    avgRecency: number;
    avgFrequency: number;
    avgMonetary: number;
    recommendations: string[];
  }>;
  distribution: {
    r: number[];
    f: number[];
    m: number[];
  };
}
```

### ltvAnalysis

Анализ пожизненной ценности клиента.

```graphql
query LtvAnalysis($projectionMonths: Int = 12, $branchId: Int) {
  ltvAnalysis(projectionMonths: $projectionMonths, branchId: $branchId)
}
```

---

## 7. Branch Analytics Queries

### branchComparison

Сравнение показателей филиалов.

```graphql
query BranchComparison($period: PeriodInput!, $sortBy: String = "revenue") {
  branchComparison(period: $period, sortBy: $sortBy)
}
```

### branchBenchmark

Бенчмаркинг филиалов относительно средних показателей.

```graphql
query BranchBenchmark($period: PeriodInput!) {
  branchBenchmark(period: $period)
}
```

### branchTrends

Динамика показателей филиалов во времени.

```graphql
query BranchTrends($period: PeriodInput!) {
  branchTrends(period: $period)
}
```

### yoyComparison

Сравнение год к году.

```graphql
query YoYComparison($metric: String = "revenue") {
  yoyComparison(metric: $metric)
}
```

---

## 8. Financial Analytics Queries

### financialSummary

Быстрая финансовая сводка.

```graphql
query FinancialSummary($branchId: Int) {
  financialSummary(branchId: $branchId)
}
```

### profitLoss

Отчёт о прибылях и убытках.

```graphql
query ProfitLoss(
  $period: PeriodInput!
  $branchId: Int
  $comparePreviousPeriod: Boolean = true
) {
  profitLoss(
    period: $period
    branchId: $branchId
    comparePreviousPeriod: $comparePreviousPeriod
  )
}
```

### marginAnalysis

Анализ маржинальности.

```graphql
query MarginAnalysis(
  $period: PeriodInput!
  $branchId: Int
  $categoryIds: [Int]
  $productIds: [Int]
  $marginThreshold: Float
) {
  marginAnalysis(
    period: $period
    branchId: $branchId
    categoryIds: $categoryIds
    productIds: $productIds
    marginThreshold: $marginThreshold
  )
}
```

### cashFlow

Анализ денежных потоков.

```graphql
query CashFlow($period: PeriodInput!, $branchId: Int) {
  cashFlow(period: $period, branchId: $branchId)
}
```

### revenueBreakdown

Структура выручки.

```graphql
query RevenueBreakdown(
  $period: PeriodInput!
  $groupBy: String = "category" # category | product | channel | delivery_type
  $topN: Int
  $branchId: Int
) {
  revenueBreakdown(
    period: $period
    groupBy: $groupBy
    topN: $topN
    branchId: $branchId
  )
}
```

---

## 9. Alerts Queries

### alerts

Получение активных алертов.

```graphql
query Alerts(
  $severity: String # CRITICAL | WARNING | INFO
  $status: String # ACTIVE | ACKNOWLEDGED | RESOLVED
  $type: String # AlertType enum value
  $branchId: Int
) {
  alerts(severity: $severity, status: $status, type: $type, branchId: $branchId)
}
```

### alertSummary

Сводка по алертам с показателем здоровья системы.

```graphql
query AlertSummary($branchId: Int) {
  alertSummary(branchId: $branchId)
}
```

**Response structure:**

```typescript
{
  healthScore: number; // 0-100
  healthStatus: 'healthy' | 'warning' | 'critical';
  activeAlerts: {
    critical: number;
    warning: number;
    info: number;
  }
  weeklyTrend: {
    alertsTriggered: number;
    alertsResolved: number;
    avgResolutionTime: number;
  }
}
```

### alertThresholds

Настройки порогов для алертов.

```graphql
query AlertThresholds {
  alertThresholds
}
```

### detectAnomalies

Детекция аномалий в данных.

```graphql
query DetectAnomalies(
  $startDate: String!
  $endDate: String!
  $sensitivity: Int = 3
  $branchId: Int
) {
  detectAnomalies(
    startDate: $startDate
    endDate: $endDate
    sensitivity: $sensitivity
    branchId: $branchId
  )
}
```

---

## 10. Goals Queries & Mutations

### goals

Список целей с прогрессом.

```graphql
query Goals(
  $type: String # GoalType enum value
  $period: String # GoalPeriod enum value
  $status: String # GoalStatus enum value
  $includeCompleted: Boolean = true
  $branchId: Int
) {
  goals(
    type: $type
    period: $period
    status: $status
    includeCompleted: $includeCompleted
    branchId: $branchId
  )
}
```

### goalsSummary

Сводка по целям.

```graphql
query GoalsSummary($branchId: Int) {
  goalsSummary(branchId: $branchId)
}
```

### goalDetails

Детали конкретной цели с трендом.

```graphql
query GoalDetails($id: String!, $branchId: Int) {
  goalDetails(id: $id, branchId: $branchId)
}
```

### goalPresets

Шаблоны целей для быстрого создания.

```graphql
query GoalPresets {
  goalPresets
}
```

### createGoal (Mutation)

Создание новой цели.

```graphql
mutation CreateGoal(
  $name: String!
  $type: String!
  $goalPeriod: String!
  $targetValue: Int!
  $startDate: String!
  $endDate: String!
  $branchId: Int
  $description: String
  $isActive: Boolean = true
) {
  createGoal(
    name: $name
    type: $type
    goalPeriod: $goalPeriod
    targetValue: $targetValue
    startDate: $startDate
    endDate: $endDate
    branchId: $branchId
    description: $description
    isActive: $isActive
  )
}
```

**Variables:**

```json
{
  "name": "Monthly Revenue Target",
  "type": "REVENUE",
  "goalPeriod": "MONTHLY",
  "targetValue": 50000000,
  "startDate": "2025-01-01",
  "endDate": "2025-01-31"
}
```

---

## 11. Export Query

### exportReport

Экспорт отчётов в различных форматах.

```graphql
query ExportReport(
  $reportType: String! # ReportType enum value
  $format: String! # ExportFormat enum value
  $startDate: String!
  $endDate: String!
  $columns: [String]
  $branchId: Int
) {
  exportReport(
    reportType: $reportType
    format: $format
    startDate: $startDate
    endDate: $endDate
    columns: $columns
    branchId: $branchId
  )
}
```

**Variables:**

```json
{
  "reportType": "PRODUCTS",
  "format": "XLSX",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31"
}
```

---

## 12. Views Queries & Mutations

### views

Список сохранённых представлений.

```graphql
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

### view

Получение одного представления по ID.

```graphql
query View($id: ID!) {
  view(id: $id) {
    id
    name
    pageCode
    isDefault
    isPinned
    isShared
    config {
      timeframe {
        type
        customStart
        customEnd
      }
      filters
      columns
      groupBy
      sorting {
        column
        direction
      }
      display
    }
    createdAt
    updatedAt
  }
}
```

### createView (Mutation)

```graphql
mutation CreateView($input: CreateViewInput!) {
  createView(input: $input) {
    id
    name
  }
}
```

**Variables:**

```json
{
  "input": {
    "pageCode": "orders",
    "name": "Delivery Orders - Last Week",
    "config": {
      "timeframe": { "type": "LAST_7_DAYS" },
      "filters": "{\"deliveryType\": [\"DELIVERY\"]}",
      "columns": ["date", "orders", "revenue", "avgCheck"],
      "groupBy": "DAY",
      "sorting": { "column": "revenue", "direction": "DESC" }
    }
  }
}
```

### updateView (Mutation)

```graphql
mutation UpdateView($id: ID!, $input: UpdateViewInput!) {
  updateView(id: $id, input: $input) {
    id
    name
  }
}
```

### deleteView (Mutation)

```graphql
mutation DeleteView($id: ID!) {
  deleteView(id: $id) {
    success
  }
}
```

---

## 13. Dashboard Config

### dashboardConfig

Получение конфигурации дашборда.

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
    widgets {
      id
      type
      position
      config
    }
  }
}
```

### saveDashboardConfig (Mutation)

```graphql
mutation SaveDashboardConfig($config: DashboardConfigInput!) {
  saveDashboardConfig(config: $config) {
    success
  }
}
```

**Variables:**

```json
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
      { "id": "w2", "type": "PAYMENT_METHODS", "position": 1 },
      { "id": "w3", "type": "RECENT_ORDERS", "position": 2 }
    ]
  }
}
```

---

## Business Logic

### ABC-классификация

Используется для категорий и продуктов:

- **A** (Top 20%): Генерируют 80% выручки
- **B** (Next 30%): Генерируют 15% выручки
- **C** (Bottom 50%): Генерируют 5% выручки

### RFM-сегментация

Клиенты оцениваются по 3 параметрам (каждый 1-5 баллов):

- **R (Recency)**: Как давно была последняя покупка
- **F (Frequency)**: Как часто покупает
- **M (Monetary)**: Сколько тратит

Сегменты на основе комбинаций:

- Champions (5,5,5): Лучшие клиенты
- Loyal (4-5, 4-5, 4-5): Лояльные постоянные
- At Risk (1-2, 4-5, 4-5): Были хорошими, уходят
- Lost (1-2, 1-2, 1-2): Потерянные клиенты

### Anomaly Detection

Используется Z-score метод:

```
Z = (X - μ) / σ

Где:
- X = текущее значение
- μ = среднее за период
- σ = стандартное отклонение
```

Пороги (sensitivity параметр):

- sensitivity=3: |Z| > 3 (критическая аномалия)
- sensitivity=2: |Z| > 2 (умеренная аномалия)
- sensitivity=1.5: |Z| > 1.5 (слабая аномалия)

### Goal Progress Calculation

```typescript
// Прогресс
progressPercent = (currentValue / targetValue) * 100;

// Время
timeElapsedPercent = (daysElapsed / totalDays) * 100;

// На пути к цели?
isOnTrack = progressPercent >= timeElapsedPercent * 0.9;

// Требуемый дневной темп
requiredDailyRate = remaining / daysRemaining;

// Прогноз
projectedValue = currentDailyRate * totalDays;
```

---

## Caching Strategy

| Query                                          | TTL    | Reason                   |
| ---------------------------------------------- | ------ | ------------------------ |
| `kpiMetric`, `kpiMetrics`                      | 5 min  | Частые обращения         |
| `timeSeries`                                   | 5 min  | Частые обращения         |
| `categoryAnalytics`, `productAnalytics`        | 5 min  | Редко меняется           |
| `customerOverview`                             | 5 min  |                          |
| `cohortAnalysis`, `rfmAnalysis`, `ltvAnalysis` | 10 min | Тяжёлые запросы          |
| `branchComparison`, `branchBenchmark`          | 5 min  |                          |
| `financialSummary`                             | 1 min  | Более real-time          |
| `alertSummary`                                 | 1 min  | Критично для мониторинга |
| `goalsSummary`                                 | 1 min  |                          |

---

## Authentication & Multi-Tenancy

- Все запросы требуют JWT токен в заголовке `Authorization: Bearer <token>`
- `tenantId` извлекается из JWT токена автоматически
- `branchId` опционален; если не указан, используется `user.activeBranchId`
- Данные автоматически фильтруются по `tenantId` (tenant isolation)

---

## Entitlements (Feature Gating)

Проверка доступа к функциям аналитики через query `me`:

```graphql
query {
  me {
    entitlements {
      analytics_basic    # Всегда true для всех пользователей
      analytics_pro      # PRO план
      analytics_full     # FULL план
      dashboard_custom   # Кастомные дашборды
    }
  }
}
```

### Доступ по тарифам

| Feature | BASIC | PRO | FULL |
|---------|-------|-----|------|
| Sales Overview, Products, Categories | ✓ | ✓ | ✓ |
| Payment Methods, Delivery Types | ✓ | ✓ | ✓ |
| Heatmap, Channels, Staff | — | ✓ | ✓ |
| Customer Analytics (RFM, Cohorts) | — | ✓ | ✓ |
| Branch Comparison, Financial | — | — | ✓ |
| Alerts, Anomaly Detection | — | — | ✓ |

**Важно:** `analytics_basic` всегда возвращает `true` — базовая аналитика доступна всем пользователям.

---

## Error Handling

### GraphQL Error Response Format

```json
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

| Code                    | Meaning                     | Action                 |
| ----------------------- | --------------------------- | ---------------------- |
| `UNAUTHENTICATED`       | No valid token              | Redirect to login      |
| `FORBIDDEN`             | No permission               | Show access denied     |
| `BAD_USER_INPUT`        | Invalid parameters          | Show validation error  |
| `NOT_FOUND`             | Resource not found          | Show not found message |
| `PREMIUM_REQUIRED`      | Premium feature             | Show upgrade prompt    |
| `RATE_LIMITED`          | Too many requests (100/min) | Show wait message      |
| `INTERNAL_SERVER_ERROR` | Server error                | Show error + retry     |

---

## FAQ

**Q: Как запросить несколько KPI в одном запросе?**

A: Используйте `kpiMetrics` query с массивом типов:

```graphql
query {
  kpiMetrics(types: [REVENUE, ORDERS, AVG_CHECK], period: { type: TODAY }) {
    value
    changePercent
    trend
  }
}
```

Или используйте aliases:

```graphql
query {
  revenue: kpiMetric(type: REVENUE, period: $period) {
    value
  }
  orders: kpiMetric(type: ORDERS, period: $period) {
    value
  }
}
```

**Q: Что если branchId не указан?**

A: Используется `user.activeBranchId` из JWT токена. Если и он не задан, возвращаются агрегированные данные по всем филиалам тенанта.

**Q: В каком формате возвращаются даты?**

A: Все timestamps в формате ISO 8601 UTC. Конвертируйте в локальный timezone на фронтенде.

**Q: Какой rate limit?**

A: 100 запросов в минуту на пользователя.

**Q: Можно ли использовать fragments?**

A: Да, GraphQL fragments полностью поддерживаются:

```graphql
fragment KpiFields on KpiMetric {
  value
  changePercent
  trend
}

query {
  revenue: kpiMetric(type: REVENUE, period: $period) {
    ...KpiFields
  }
  orders: kpiMetric(type: ORDERS, period: $period) {
    ...KpiFields
  }
}
```

**Q: Почему некоторые queries возвращают JSON вместо типизированных объектов?**

A: Только `alerts`, `goals` и некоторые финансовые queries возвращают `GraphQLJSON`. Все extended analytics queries (`heatmap`, `productAnalytics`, `paymentMethodsAnalytics`, `categoryAnalytics`, `channelsAnalytics`, `staffAnalytics`, `deliveryTypesAnalytics`) возвращают типизированные ответы.

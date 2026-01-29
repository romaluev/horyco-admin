/**
 * Analytics GraphQL Queries
 * Based on docs: 23-analytics-reporting.md (updated 2025-12-28)
 *
 * All queries use GraphQL (NOT REST)
 * Endpoint: POST /graphql
 */

import { gql } from 'graphql-request'

// ============================================
// SALES OVERVIEW (BASIC)
// ============================================

export const SALES_OVERVIEW_QUERY = gql`
  query SalesOverview($period: PeriodInput!, $branchId: Int) {
    salesOverview(period: $period, branchId: $branchId) {
      summary {
        grossSales
        refunds
        discounts
        netRevenue
        tips
        orderCount
        avgCheck
      }
      changes {
        revenue
        orders
        avgCheck
        discounts
      }
      hourlyBreakdown {
        hour
        revenue
        orders
      }
    }
  }
`

// ============================================
// PRODUCT ANALYTICS (BASIC)
// Per doc 23: Returns typed response with scope, period, summary, products, pagination
// ============================================

export const PRODUCT_ANALYTICS_QUERY = gql`
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
      period {
        type
        startDate
        endDate
        label
        compareTo {
          startDate
          endDate
        }
      }
      summary {
        totalProducts
        uniqueProducts
        totalRevenue
        totalOrders
        totalQuantity
        avgPrice
        revenueChange {
          percent
          trend
          absolute
        }
        changes {
          revenue
          quantity
          products
          avgPrice
        }
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
        revenueChange {
          percent
          trend
          absolute
        }
        change {
          percent
          trend
          absolute
        }
        trend
        rank
        abcClass
      }
      pagination {
        total
        offset
        limit
      }
    }
  }
`

// ============================================
// CATEGORY ANALYTICS (BASIC)
// Per doc 23: Returns typed response with scope, period, summary, categories
// ============================================

export const CATEGORY_ANALYTICS_QUERY = gql`
  query CategoryAnalytics($period: PeriodInput!, $branchId: Int) {
    categoryAnalytics(period: $period, branchId: $branchId) {
      scope
      period {
        type
        startDate
        endDate
        label
        compareTo {
          startDate
          endDate
        }
      }
      summary {
        totalCategories
        totalRevenue
        totalOrders
        revenueChange {
          percent
          trend
          absolute
        }
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
        revenueChange {
          percent
          trend
          absolute
        }
        productCount
        abcClass
      }
    }
  }
`

// ============================================
// PAYMENT METHODS ANALYTICS (BASIC)
// Per doc 23: Returns typed response with scope, period, summary, methods
// ============================================

export const PAYMENT_METHODS_ANALYTICS_QUERY = gql`
  query PaymentMethodsAnalytics($period: PeriodInput!, $branchId: Int) {
    paymentMethodsAnalytics(period: $period, branchId: $branchId) {
      scope
      period {
        type
        startDate
        endDate
        label
        compareTo {
          startDate
          endDate
        }
      }
      summary {
        totalAmount
        totalTransactions
        changes {
          total
          cash
          card
          online
        }
      }
      methods {
        method
        label
        amount
        transactions
        share
        avgAmount
        color
        change {
          percent
          trend
          absolute
        }
      }
    }
  }
`

// ============================================
// STAFF ANALYTICS (PRO)
// Per doc 23: Returns typed response with scope, period, summary, staff
// ============================================

export const STAFF_ANALYTICS_QUERY = gql`
  query StaffAnalytics($period: PeriodInput!, $branchId: Int) {
    staffAnalytics(period: $period, branchId: $branchId) {
      scope
      period {
        type
        startDate
        endDate
        label
        compareTo {
          startDate
          endDate
        }
      }
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
        revenueChange {
          percent
          trend
          absolute
        }
      }
    }
  }
`

// ============================================
// CUSTOMER ANALYTICS (PRO)
// Per doc 23: Returns GraphQL JSON
// ============================================

export const CUSTOMER_OVERVIEW_QUERY = gql`
  query CustomerOverview($period: PeriodInput!, $branchId: Int) {
    customerOverview(period: $period, branchId: $branchId)
  }
`

export const RFM_ANALYSIS_QUERY = gql`
  query RfmAnalysis($lookbackDays: Int, $branchId: Int) {
    rfmAnalysis(lookbackDays: $lookbackDays, branchId: $branchId)
  }
`

export const COHORT_ANALYSIS_QUERY = gql`
  query CohortAnalysis($months: Int, $branchId: Int) {
    cohortAnalysis(months: $months, branchId: $branchId)
  }
`

export const LTV_ANALYSIS_QUERY = gql`
  query LtvAnalysis($projectionMonths: Int, $branchId: Int) {
    ltvAnalysis(projectionMonths: $projectionMonths, branchId: $branchId)
  }
`

// ============================================
// HEATMAP (PRO)
// Per doc 23: Returns typed response with scope, period, cells
// metric param is String ("orders" | "revenue"), default: "orders"
// ============================================

export const HEATMAP_ANALYTICS_QUERY = gql`
  query Heatmap($period: PeriodInput!, $metric: String, $branchId: Int) {
    heatmap(period: $period, metric: $metric, branchId: $branchId) {
      scope
      period {
        type
        startDate
        endDate
        label
        compareTo {
          startDate
          endDate
        }
      }
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
`

// ============================================
// CHANNELS ANALYTICS (PRO)
// Per doc 23: Returns typed response with scope, period, channels
// ============================================

export const CHANNELS_ANALYTICS_QUERY = gql`
  query ChannelsAnalytics($period: PeriodInput!, $branchId: Int) {
    channelsAnalytics(period: $period, branchId: $branchId) {
      scope
      period {
        type
        startDate
        endDate
        label
        compareTo {
          startDate
          endDate
        }
      }
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
        ordersChange {
          percent
          trend
          absolute
        }
      }
    }
  }
`

// ============================================
// BRANCH ANALYTICS (ULTRA)
// Per doc 23: Returns GraphQL JSON
// ============================================

export const BRANCH_COMPARISON_QUERY = gql`
  query BranchComparison($period: PeriodInput!, $sortBy: String) {
    branchComparison(period: $period, sortBy: $sortBy)
  }
`

export const BRANCH_BENCHMARK_QUERY = gql`
  query BranchBenchmark($period: PeriodInput!) {
    branchBenchmark(period: $period)
  }
`

export const BRANCH_TRENDS_QUERY = gql`
  query BranchTrends($period: PeriodInput!) {
    branchTrends(period: $period)
  }
`

// ============================================
// FINANCIAL ANALYTICS (ULTRA)
// Per doc 23: Returns GraphQL JSON
// ============================================

export const PROFIT_LOSS_QUERY = gql`
  query ProfitLoss(
    $period: PeriodInput!
    $branchId: Int
    $comparePreviousPeriod: Boolean
  ) {
    profitLoss(
      period: $period
      branchId: $branchId
      comparePreviousPeriod: $comparePreviousPeriod
    )
  }
`

export const MARGIN_ANALYSIS_QUERY = gql`
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
`

export const CASH_FLOW_QUERY = gql`
  query CashFlow($period: PeriodInput!, $branchId: Int) {
    cashFlow(period: $period, branchId: $branchId)
  }
`

export const REVENUE_BREAKDOWN_QUERY = gql`
  query RevenueBreakdown(
    $period: PeriodInput!
    $groupBy: String
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
`

// ============================================
// ALERTS (ULTRA)
// Per doc 23: Returns GraphQL JSON
// NOTE: alertSummary has NO status argument and returns JSON
// ============================================

export const ALERTS_QUERY = gql`
  query Alerts(
    $severity: String
    $status: String
    $type: String
    $branchId: Int
  ) {
    alerts(
      severity: $severity
      status: $status
      type: $type
      branchId: $branchId
    )
  }
`

export const ALERT_SUMMARY_ANALYTICS_QUERY = gql`
  query AlertSummary($branchId: Int) {
    alertSummary(branchId: $branchId)
  }
`

export const ALERT_THRESHOLDS_QUERY = gql`
  query AlertThresholds {
    alertThresholds
  }
`

export const DETECT_ANOMALIES_QUERY = gql`
  query DetectAnomalies(
    $startDate: String!
    $endDate: String!
    $sensitivity: Int
    $branchId: Int
  ) {
    detectAnomalies(
      startDate: $startDate
      endDate: $endDate
      sensitivity: $sensitivity
      branchId: $branchId
    )
  }
`

// ============================================
// EXPORT REPORT
// ============================================

export const EXPORT_REPORT_QUERY = gql`
  query ExportReport(
    $reportType: String!
    $format: String!
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
`

// ============================================
// KPI QUERIES (for dashboard)
// ============================================

export const KPI_METRIC_QUERY = gql`
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
`

export const KPI_METRICS_QUERY = gql`
  query KpiMetrics($types: [KpiType!]!, $period: PeriodInput!, $branchId: Int) {
    kpiMetrics(types: $types, period: $period, branchId: $branchId) {
      value
      previousValue
      changePercent
      trend
      formattedValue
    }
  }
`

// ============================================
// TIME SERIES (for charts)
// ============================================

export const TIME_SERIES_QUERY = gql`
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
`

// ============================================
// RANKED LIST
// ============================================

export const RANKED_LIST_QUERY = gql`
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
`

// ============================================
// PROPORTIONS (for pie charts)
// ============================================

export const PROPORTIONS_QUERY = gql`
  query Proportions(
    $dimension: String!
    $period: PeriodInput!
    $branchId: Int
  ) {
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
`

// ============================================
// NOTE: FORECAST QUERY IS NOT IMPLEMENTED ON BACKEND
// Per doc 29-analytics-integration-guide.md:
// "forecast - Use cashFlow.forecast instead for projections"
// ============================================

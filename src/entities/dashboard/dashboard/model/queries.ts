/**
 * Dashboard GraphQL Queries
 * Based on documentation: /.claude/docs/24-analytics-dashboard.md
 */

import { gql } from 'graphql-request'

// ============================================
// DASHBOARD CONFIG QUERIES
// ============================================

export const DASHBOARD_CONFIG_QUERY = gql`
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
`

export const SAVE_DASHBOARD_CONFIG_MUTATION = gql`
  mutation SaveDashboardConfig($config: DashboardConfigInput!) {
    saveDashboardConfig(config: $config) {
      success
    }
  }
`

// ============================================
// ENTITLEMENTS QUERY
// ============================================

export const ENTITLEMENTS_QUERY = gql`
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
`

// ============================================
// KPI METRICS QUERY
// ============================================

export const KPI_METRICS_QUERY = gql`
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
`

// ============================================
// TIME SERIES QUERY
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
// WIDGET DATA QUERIES
// ============================================

export const RANKED_LIST_QUERY = gql`
  query RankedList(
    $dataset: Dataset!
    $period: PeriodInput!
    $sortBy: SortBy
    $limit: Int
    $branchId: Int
  ) {
    rankedList(
      dataset: $dataset
      period: $period
      sortBy: $sortBy
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
    }
  }
`

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

export const HEATMAP_QUERY = gql`
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
`

export const GOALS_SUMMARY_QUERY = gql`
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
`

export const ALERT_SUMMARY_QUERY = gql`
  query AlertSummary($branchId: Int) {
    alertSummary(branchId: $branchId) {
      alerts {
        id
        severity
        message
        timestamp
        isRead
      }
      unreadCount
      totalCount
    }
  }
`

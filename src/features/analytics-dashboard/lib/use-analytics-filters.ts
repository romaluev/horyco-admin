/**
 * Analytics Dashboard Filters State Management
 * Manages period and branch scope selection
 */

import { useState, useCallback } from 'react'
import type {
  AnalyticsPeriodType,
  AnalyticsScopeType,
  AnalyticsGroupBy,
} from '@/entities/analytics'

export interface IAnalyticsFilters {
  scope: AnalyticsScopeType
  period: AnalyticsPeriodType
  startDate?: string
  endDate?: string
  groupBy?: AnalyticsGroupBy
}

export const useAnalyticsFilters = () => {
  const [filters, setFilters] = useState<IAnalyticsFilters>({
    scope: 'branch',
    period: 'day',
  })

  const setPeriod = useCallback((period: AnalyticsPeriodType) => {
    setFilters((prev) => ({
      ...prev,
      period,
      startDate: undefined,
      endDate: undefined,
      groupBy: undefined, // Reset groupBy when period changes
    }))
  }, [])

  const setCustomDateRange = useCallback(
    (startDate: string, endDate: string) => {
      setFilters((prev) => ({
        ...prev,
        period: 'custom',
        startDate,
        endDate,
      }))
    },
    []
  )

  const setScope = useCallback((scope: AnalyticsScopeType) => {
    setFilters((prev) => ({
      ...prev,
      scope,
    }))
  }, [])

  const setGroupBy = useCallback((groupBy: AnalyticsGroupBy) => {
    setFilters((prev) => ({
      ...prev,
      groupBy,
    }))
  }, [])

  return {
    filters,
    setPeriod,
    setCustomDateRange,
    setScope,
    setGroupBy,
  }
}

/**
 * Analytics React Query Hooks
 */

import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from './api'
import { analyticsKeys } from './query-keys'
import type { IDashboardAnalyticsParams } from './types'

/**
 * Hook to fetch dashboard analytics
 * Caches for 5 minutes as per API spec
 */
export const useDashboardAnalytics = (params?: IDashboardAnalyticsParams) => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(params),
    queryFn: () => analyticsApi.getDashboardAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

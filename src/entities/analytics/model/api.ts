/**
 * Analytics API Client
 * Endpoint: GET /admin/analytics/dashboard
 */

import apiClient from '@/shared/lib/axios'

import type {
  IDashboardAnalyticsParams,
  IDashboardAnalyticsResponse,
} from './types'

export const analyticsApi = {
  /**
   * Get dashboard analytics data
   * Supports period selection, branch scope, and chart grouping
   * @param params - Query parameters for analytics
   * @returns Dashboard analytics response
   */
  getDashboardAnalytics: async (
    params?: IDashboardAnalyticsParams
  ): Promise<IDashboardAnalyticsResponse> => {
    const response = await apiClient.get<{
      success: boolean
      data: IDashboardAnalyticsResponse
    }>('/admin/analytics/dashboard', { params })

    return response.data.data
  },
}

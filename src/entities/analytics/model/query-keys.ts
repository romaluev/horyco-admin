/**
 * Analytics Query Keys
 * Used for React Query cache management
 */

import type { IDashboardAnalyticsParams } from './types'

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (params?: IDashboardAnalyticsParams) =>
    [...analyticsKeys.all, 'dashboard', params] as const,
}

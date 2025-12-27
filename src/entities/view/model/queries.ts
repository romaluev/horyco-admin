import { useQuery } from '@tanstack/react-query'

import { viewApi } from './api'
import { viewKeys } from './query-keys'

import type { IViewDataParams, IViewsQueryParams } from './types'

/**
 * Get all views, optionally filtered by pageCode (dataset)
 */
export const useViews = (params?: IViewsQueryParams) => {
  return useQuery({
    queryKey: viewKeys.list(params),
    queryFn: () => viewApi.getViews(params?.pageCode),
  })
}

/**
 * Get a single view by ID
 */
export const useViewById = (id: string) => {
  return useQuery({
    queryKey: viewKeys.byId(id),
    queryFn: () => viewApi.getViewById(id),
    enabled: Boolean(id),
  })
}

/**
 * Get ranked list data for view table
 * Uses 5 minute staleTime as per API caching spec
 */
export const useViewData = (params: IViewDataParams) => {
  return useQuery({
    queryKey: viewKeys.data(params),
    queryFn: () =>
      viewApi.getRankedList({
        dataset: params.dataset,
        period: params.period,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        limit: params.limit,
        branchId: params.branchId,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Stock Movement Query Hooks
 * TanStack React Query hooks for fetching movement data
 */

import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'

import { stockMovementApi } from './api'
import { stockMovementKeys } from './query-keys'
import type {
  IMovementsResponse,
  IMovementsSummary,
  IGetMovementsParams,
} from './types'

export const useGetMovements = (
  params?: IGetMovementsParams,
  options?: Omit<UseQueryOptions<IMovementsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: stockMovementKeys.list(params),
    queryFn: () => stockMovementApi.getMovements(params),
    ...options,
  })
}

export const useGetMovementSummary = (
  params?: { warehouseId?: number; from?: string; to?: string },
  options?: Omit<UseQueryOptions<IMovementsSummary>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: stockMovementKeys.summary(params),
    queryFn: () => stockMovementApi.getMovementSummary(params),
    ...options,
  })
}

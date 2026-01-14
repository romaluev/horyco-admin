import { useQuery } from '@tanstack/react-query'

import { stockMovementApi } from './api'
import { movementKeys } from './query-keys'

import type { IGetMovementsParams } from './types'

/**
 * Get stock movements with filters
 * Note: warehouseId is required by the backend
 */
export const useGetMovements = (params?: IGetMovementsParams) => {
  return useQuery({
    queryKey: movementKeys.list(params),
    queryFn: () => stockMovementApi.getMovements(params),
    enabled: !!params?.warehouseId,
  })
}

// Alias
export const useMovementList = useGetMovements

/**
 * Get single movement by ID
 */
export const useMovementById = (id: number) => {
  return useQuery({
    queryKey: movementKeys.detail(id),
    queryFn: () => stockMovementApi.getMovementById(id),
    enabled: !!id,
  })
}

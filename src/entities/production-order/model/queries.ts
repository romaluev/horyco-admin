import { useQuery } from '@tanstack/react-query'

import { productionOrderApi } from './api'
import { productionOrderKeys } from './query-keys'

import type { IGetProductionOrdersParams } from './types'

/**
 * Get all production orders
 */
export const useGetProductionOrders = (params?: IGetProductionOrdersParams) => {
  return useQuery({
    queryKey: productionOrderKeys.list(params),
    queryFn: () => productionOrderApi.getProductionOrders(params),
  })
}

// Alias
export const useProductionOrderList = useGetProductionOrders

/**
 * Get production order by ID with ingredients
 */
export const useProductionOrderById = (id: number) => {
  return useQuery({
    queryKey: productionOrderKeys.detail(id),
    queryFn: () => productionOrderApi.getProductionOrderById(id),
    enabled: !!id,
  })
}

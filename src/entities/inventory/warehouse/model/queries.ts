import { useQuery } from '@tanstack/react-query'

import { warehouseApi } from './api'
import { warehouseKeys } from './query-keys'

import type { IGetWarehousesParams } from './types'

/**
 * Get all warehouses
 */
export const useGetWarehouses = (params?: IGetWarehousesParams) => {
  return useQuery({
    queryKey: warehouseKeys.list(params),
    queryFn: () => warehouseApi.getWarehouses(params),
  })
}

// Alias for backward compatibility
export const useWarehouseList = useGetWarehouses

/**
 * Get warehouse by ID
 */
export const useWarehouseById = (id: number) => {
  return useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: () => warehouseApi.getWarehouseById(id),
    enabled: !!id,
  })
}

/**
 * Get warehouse stock summary
 */
export const useWarehouseStockSummary = (id: number) => {
  return useQuery({
    queryKey: warehouseKeys.stockSummary(id),
    queryFn: () => warehouseApi.getWarehouseStockSummary(id),
    enabled: !!id,
  })
}

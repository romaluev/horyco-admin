/**
 * Warehouse Query Hooks
 * TanStack React Query hooks for fetching warehouse data
 */

import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'

import { warehouseApi } from './api'
import { warehouseKeys } from './query-keys'
import type { IWarehouse, IWarehousesResponse, IGetWarehousesParams } from './types'

export const useGetWarehouses = (
  params?: IGetWarehousesParams,
  options?: Omit<UseQueryOptions<IWarehousesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: warehouseKeys.list(params),
    queryFn: () => warehouseApi.getWarehouses(params),
    ...options,
  })
}

export const useGetWarehouseById = (
  id: number,
  options?: Omit<UseQueryOptions<IWarehouse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: () => warehouseApi.getWarehouseById(id),
    enabled: !!id,
    ...options,
  })
}

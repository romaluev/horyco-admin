/**
 * Stock Query Hooks
 * TanStack React Query hooks for fetching stock data
 */

import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'

import { stockApi } from './api'
import { stockKeys } from './query-keys'
import type {
  IStockResponse,
  IStockSummary,
  IGetStockParams,
  ILowStockItem,
  IStock,
} from './types'

export const useGetStock = (
  params: IGetStockParams,
  options?: Omit<UseQueryOptions<IStockResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: stockKeys.list(params),
    queryFn: () => stockApi.getStock(params),
    enabled: !!params.warehouseId,
    ...options,
  })
}

export const useGetStockByItem = (
  itemId: number,
  options?: Omit<UseQueryOptions<IStock[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: stockKeys.byItem(itemId),
    queryFn: () => stockApi.getStockByItem(itemId),
    enabled: !!itemId,
    ...options,
  })
}

export const useGetLowStock = (
  warehouseId?: number,
  options?: Omit<UseQueryOptions<ILowStockItem[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: stockKeys.low(warehouseId),
    queryFn: () => stockApi.getLowStock(warehouseId!),
    enabled: !!warehouseId,
    ...options,
  })
}

export const useGetOutOfStock = (
  warehouseId?: number,
  options?: Omit<UseQueryOptions<ILowStockItem[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: stockKeys.out(warehouseId),
    queryFn: () => stockApi.getOutOfStock(warehouseId!),
    enabled: !!warehouseId,
    ...options,
  })
}

export const useGetStockSummary = (
  warehouseId?: number,
  options?: Omit<UseQueryOptions<IStockSummary>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: stockKeys.summary(warehouseId),
    queryFn: () => stockApi.getStockSummary(warehouseId!),
    enabled: !!warehouseId,
    ...options,
  })
}

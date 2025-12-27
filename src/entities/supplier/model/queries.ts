/**
 * Supplier Query Hooks
 * TanStack React Query hooks for fetching supplier data
 */

import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'

import { supplierApi } from './api'
import { supplierKeys } from './query-keys'
import type {
  ISupplier,
  ISuppliersResponse,
  IGetSuppliersParams,
  ISupplierItem,
  IPriceHistoryResponse,
  IGetPriceHistoryParams,
} from './types'

export const useGetSuppliers = (
  params?: IGetSuppliersParams,
  options?: Omit<UseQueryOptions<ISuppliersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => supplierApi.getSuppliers(params),
    ...options,
  })
}

export const useGetSupplierById = (
  id: number,
  options?: Omit<UseQueryOptions<ISupplier>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierApi.getSupplierById(id),
    enabled: !!id,
    ...options,
  })
}

export const useGetSupplierItems = (
  supplierId: number,
  options?: Omit<UseQueryOptions<ISupplierItem[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: supplierKeys.items(supplierId),
    queryFn: () => supplierApi.getSupplierItems(supplierId),
    enabled: !!supplierId,
    ...options,
  })
}

export const useGetSupplierPriceHistory = (
  supplierId: number,
  params?: IGetPriceHistoryParams,
  options?: Omit<UseQueryOptions<IPriceHistoryResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: supplierKeys.priceHistory(supplierId, params),
    queryFn: () => supplierApi.getPriceHistory(supplierId, params),
    enabled: !!supplierId,
    ...options,
  })
}

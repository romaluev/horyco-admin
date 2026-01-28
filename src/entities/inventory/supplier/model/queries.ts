import { useQuery } from '@tanstack/react-query'

import { supplierApi } from './api'
import { supplierKeys } from './query-keys'

import type { IGetSuppliersParams, IGetPriceHistoryParams } from './types'

/**
 * Get all suppliers
 */
export const useGetSuppliers = (params?: IGetSuppliersParams) => {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => supplierApi.getSuppliers(params),
  })
}

// Alias
export const useSupplierList = useGetSuppliers

/**
 * Get supplier by ID with items
 */
export const useSupplierById = (id: number) => {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierApi.getSupplierById(id),
    enabled: !!id,
  })
}

/**
 * Get supplier items catalog
 */
export const useSupplierItems = (id: number) => {
  return useQuery({
    queryKey: supplierKeys.items(id),
    queryFn: () => supplierApi.getSupplierItems(id),
    enabled: !!id,
  })
}

/**
 * Get price history for supplier
 */
export const useSupplierPriceHistory = (id: number, params?: IGetPriceHistoryParams) => {
  return useQuery({
    queryKey: supplierKeys.priceHistory(id, params),
    queryFn: () => supplierApi.getPriceHistory(id, params),
    enabled: !!id,
  })
}

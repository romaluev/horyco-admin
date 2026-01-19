import { useQuery } from '@tanstack/react-query'

import { purchaseOrderApi } from './api'
import { purchaseOrderKeys } from './query-keys'

import type { IGetPurchaseOrdersParams } from './types'

/**
 * Get all purchase orders
 */
export const useGetPurchaseOrders = (params?: IGetPurchaseOrdersParams) => {
  return useQuery({
    queryKey: purchaseOrderKeys.list(params),
    queryFn: () => purchaseOrderApi.getPurchaseOrders(params),
  })
}

// Alias
export const usePurchaseOrderList = useGetPurchaseOrders

/**
 * Get purchase order by ID with items and receives
 */
export const usePurchaseOrderById = (id: number) => {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id),
    queryFn: () => purchaseOrderApi.getPurchaseOrderById(id),
    enabled: !!id,
  })
}

/**
 * Purchase Order Query Hooks
 * TanStack React Query hooks for fetching purchase order data
 */

import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'

import { POStatus } from '@/shared/types/inventory'

import { purchaseOrderApi } from './api'
import { purchaseOrderKeys } from './query-keys'
import type {
  IPurchaseOrder,
  IPurchaseOrdersResponse,
  IGetPurchaseOrdersParams,
} from './types'

export const useGetPurchaseOrders = (
  params?: IGetPurchaseOrdersParams,
  options?: Omit<UseQueryOptions<IPurchaseOrdersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.list(params),
    queryFn: () => purchaseOrderApi.getPurchaseOrders(params),
    ...options,
  })
}

export const useGetPurchaseOrderById = (
  id: number,
  options?: Omit<UseQueryOptions<IPurchaseOrder>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id),
    queryFn: () => purchaseOrderApi.getPurchaseOrderById(id),
    enabled: !!id,
    ...options,
  })
}

export const useGetPurchaseOrdersBySupplier = (
  supplierId: number,
  options?: Omit<UseQueryOptions<IPurchaseOrdersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.bySupplier(supplierId),
    queryFn: () => purchaseOrderApi.getPurchaseOrders({ supplierId }),
    enabled: !!supplierId,
    ...options,
  })
}

export const useGetUpcomingDeliveries = (
  branchId?: number,
  options?: Omit<UseQueryOptions<IPurchaseOrdersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.upcoming(),
    queryFn: () =>
      purchaseOrderApi.getPurchaseOrders({
        branchId,
        status: POStatus.SENT,
        limit: 10,
      }),
    ...options,
  })
}

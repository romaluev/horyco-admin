/**
 * Production Order Query Hooks
 * TanStack React Query hooks for fetching production order data
 */

import { useQuery } from '@tanstack/react-query'

import { productionOrderApi } from './api'
import { productionOrderKeys } from './query-keys'
import type { IProductionOrderListParams } from './types'
import { ProductionStatus } from '@/shared/types/inventory'

export const useGetProductionOrders = (
  branchId: number,
  params?: IProductionOrderListParams,
  enabled = true
) => {
  return useQuery({
    queryKey: productionOrderKeys.list(branchId, params),
    queryFn: () => productionOrderApi.getProductionOrders(branchId, params),
    enabled: enabled && !!branchId,
  })
}

export const useGetProductionOrderById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: productionOrderKeys.detail(id),
    queryFn: () => productionOrderApi.getProductionOrderById(id),
    enabled: enabled && !!id,
  })
}

export const useGetProductionSuggestions = (
  branchId: number,
  warehouseId?: number,
  enabled = true
) => {
  return useQuery({
    queryKey: productionOrderKeys.suggestions(branchId, warehouseId),
    queryFn: () =>
      productionOrderApi.getProductionSuggestions(branchId, warehouseId),
    enabled: enabled && !!branchId,
  })
}

export const useCheckProductionAvailability = (id: number, enabled = true) => {
  return useQuery({
    queryKey: productionOrderKeys.availability(id),
    queryFn: () => productionOrderApi.checkAvailability(id),
    enabled: enabled && !!id,
  })
}

export const useGetPlannedProductions = (branchId: number, enabled = true) => {
  return useQuery({
    queryKey: productionOrderKeys.planned(branchId),
    queryFn: () =>
      productionOrderApi.getProductionOrders(branchId, {
        status: ProductionStatus.PLANNED,
      }),
    enabled: enabled && !!branchId,
    select: (data) => data.data,
  })
}

export const useGetInProgressProductions = (
  branchId: number,
  enabled = true
) => {
  return useQuery({
    queryKey: productionOrderKeys.inProgress(branchId),
    queryFn: () =>
      productionOrderApi.getProductionOrders(branchId, {
        status: ProductionStatus.IN_PROGRESS,
      }),
    enabled: enabled && !!branchId,
    select: (data) => data.data,
  })
}

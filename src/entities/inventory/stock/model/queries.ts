import { useQuery } from '@tanstack/react-query'

import { stockApi } from './api'
import { stockKeys } from './query-keys'

import type {
  IGetStockParams,
  IStockAlertParams,
  IGetStockAlertsParams,
} from './types'

/**
 * Get stock levels with filters
 * Note: warehouseId is required by the backend
 */
export const useGetStock = (params?: IGetStockParams) => {
  return useQuery({
    queryKey: stockKeys.list(params),
    queryFn: () => stockApi.getStock(params),
    enabled: !!params?.warehouseId,
  })
}

// Alias for backward compatibility
export const useStockList = useGetStock

/**
 * Get stock summary for dashboard
 */
export const useStockSummary = (warehouseId?: number) => {
  return useQuery({
    queryKey: stockKeys.summary(warehouseId),
    queryFn: () => stockApi.getStockSummary(warehouseId),
  })
}

/**
 * Get items with low stock
 * Note: warehouseId is required by the backend
 */
export const useLowStock = (params?: IStockAlertParams) => {
  return useQuery({
    queryKey: stockKeys.low(params),
    queryFn: () => stockApi.getLowStock(params),
    enabled: !!params?.warehouseId,
  })
}

/**
 * Get items that are out of stock
 * Note: warehouseId is required by the backend
 */
export const useOutOfStock = (params?: IStockAlertParams) => {
  return useQuery({
    queryKey: stockKeys.out(params),
    queryFn: () => stockApi.getOutOfStock(params),
    enabled: !!params?.warehouseId,
  })
}

/**
 * Get stock alerts
 * Note: warehouseId is required by the backend
 */
export const useStockAlerts = (params?: IGetStockAlertsParams) => {
  return useQuery({
    queryKey: stockKeys.alerts(params),
    queryFn: () => stockApi.getAlerts(params),
    enabled: !!params?.warehouseId,
  })
}

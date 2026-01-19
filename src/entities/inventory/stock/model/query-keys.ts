import type { IGetStockParams, IStockAlertParams, IGetStockAlertsParams } from './types'

export const stockKeys = {
  all: ['stock'] as const,
  lists: () => [...stockKeys.all, 'list'] as const,
  list: (params?: IGetStockParams) => [...stockKeys.lists(), params] as const,
  summary: (warehouseId?: number) =>
    [...stockKeys.all, 'summary', warehouseId] as const,
  low: (params?: IStockAlertParams) => [...stockKeys.all, 'low', params] as const,
  out: (params?: IStockAlertParams) => [...stockKeys.all, 'out', params] as const,
  alerts: (params?: IGetStockAlertsParams) =>
    [...stockKeys.all, 'alerts', params] as const,
}

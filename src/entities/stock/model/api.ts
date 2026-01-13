import api from '@/shared/lib/axios'

import type {
  IStock,
  IStockSummary,
  IStockAlert,
  IAdjustStockDto,
  IGetStockParams,
  IStockAlertParams,
  IStockListResponse,
  IGetStockAlertsParams,
} from './types'

export const stockApi = {
  /**
   * GET /admin/inventory/stock
   * Get stock levels with filters
   */
  async getStock(params?: IGetStockParams): Promise<IStockListResponse> {
    const response = await api.get<{
      success: boolean
      data: IStock[]
      meta: IStockListResponse['meta']
    }>('/admin/inventory/stock', { params })
    return {
      data: response.data.data || [],
      meta: response.data.meta || { total: 0, page: 0, size: 20, totalPages: 0 },
    }
  },

  /**
   * GET /admin/inventory/stock/summary
   * Get stock summary for dashboard
   */
  async getStockSummary(warehouseId?: number): Promise<IStockSummary> {
    const response = await api.get<{ success: boolean; data: IStockSummary }>(
      '/admin/inventory/stock/summary',
      { params: warehouseId ? { warehouseId } : undefined }
    )
    return response.data.data
  },

  /**
   * GET /admin/inventory/stock/low
   * Get items with low stock
   */
  async getLowStock(params?: IStockAlertParams): Promise<IStock[]> {
    const response = await api.get<{ success: boolean; data: IStock[] }>(
      '/admin/inventory/stock/low',
      { params }
    )
    return response.data.data || []
  },

  /**
   * GET /admin/inventory/stock/out
   * Get items that are out of stock
   */
  async getOutOfStock(params?: IStockAlertParams): Promise<IStock[]> {
    const response = await api.get<{ success: boolean; data: IStock[] }>(
      '/admin/inventory/stock/out',
      { params }
    )
    return response.data.data || []
  },

  /**
   * POST /admin/inventory/stock/adjust
   * Manually adjust stock level
   */
  async adjustStock(data: IAdjustStockDto): Promise<IStock> {
    const response = await api.post<{ success: boolean; data: IStock }>(
      '/admin/inventory/stock/adjust',
      data
    )
    return response.data.data
  },

  /**
   * GET /admin/inventory/alerts
   * Get stock alerts
   */
  async getAlerts(params?: IGetStockAlertsParams): Promise<IStockAlert[]> {
    const response = await api.get<{ success: boolean; data: IStockAlert[] }>(
      '/admin/inventory/alerts',
      { params }
    )
    return response.data.data || []
  },

  /**
   * POST /admin/inventory/alerts/:id/acknowledge
   * Acknowledge a stock alert
   */
  async acknowledgeAlert(id: number): Promise<IStockAlert> {
    const response = await api.post<{ success: boolean; data: IStockAlert }>(
      `/admin/inventory/alerts/${id}/acknowledge`
    )
    return response.data.data
  },
}

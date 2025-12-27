/**
 * Stock API Client
 * Based on /api/admin/inventory/stock endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IStockResponse,
  IStockSummary,
  IGetStockParams,
  ILowStockItem,
  IStockAdjustmentDto,
  IStock,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const stockApi = {
  /**
   * Get stock levels by warehouse
   * GET /admin/inventory/stock
   */
  async getStock(params: IGetStockParams): Promise<IStockResponse> {
    const response = await api.get<ApiResponse<IStockResponse>>(
      '/admin/inventory/stock',
      { params }
    )
    return response.data.data
  },

  /**
   * Get stock for specific item across all warehouses
   * GET /admin/inventory/stock/item/:itemId
   */
  async getStockByItem(itemId: number): Promise<IStock[]> {
    const response = await api.get<ApiResponse<IStock[]>>(
      `/admin/inventory/stock/item/${itemId}`
    )
    return response.data.data
  },

  /**
   * Get low stock items
   * GET /admin/inventory/stock/low
   */
  async getLowStock(warehouseId?: number): Promise<ILowStockItem[]> {
    const response = await api.get<ApiResponse<ILowStockItem[]>>(
      '/admin/inventory/stock/low',
      { params: { warehouseId } }
    )
    return response.data.data
  },

  /**
   * Get out of stock items
   * GET /admin/inventory/stock/out
   */
  async getOutOfStock(warehouseId?: number): Promise<ILowStockItem[]> {
    const response = await api.get<ApiResponse<ILowStockItem[]>>(
      '/admin/inventory/stock/out',
      { params: { warehouseId } }
    )
    return response.data.data
  },

  /**
   * Get stock summary/statistics
   * GET /admin/inventory/stock/summary
   */
  async getStockSummary(warehouseId?: number): Promise<IStockSummary> {
    const response = await api.get<ApiResponse<IStockSummary>>(
      '/admin/inventory/stock/summary',
      { params: { warehouseId } }
    )
    return response.data.data
  },

  /**
   * Adjust stock manually
   * POST /admin/inventory/stock/adjust
   */
  async adjustStock(data: IStockAdjustmentDto): Promise<IStock> {
    const response = await api.post<ApiResponse<IStock>>(
      '/admin/inventory/stock/adjust',
      data
    )
    return response.data.data
  },
}

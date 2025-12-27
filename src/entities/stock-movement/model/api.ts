/**
 * Stock Movement API Client
 * Based on /api/admin/inventory/movements endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IMovementsResponse,
  IMovementsSummary,
  IGetMovementsParams,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const stockMovementApi = {
  /**
   * Get movement history with filters
   * GET /admin/inventory/movements
   */
  async getMovements(params?: IGetMovementsParams): Promise<IMovementsResponse> {
    const response = await api.get<ApiResponse<IMovementsResponse>>(
      '/admin/inventory/movements',
      { params }
    )
    return response.data.data
  },

  /**
   * Get movement summary for period
   * GET /admin/inventory/movements/summary
   */
  async getMovementSummary(params?: {
    warehouseId?: number
    from?: string
    to?: string
  }): Promise<IMovementsSummary> {
    const response = await api.get<ApiResponse<IMovementsSummary>>(
      '/admin/inventory/movements/summary',
      { params }
    )
    return response.data.data
  },
}

import api from '@/shared/lib/axios'

import type {
  IStockMovement,
  IGetMovementsParams,
  IMovementListResponse,
} from './types'

export const stockMovementApi = {
  /**
   * GET /admin/inventory/movements
   * Get stock movements with filters (read-only)
   */
  async getMovements(
    params?: IGetMovementsParams
  ): Promise<IMovementListResponse> {
    const response = await api.get<{
      success: boolean
      data: IStockMovement[]
      meta: IMovementListResponse['meta']
    }>('/admin/inventory/movements', { params })
    return {
      data: response.data.data || [],
      meta: response.data.meta || {
        total: 0,
        page: 0,
        size: 20,
        totalPages: 0,
      },
    }
  },

  /**
   * GET /admin/inventory/movements/:id
   * Get single movement by ID
   */
  async getMovementById(id: number): Promise<IStockMovement> {
    const response = await api.get<{ success: boolean; data: IStockMovement }>(
      `/admin/inventory/movements/${id}`
    )
    return response.data.data
  },
}

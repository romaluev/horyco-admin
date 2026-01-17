/**
 * Inventory Count API Client
 * Based on /admin/inventory/counts endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IInventoryCount,
  ICountItem,
  ICountVarianceSummary,
  ICreateInventoryCountDto,
  IGetInventoryCountsParams,
  ICreateCountItemDto,
  IUpdateCountItemDto,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const inventoryCountApi = {
  /**
   * Get all inventory counts
   * GET /admin/inventory/counts
   */
  async getCounts(params?: IGetInventoryCountsParams): Promise<IInventoryCount[]> {
    const response = await api.get<ApiResponse<IInventoryCount[]> | IInventoryCount[]>(
      '/admin/inventory/counts',
      { params }
    )
    const data = response.data
    if (Array.isArray(data)) return data
    return data.data || []
  },

  /**
   * Get inventory count by ID with items
   * GET /admin/inventory/counts/:id
   */
  async getCountById(id: number): Promise<IInventoryCount> {
    const response = await api.get<ApiResponse<IInventoryCount>>(
      `/admin/inventory/counts/${id}`
    )
    return response.data.data
  },

  /**
   * Get variance summary for count
   * GET /admin/inventory/counts/:id/variance
   */
  async getVarianceSummary(id: number): Promise<ICountVarianceSummary> {
    const response = await api.get<ApiResponse<ICountVarianceSummary>>(
      `/admin/inventory/counts/${id}/variance`
    )
    return response.data.data
  },

  /**
   * Create inventory count
   * POST /admin/inventory/counts
   */
  async createCount(data: ICreateInventoryCountDto): Promise<IInventoryCount> {
    const response = await api.post<ApiResponse<IInventoryCount>>(
      '/admin/inventory/counts',
      data
    )
    return response.data.data
  },

  /**
   * Add item to count
   * POST /admin/inventory/counts/:id/items
   */
  async addItem(id: number, data: ICreateCountItemDto): Promise<ICountItem> {
    const response = await api.post<ApiResponse<ICountItem>>(
      `/admin/inventory/counts/${id}/items`,
      data
    )
    return response.data.data
  },

  /**
   * Update count item (enter counted quantity)
   * PATCH /admin/inventory/counts/:id/items/:countItemId
   */
  async updateItem(countId: number, countItemId: number, data: IUpdateCountItemDto): Promise<ICountItem> {
    const response = await api.patch<ApiResponse<ICountItem>>(
      `/admin/inventory/counts/${countId}/items/${countItemId}`,
      data
    )
    return response.data.data
  },

  /**
   * Complete count and submit for approval
   * POST /admin/inventory/counts/:id/complete
   */
  async completeCount(id: number): Promise<IInventoryCount> {
    const response = await api.post<ApiResponse<IInventoryCount>>(
      `/admin/inventory/counts/${id}/complete`
    )
    return response.data.data
  },

  /**
   * Approve inventory count (applies adjustments)
   * POST /admin/inventory/counts/:id/approve
   */
  async approveCount(id: number): Promise<IInventoryCount> {
    const response = await api.post<ApiResponse<IInventoryCount>>(
      `/admin/inventory/counts/${id}/approve`
    )
    return response.data.data
  },

  /**
   * Cancel inventory count
   * POST /admin/inventory/counts/:id/cancel
   */
  async cancelCount(id: number): Promise<IInventoryCount> {
    const response = await api.post<ApiResponse<IInventoryCount>>(
      `/admin/inventory/counts/${id}/cancel`
    )
    return response.data.data
  },
}

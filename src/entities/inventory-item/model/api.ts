/**
 * Inventory Item API Client
 * Based on /api/admin/inventory/items endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IInventoryItem,
  IInventoryItemsResponse,
  ICreateInventoryItemDto,
  IUpdateInventoryItemDto,
  IGetInventoryItemsParams,
  IUnitConversion,
  ICreateUnitConversionDto,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const inventoryItemApi = {
  /**
   * Get all inventory items with filters
   * GET /admin/inventory/items
   */
  async getItems(params?: IGetInventoryItemsParams): Promise<IInventoryItemsResponse> {
    const response = await api.get<ApiResponse<IInventoryItemsResponse>>(
      '/admin/inventory/items',
      { params }
    )
    return response.data.data
  },

  /**
   * Get inventory item by ID
   * GET /admin/inventory/items/:id
   */
  async getItemById(id: number): Promise<IInventoryItem> {
    const response = await api.get<ApiResponse<IInventoryItem>>(
      `/admin/inventory/items/${id}`
    )
    return response.data.data
  },

  /**
   * Create new inventory item
   * POST /admin/inventory/items
   */
  async createItem(data: ICreateInventoryItemDto): Promise<IInventoryItem> {
    const response = await api.post<ApiResponse<IInventoryItem>>(
      '/admin/inventory/items',
      data
    )
    return response.data.data
  },

  /**
   * Update inventory item
   * PATCH /admin/inventory/items/:id
   */
  async updateItem(id: number, data: IUpdateInventoryItemDto): Promise<IInventoryItem> {
    const response = await api.patch<ApiResponse<IInventoryItem>>(
      `/admin/inventory/items/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete inventory item
   * DELETE /admin/inventory/items/:id
   */
  async deleteItem(id: number): Promise<void> {
    await api.delete(`/admin/inventory/items/${id}`)
  },

  // ===== Unit Conversions =====

  /**
   * Get unit conversions for an item
   * GET /admin/inventory/items/:id/conversions
   */
  async getItemConversions(itemId: number): Promise<IUnitConversion[]> {
    const response = await api.get<ApiResponse<IUnitConversion[]>>(
      `/admin/inventory/items/${itemId}/conversions`
    )
    return response.data.data
  },

  /**
   * Add unit conversion to an item
   * POST /admin/inventory/items/:id/conversions
   */
  async addConversion(
    itemId: number,
    data: ICreateUnitConversionDto
  ): Promise<IUnitConversion> {
    const response = await api.post<ApiResponse<IUnitConversion>>(
      `/admin/inventory/items/${itemId}/conversions`,
      data
    )
    return response.data.data
  },

  /**
   * Delete unit conversion
   * DELETE /admin/inventory/items/:id/conversions/:conversionId
   */
  async deleteConversion(itemId: number, conversionId: number): Promise<void> {
    await api.delete(`/admin/inventory/items/${itemId}/conversions/${conversionId}`)
  },
}

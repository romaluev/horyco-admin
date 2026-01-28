/**
 * Inventory Item API Client
 * Based on /admin/inventory/items endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IInventoryItem,
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
   * Get all inventory items
   * GET /admin/inventory/items
   */
  async getItems(params?: IGetInventoryItemsParams): Promise<IInventoryItem[]> {
    const response = await api.get<ApiResponse<IInventoryItem[]>>(
      '/admin/inventory/items',
      { params }
    )
    return response.data.data
  },

  /**
   * Get item by ID
   * GET /admin/inventory/items/:id
   */
  async getItemById(id: number): Promise<IInventoryItem> {
    const response = await api.get<ApiResponse<IInventoryItem>>(
      `/admin/inventory/items/${id}`
    )
    return response.data.data
  },

  /**
   * Get all item categories
   * GET /admin/inventory/items/categories
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>(
      '/admin/inventory/items/categories'
    )
    return response.data.data
  },

  /**
   * Get unit conversions for item
   * GET /admin/inventory/items/:id/conversions
   */
  async getItemConversions(id: number): Promise<IUnitConversion[]> {
    const response = await api.get<ApiResponse<IUnitConversion[]>>(
      `/admin/inventory/items/${id}/conversions`
    )
    return response.data.data
  },

  /**
   * Create inventory item
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
  async updateItem(
    id: number,
    data: IUpdateInventoryItemDto
  ): Promise<IInventoryItem> {
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

  /**
   * Add unit conversion to item
   * POST /admin/inventory/items/:id/conversions
   */
  async addConversion(
    id: number,
    data: ICreateUnitConversionDto
  ): Promise<IUnitConversion> {
    const response = await api.post<ApiResponse<IUnitConversion>>(
      `/admin/inventory/items/${id}/conversions`,
      data
    )
    return response.data.data
  },

  /**
   * Remove unit conversion from item
   * DELETE /admin/inventory/items/:id/conversions/:conversionId
   */
  async removeConversion(id: number, conversionId: number): Promise<void> {
    await api.delete(`/admin/inventory/items/${id}/conversions/${conversionId}`)
  },
}

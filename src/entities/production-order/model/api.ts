/**
 * Production Order API
 * REST API client for production order operations
 */

import api from '@/shared/lib/axios'
import type {
  IProductionOrder,
  IProductionOrderListItem,
  ICreateProductionOrderDto,
  IUpdateProductionOrderDto,
  ICompleteProductionDto,
  IProductionOrderListParams,
  IProductionSuggestion,
} from './types'

const BASE_URL = '/admin/inventory/production'

export const productionOrderApi = {
  // List production orders
  getProductionOrders: async (
    branchId: number,
    params?: IProductionOrderListParams
  ): Promise<{ data: IProductionOrderListItem[]; total: number }> => {
    const response = await api.get(BASE_URL, {
      params: { branchId, ...params },
    })
    return response.data
  },

  // Get single production order with ingredients
  getProductionOrderById: async (id: number): Promise<IProductionOrder> => {
    const response = await api.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Get production suggestions based on low stock items
  getProductionSuggestions: async (
    branchId: number,
    warehouseId?: number
  ): Promise<IProductionSuggestion[]> => {
    const response = await api.get(`${BASE_URL}/suggestions`, {
      params: { branchId, warehouseId },
    })
    return response.data
  },

  // Create production order
  createProductionOrder: async (
    branchId: number,
    data: ICreateProductionOrderDto
  ): Promise<IProductionOrder> => {
    const response = await api.post(BASE_URL, { branchId, ...data })
    return response.data
  },

  // Update production order (only PLANNED status)
  updateProductionOrder: async (
    id: number,
    data: IUpdateProductionOrderDto
  ): Promise<IProductionOrder> => {
    const response = await api.patch(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Delete production order (only PLANNED status)
  deleteProductionOrder: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`)
  },

  // Status actions

  // Start production (deducts ingredients from stock)
  startProduction: async (id: number): Promise<IProductionOrder> => {
    const response = await api.post(`${BASE_URL}/${id}/start`)
    return response.data
  },

  // Complete production (adds produced items to stock)
  completeProduction: async (
    id: number,
    data?: ICompleteProductionDto
  ): Promise<IProductionOrder> => {
    const response = await api.post(`${BASE_URL}/${id}/complete`, data || {})
    return response.data
  },

  // Cancel production (returns ingredients if already started)
  cancelProduction: async (id: number): Promise<IProductionOrder> => {
    const response = await api.post(`${BASE_URL}/${id}/cancel`)
    return response.data
  },

  // Check ingredient availability for a production order
  checkAvailability: async (
    id: number
  ): Promise<{
    canStart: boolean
    missingIngredients: Array<{
      inventoryItemId: number
      inventoryItemName: string
      required: number
      available: number
      shortage: number
    }>
  }> => {
    const response = await api.get(`${BASE_URL}/${id}/availability`)
    return response.data
  },
}

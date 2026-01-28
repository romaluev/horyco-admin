/**
 * Production Order API Client
 * Based on /admin/inventory/production endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IProductionOrder,
  ICreateProductionOrderDto,
  IUpdateProductionOrderDto,
  IGetProductionOrdersParams,
  IStartProductionDto,
  ICompleteProductionDto,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const productionOrderApi = {
  /**
   * Get all production orders
   * GET /admin/inventory/production
   */
  async getProductionOrders(params?: IGetProductionOrdersParams): Promise<IProductionOrder[]> {
    const response = await api.get<ApiResponse<IProductionOrder[]> | IProductionOrder[]>(
      '/admin/inventory/production',
      { params }
    )
    const data = response.data
    if (Array.isArray(data)) return data
    return data.data || []
  },

  /**
   * Get production order by ID with ingredients
   * GET /admin/inventory/production/:id
   */
  async getProductionOrderById(id: number): Promise<IProductionOrder> {
    const response = await api.get<ApiResponse<IProductionOrder>>(
      `/admin/inventory/production/${id}`
    )
    return response.data.data
  },

  /**
   * Create production order
   * POST /admin/inventory/production
   */
  async createProductionOrder(data: ICreateProductionOrderDto): Promise<IProductionOrder> {
    const response = await api.post<ApiResponse<IProductionOrder>>(
      '/admin/inventory/production',
      data
    )
    return response.data.data
  },

  /**
   * Update production order (planned only)
   * PATCH /admin/inventory/production/:id
   */
  async updateProductionOrder(id: number, data: IUpdateProductionOrderDto): Promise<IProductionOrder> {
    const response = await api.patch<ApiResponse<IProductionOrder>>(
      `/admin/inventory/production/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete production order (planned only)
   * DELETE /admin/inventory/production/:id
   */
  async deleteProductionOrder(id: number): Promise<void> {
    await api.delete(`/admin/inventory/production/${id}`)
  },

  /**
   * Start production (deducts ingredients)
   * POST /admin/inventory/production/:id/start
   */
  async startProduction(id: number, data?: IStartProductionDto): Promise<IProductionOrder> {
    const response = await api.post<ApiResponse<IProductionOrder>>(
      `/admin/inventory/production/${id}/start`,
      data
    )
    return response.data.data
  },

  /**
   * Complete production (adds output to stock)
   * POST /admin/inventory/production/:id/complete
   */
  async completeProduction(id: number, data: ICompleteProductionDto): Promise<IProductionOrder> {
    const response = await api.post<ApiResponse<IProductionOrder>>(
      `/admin/inventory/production/${id}/complete`,
      data
    )
    return response.data.data
  },

  /**
   * Cancel production (reverses ingredient deductions if started)
   * POST /admin/inventory/production/:id/cancel
   */
  async cancelProduction(id: number): Promise<IProductionOrder> {
    const response = await api.post<ApiResponse<IProductionOrder>>(
      `/admin/inventory/production/${id}/cancel`
    )
    return response.data.data
  },
}

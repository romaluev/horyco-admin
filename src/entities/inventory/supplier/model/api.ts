/**
 * Supplier API Client
 * Based on /admin/inventory/suppliers endpoints
 */

import api from '@/shared/lib/axios'

import type {
  ISupplier,
  ISupplierItem,
  IPriceHistory,
  ICreateSupplierDto,
  IUpdateSupplierDto,
  IGetSuppliersParams,
  ICreateSupplierItemDto,
  IUpdateSupplierItemDto,
  IGetPriceHistoryParams,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const supplierApi = {
  /**
   * Get all suppliers
   * GET /admin/inventory/suppliers
   */
  async getSuppliers(params?: IGetSuppliersParams): Promise<ISupplier[]> {
    const response = await api.get<ApiResponse<ISupplier[]> | ISupplier[]>(
      '/admin/inventory/suppliers',
      { params }
    )
    const data = response.data
    if (Array.isArray(data)) {
      return data
    }
    return data.data || []
  },

  /**
   * Get supplier by ID with items
   * GET /admin/inventory/suppliers/:id
   */
  async getSupplierById(id: number): Promise<ISupplier> {
    const response = await api.get<ApiResponse<ISupplier>>(
      `/admin/inventory/suppliers/${id}`
    )
    return response.data.data
  },

  /**
   * Create supplier
   * POST /admin/inventory/suppliers
   */
  async createSupplier(data: ICreateSupplierDto): Promise<ISupplier> {
    const response = await api.post<ApiResponse<ISupplier>>(
      '/admin/inventory/suppliers',
      data
    )
    return response.data.data
  },

  /**
   * Update supplier
   * PATCH /admin/inventory/suppliers/:id
   */
  async updateSupplier(id: number, data: IUpdateSupplierDto): Promise<ISupplier> {
    const response = await api.patch<ApiResponse<ISupplier>>(
      `/admin/inventory/suppliers/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete supplier
   * DELETE /admin/inventory/suppliers/:id
   */
  async deleteSupplier(id: number): Promise<void> {
    await api.delete(`/admin/inventory/suppliers/${id}`)
  },

  /**
   * Activate supplier
   * POST /admin/inventory/suppliers/:id/activate
   */
  async activateSupplier(id: number): Promise<ISupplier> {
    const response = await api.post<ApiResponse<ISupplier>>(
      `/admin/inventory/suppliers/${id}/activate`
    )
    return response.data.data
  },

  /**
   * Deactivate supplier
   * POST /admin/inventory/suppliers/:id/deactivate
   */
  async deactivateSupplier(id: number): Promise<ISupplier> {
    const response = await api.post<ApiResponse<ISupplier>>(
      `/admin/inventory/suppliers/${id}/deactivate`
    )
    return response.data.data
  },

  /**
   * Get supplier items catalog
   * GET /admin/inventory/suppliers/:id/items
   */
  async getSupplierItems(id: number): Promise<ISupplierItem[]> {
    const response = await api.get<ApiResponse<ISupplierItem[]>>(
      `/admin/inventory/suppliers/${id}/items`
    )
    return response.data.data
  },

  /**
   * Add item to supplier catalog
   * POST /admin/inventory/suppliers/:id/items
   */
  async addSupplierItem(id: number, data: ICreateSupplierItemDto): Promise<ISupplierItem> {
    const response = await api.post<ApiResponse<ISupplierItem>>(
      `/admin/inventory/suppliers/${id}/items`,
      data
    )
    return response.data.data
  },

  /**
   * Update supplier item
   * PATCH /admin/inventory/suppliers/:id/items/:itemId
   */
  async updateSupplierItem(
    supplierId: number,
    itemId: number,
    data: IUpdateSupplierItemDto
  ): Promise<ISupplierItem> {
    const response = await api.patch<ApiResponse<ISupplierItem>>(
      `/admin/inventory/suppliers/${supplierId}/items/${itemId}`,
      data
    )
    return response.data.data
  },

  /**
   * Remove item from supplier catalog
   * DELETE /admin/inventory/suppliers/:id/items/:itemId
   */
  async removeSupplierItem(supplierId: number, itemId: number): Promise<void> {
    await api.delete(`/admin/inventory/suppliers/${supplierId}/items/${itemId}`)
  },

  /**
   * Get price history for supplier
   * GET /admin/inventory/suppliers/:id/price-history
   */
  async getPriceHistory(id: number, params?: IGetPriceHistoryParams): Promise<IPriceHistory[]> {
    const response = await api.get<ApiResponse<IPriceHistory[]>>(
      `/admin/inventory/suppliers/${id}/price-history`,
      { params }
    )
    return response.data.data
  },
}

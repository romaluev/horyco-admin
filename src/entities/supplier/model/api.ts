/**
 * Supplier API Client
 * Based on /api/admin/inventory/suppliers endpoints
 */

import api from '@/shared/lib/axios'

import type {
  ISupplier,
  ISuppliersResponse,
  ICreateSupplierDto,
  IUpdateSupplierDto,
  IGetSuppliersParams,
  ISupplierItem,
  ICreateSupplierItemDto,
  IUpdateSupplierItemDto,
  ISupplierPriceHistory,
  IGetPriceHistoryParams,
  IPriceHistoryResponse,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const supplierApi = {
  /**
   * Get all suppliers with filters
   * GET /admin/inventory/suppliers
   */
  async getSuppliers(params?: IGetSuppliersParams): Promise<ISuppliersResponse> {
    const response = await api.get<ApiResponse<ISuppliersResponse>>(
      '/admin/inventory/suppliers',
      { params }
    )
    return response.data.data
  },

  /**
   * Get supplier by ID
   * GET /admin/inventory/suppliers/:id
   */
  async getSupplierById(id: number): Promise<ISupplier> {
    const response = await api.get<ApiResponse<ISupplier>>(
      `/admin/inventory/suppliers/${id}`
    )
    return response.data.data
  },

  /**
   * Create new supplier
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

  // ===== Supplier Items =====

  /**
   * Get supplier items
   * GET /admin/inventory/suppliers/:id/items
   */
  async getSupplierItems(supplierId: number): Promise<ISupplierItem[]> {
    const response = await api.get<ApiResponse<ISupplierItem[]>>(
      `/admin/inventory/suppliers/${supplierId}/items`
    )
    return response.data.data
  },

  /**
   * Add item to supplier
   * POST /admin/inventory/suppliers/:id/items
   */
  async addSupplierItem(
    supplierId: number,
    data: ICreateSupplierItemDto
  ): Promise<ISupplierItem> {
    const response = await api.post<ApiResponse<ISupplierItem>>(
      `/admin/inventory/suppliers/${supplierId}/items`,
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
   * Remove item from supplier
   * DELETE /admin/inventory/suppliers/:id/items/:itemId
   */
  async removeSupplierItem(supplierId: number, itemId: number): Promise<void> {
    await api.delete(`/admin/inventory/suppliers/${supplierId}/items/${itemId}`)
  },

  // ===== Price History =====

  /**
   * Get price history for supplier
   * GET /admin/inventory/suppliers/:id/price-history
   */
  async getPriceHistory(
    supplierId: number,
    params?: IGetPriceHistoryParams
  ): Promise<IPriceHistoryResponse> {
    const response = await api.get<ApiResponse<IPriceHistoryResponse>>(
      `/admin/inventory/suppliers/${supplierId}/price-history`,
      { params }
    )
    return response.data.data
  },
}

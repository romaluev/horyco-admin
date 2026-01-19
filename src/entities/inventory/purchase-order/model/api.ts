/**
 * Purchase Order API Client
 * Based on /admin/inventory/purchase-orders endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IPurchaseOrder,
  ICreatePurchaseOrderDto,
  IUpdatePurchaseOrderDto,
  IGetPurchaseOrdersParams,
  ICreatePOItemDto,
  IUpdatePOItemDto,
  IReceivePODto,
  ICancelPODto,
  IPurchaseOrderItem,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const purchaseOrderApi = {
  /**
   * Get all purchase orders
   * GET /admin/inventory/purchase-orders
   */
  async getPurchaseOrders(params?: IGetPurchaseOrdersParams): Promise<IPurchaseOrder[]> {
    const response = await api.get<ApiResponse<IPurchaseOrder[]> | IPurchaseOrder[]>(
      '/admin/inventory/purchase-orders',
      { params }
    )
    const data = response.data
    if (Array.isArray(data)) return data
    return data.data || []
  },

  /**
   * Get purchase order by ID with items and receives
   * GET /admin/inventory/purchase-orders/:id
   */
  async getPurchaseOrderById(id: number): Promise<IPurchaseOrder> {
    const response = await api.get<ApiResponse<IPurchaseOrder>>(
      `/admin/inventory/purchase-orders/${id}`
    )
    return response.data.data
  },

  /**
   * Create purchase order
   * POST /admin/inventory/purchase-orders
   */
  async createPurchaseOrder(data: ICreatePurchaseOrderDto): Promise<IPurchaseOrder> {
    const response = await api.post<ApiResponse<IPurchaseOrder>>(
      '/admin/inventory/purchase-orders',
      data
    )
    return response.data.data
  },

  /**
   * Update purchase order (draft only)
   * PATCH /admin/inventory/purchase-orders/:id
   */
  async updatePurchaseOrder(id: number, data: IUpdatePurchaseOrderDto): Promise<IPurchaseOrder> {
    const response = await api.patch<ApiResponse<IPurchaseOrder>>(
      `/admin/inventory/purchase-orders/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete purchase order (draft only)
   * DELETE /admin/inventory/purchase-orders/:id
   */
  async deletePurchaseOrder(id: number): Promise<void> {
    await api.delete(`/admin/inventory/purchase-orders/${id}`)
  },

  /**
   * Add item to purchase order
   * POST /admin/inventory/purchase-orders/:id/items
   */
  async addItem(id: number, data: ICreatePOItemDto): Promise<IPurchaseOrderItem> {
    const response = await api.post<ApiResponse<IPurchaseOrderItem>>(
      `/admin/inventory/purchase-orders/${id}/items`,
      data
    )
    return response.data.data
  },

  /**
   * Update purchase order item
   * PATCH /admin/inventory/purchase-orders/:id/items/:poItemId
   */
  async updateItem(id: number, poItemId: number, data: IUpdatePOItemDto): Promise<IPurchaseOrderItem> {
    const response = await api.patch<ApiResponse<IPurchaseOrderItem>>(
      `/admin/inventory/purchase-orders/${id}/items/${poItemId}`,
      data
    )
    return response.data.data
  },

  /**
   * Remove item from purchase order
   * DELETE /admin/inventory/purchase-orders/:id/items/:poItemId
   */
  async removeItem(id: number, poItemId: number): Promise<void> {
    await api.delete(`/admin/inventory/purchase-orders/${id}/items/${poItemId}`)
  },

  /**
   * Send purchase order to supplier
   * POST /admin/inventory/purchase-orders/:id/send
   */
  async sendPurchaseOrder(id: number): Promise<IPurchaseOrder> {
    const response = await api.post<ApiResponse<IPurchaseOrder>>(
      `/admin/inventory/purchase-orders/${id}/send`
    )
    return response.data.data
  },

  /**
   * Receive items from purchase order
   * POST /admin/inventory/purchase-orders/:id/receive
   */
  async receivePurchaseOrder(id: number, data: IReceivePODto): Promise<IPurchaseOrder> {
    const response = await api.post<ApiResponse<IPurchaseOrder>>(
      `/admin/inventory/purchase-orders/${id}/receive`,
      data
    )
    return response.data.data
  },

  /**
   * Cancel purchase order
   * POST /admin/inventory/purchase-orders/:id/cancel
   */
  async cancelPurchaseOrder(id: number, data: ICancelPODto): Promise<IPurchaseOrder> {
    const response = await api.post<ApiResponse<IPurchaseOrder>>(
      `/admin/inventory/purchase-orders/${id}/cancel`,
      data
    )
    return response.data.data
  },
}

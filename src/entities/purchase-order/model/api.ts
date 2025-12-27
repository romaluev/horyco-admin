/**
 * Purchase Order API Client
 * Based on /api/admin/inventory/purchase-orders endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IPurchaseOrder,
  IPurchaseOrdersResponse,
  ICreatePurchaseOrderDto,
  IUpdatePurchaseOrderDto,
  IGetPurchaseOrdersParams,
  IPurchaseOrderItem,
  ICreatePOItemDto,
  IUpdatePOItemDto,
  IReceivePODto,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const purchaseOrderApi = {
  /**
   * Get all purchase orders with filters
   * GET /admin/inventory/purchase-orders
   */
  async getPurchaseOrders(
    params?: IGetPurchaseOrdersParams
  ): Promise<IPurchaseOrdersResponse> {
    const response = await api.get<ApiResponse<IPurchaseOrdersResponse>>(
      '/admin/inventory/purchase-orders',
      { params }
    )
    return response.data.data
  },

  /**
   * Get purchase order by ID
   * GET /admin/inventory/purchase-orders/:id
   */
  async getPurchaseOrderById(id: number): Promise<IPurchaseOrder> {
    const response = await api.get<ApiResponse<IPurchaseOrder>>(
      `/admin/inventory/purchase-orders/${id}`
    )
    return response.data.data
  },

  /**
   * Create new purchase order
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
   * Update draft purchase order
   * PATCH /admin/inventory/purchase-orders/:id
   */
  async updatePurchaseOrder(
    id: number,
    data: IUpdatePurchaseOrderDto
  ): Promise<IPurchaseOrder> {
    const response = await api.patch<ApiResponse<IPurchaseOrder>>(
      `/admin/inventory/purchase-orders/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete draft purchase order
   * DELETE /admin/inventory/purchase-orders/:id
   */
  async deletePurchaseOrder(id: number): Promise<void> {
    await api.delete(`/admin/inventory/purchase-orders/${id}`)
  },

  // ===== PO Items =====

  /**
   * Add item to purchase order
   * POST /admin/inventory/purchase-orders/:id/items
   */
  async addItem(poId: number, data: ICreatePOItemDto): Promise<IPurchaseOrderItem> {
    const response = await api.post<ApiResponse<IPurchaseOrderItem>>(
      `/admin/inventory/purchase-orders/${poId}/items`,
      data
    )
    return response.data.data
  },

  /**
   * Update purchase order item
   * PATCH /admin/inventory/purchase-orders/:id/items/:itemId
   */
  async updateItem(
    poId: number,
    itemId: number,
    data: IUpdatePOItemDto
  ): Promise<IPurchaseOrderItem> {
    const response = await api.patch<ApiResponse<IPurchaseOrderItem>>(
      `/admin/inventory/purchase-orders/${poId}/items/${itemId}`,
      data
    )
    return response.data.data
  },

  /**
   * Remove item from purchase order
   * DELETE /admin/inventory/purchase-orders/:id/items/:itemId
   */
  async removeItem(poId: number, itemId: number): Promise<void> {
    await api.delete(`/admin/inventory/purchase-orders/${poId}/items/${itemId}`)
  },

  // ===== Status Actions =====

  /**
   * Send purchase order to supplier
   * POST /admin/inventory/purchase-orders/:id/send
   */
  async sendToSupplier(id: number): Promise<IPurchaseOrder> {
    const response = await api.post<ApiResponse<IPurchaseOrder>>(
      `/admin/inventory/purchase-orders/${id}/send`
    )
    return response.data.data
  },

  /**
   * Receive items for purchase order
   * POST /admin/inventory/purchase-orders/:id/receive
   */
  async receiveItems(id: number, data: IReceivePODto): Promise<IPurchaseOrder> {
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
  async cancelPurchaseOrder(id: number): Promise<IPurchaseOrder> {
    const response = await api.post<ApiResponse<IPurchaseOrder>>(
      `/admin/inventory/purchase-orders/${id}/cancel`
    )
    return response.data.data
  },
}

/**
 * Writeoff API Client
 * Based on /admin/inventory/writeoffs endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IWriteoff,
  IWriteoffItem,
  ICreateWriteoffDto,
  IUpdateWriteoffDto,
  IGetWriteoffsParams,
  ICreateWriteoffItemDto,
  IUpdateWriteoffItemDto,
  IRejectWriteoffDto,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const writeoffApi = {
  /**
   * Get all writeoffs
   * GET /admin/inventory/writeoffs
   */
  async getWriteoffs(params?: IGetWriteoffsParams): Promise<IWriteoff[]> {
    const response = await api.get<ApiResponse<IWriteoff[]> | IWriteoff[]>(
      '/admin/inventory/writeoffs',
      { params }
    )
    const data = response.data
    if (Array.isArray(data)) return data
    return data.data || []
  },

  /**
   * Get writeoff by ID with items
   * GET /admin/inventory/writeoffs/:id
   */
  async getWriteoffById(id: number): Promise<IWriteoff> {
    const response = await api.get<ApiResponse<IWriteoff>>(
      `/admin/inventory/writeoffs/${id}`
    )
    return response.data.data
  },

  /**
   * Create writeoff
   * POST /admin/inventory/writeoffs
   */
  async createWriteoff(data: ICreateWriteoffDto): Promise<IWriteoff> {
    const response = await api.post<ApiResponse<IWriteoff>>(
      '/admin/inventory/writeoffs',
      data
    )
    return response.data.data
  },

  /**
   * Update writeoff (draft only)
   * PATCH /admin/inventory/writeoffs/:id
   */
  async updateWriteoff(
    id: number,
    data: IUpdateWriteoffDto
  ): Promise<IWriteoff> {
    const response = await api.patch<ApiResponse<IWriteoff>>(
      `/admin/inventory/writeoffs/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete writeoff (draft only)
   * DELETE /admin/inventory/writeoffs/:id
   */
  async deleteWriteoff(id: number): Promise<void> {
    await api.delete(`/admin/inventory/writeoffs/${id}`)
  },

  /**
   * Add item to writeoff
   * POST /admin/inventory/writeoffs/:id/items
   */
  async addItem(
    id: number,
    data: ICreateWriteoffItemDto
  ): Promise<IWriteoffItem> {
    const response = await api.post<ApiResponse<IWriteoffItem>>(
      `/admin/inventory/writeoffs/${id}/items`,
      data
    )
    return response.data.data
  },

  /**
   * Update writeoff item
   * PATCH /admin/inventory/writeoffs/:id/items/:itemId
   */
  async updateItem(
    writeoffId: number,
    itemId: number,
    data: IUpdateWriteoffItemDto
  ): Promise<IWriteoffItem> {
    const response = await api.patch<ApiResponse<IWriteoffItem>>(
      `/admin/inventory/writeoffs/${writeoffId}/items/${itemId}`,
      data
    )
    return response.data.data
  },

  /**
   * Remove item from writeoff
   * DELETE /admin/inventory/writeoffs/:id/items/:itemId
   */
  async removeItem(writeoffId: number, itemId: number): Promise<void> {
    await api.delete(`/admin/inventory/writeoffs/${writeoffId}/items/${itemId}`)
  },

  /**
   * Submit writeoff for approval
   * POST /admin/inventory/writeoffs/:id/submit
   */
  async submitWriteoff(id: number): Promise<IWriteoff> {
    const response = await api.post<ApiResponse<IWriteoff>>(
      `/admin/inventory/writeoffs/${id}/submit`
    )
    return response.data.data
  },

  /**
   * Approve writeoff
   * POST /admin/inventory/writeoffs/:id/approve
   */
  async approveWriteoff(id: number): Promise<IWriteoff> {
    const response = await api.post<ApiResponse<IWriteoff>>(
      `/admin/inventory/writeoffs/${id}/approve`
    )
    return response.data.data
  },

  /**
   * Reject writeoff
   * POST /admin/inventory/writeoffs/:id/reject
   */
  async rejectWriteoff(
    id: number,
    data: IRejectWriteoffDto
  ): Promise<IWriteoff> {
    const response = await api.post<ApiResponse<IWriteoff>>(
      `/admin/inventory/writeoffs/${id}/reject`,
      data
    )
    return response.data.data
  },
}

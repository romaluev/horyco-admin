/**
 * Writeoff API
 * REST API client for writeoff operations
 */

import api from '@/shared/lib/axios'
import type {
  IWriteoff,
  IWriteoffListItem,
  ICreateWriteoffDto,
  IUpdateWriteoffDto,
  IAddWriteoffItemDto,
  IUpdateWriteoffItemDto,
  IWriteoffListParams,
  IRejectWriteoffDto,
} from './types'

const BASE_URL = '/admin/inventory/writeoffs'

export const writeoffApi = {
  // List writeoffs
  getWriteoffs: async (
    branchId: number,
    params?: IWriteoffListParams
  ): Promise<{ data: IWriteoffListItem[]; total: number }> => {
    const response = await api.get(BASE_URL, {
      params: { branchId, ...params },
    })
    return response.data
  },

  // Get single writeoff with items
  getWriteoffById: async (id: number): Promise<IWriteoff> => {
    const response = await api.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Create writeoff
  createWriteoff: async (
    branchId: number,
    data: ICreateWriteoffDto
  ): Promise<IWriteoff> => {
    const response = await api.post(BASE_URL, { branchId, ...data })
    return response.data
  },

  // Update writeoff (only in DRAFT status)
  updateWriteoff: async (
    id: number,
    data: IUpdateWriteoffDto
  ): Promise<IWriteoff> => {
    const response = await api.patch(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Delete writeoff (only in DRAFT status)
  deleteWriteoff: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`)
  },

  // Item management

  // Add item to writeoff
  addItem: async (
    writeoffId: number,
    data: IAddWriteoffItemDto
  ): Promise<IWriteoff> => {
    const response = await api.post(`${BASE_URL}/${writeoffId}/items`, data)
    return response.data
  },

  // Update item in writeoff
  updateItem: async (
    writeoffId: number,
    itemId: number,
    data: IUpdateWriteoffItemDto
  ): Promise<IWriteoff> => {
    const response = await api.patch(
      `${BASE_URL}/${writeoffId}/items/${itemId}`,
      data
    )
    return response.data
  },

  // Remove item from writeoff
  removeItem: async (writeoffId: number, itemId: number): Promise<IWriteoff> => {
    const response = await api.delete(
      `${BASE_URL}/${writeoffId}/items/${itemId}`
    )
    return response.data
  },

  // Status actions

  // Submit writeoff for approval
  submitForApproval: async (id: number): Promise<IWriteoff> => {
    const response = await api.post(`${BASE_URL}/${id}/submit`)
    return response.data
  },

  // Approve writeoff (deducts from stock)
  approveWriteoff: async (id: number): Promise<IWriteoff> => {
    const response = await api.post(`${BASE_URL}/${id}/approve`)
    return response.data
  },

  // Reject writeoff
  rejectWriteoff: async (
    id: number,
    data: IRejectWriteoffDto
  ): Promise<IWriteoff> => {
    const response = await api.post(`${BASE_URL}/${id}/reject`, data)
    return response.data
  },
}

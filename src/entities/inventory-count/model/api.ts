/**
 * Inventory Count API
 * REST API client for inventory counting operations
 */

import api from '@/shared/lib/axios'
import type {
  IInventoryCount,
  IInventoryCountListItem,
  ICreateCountDto,
  IUpdateCountDto,
  ICountItemDto,
  ICountListParams,
  IRejectCountDto,
  ICountVarianceSummary,
} from './types'

const BASE_URL = '/api/admin/inventory/counts'

export const inventoryCountApi = {
  // List inventory counts
  getCounts: async (
    branchId: number,
    params?: ICountListParams
  ): Promise<{ data: IInventoryCountListItem[]; total: number }> => {
    const response = await api.get(BASE_URL, {
      params: { branchId, ...params },
    })
    return response.data
  },

  // Get single count with items
  getCountById: async (id: number): Promise<IInventoryCount> => {
    const response = await api.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Get variance summary for a count
  getVarianceSummary: async (id: number): Promise<ICountVarianceSummary> => {
    const response = await api.get(`${BASE_URL}/${id}/variance`)
    return response.data
  },

  // Create inventory count
  createCount: async (
    branchId: number,
    data: ICreateCountDto
  ): Promise<IInventoryCount> => {
    const response = await api.post(BASE_URL, { branchId, ...data })
    return response.data
  },

  // Update count (only metadata, not items)
  updateCount: async (
    id: number,
    data: IUpdateCountDto
  ): Promise<IInventoryCount> => {
    const response = await api.patch(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Delete count (only in IN_PROGRESS status)
  deleteCount: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`)
  },

  // Item counting

  // Record count for an item
  countItem: async (
    countId: number,
    itemId: number,
    data: ICountItemDto
  ): Promise<IInventoryCount> => {
    const response = await api.post(
      `${BASE_URL}/${countId}/items/${itemId}/count`,
      data
    )
    return response.data
  },

  // Clear count for an item (set back to null)
  clearItemCount: async (
    countId: number,
    itemId: number
  ): Promise<IInventoryCount> => {
    const response = await api.delete(
      `${BASE_URL}/${countId}/items/${itemId}/count`
    )
    return response.data
  },

  // Status actions

  // Start counting (move from initial to IN_PROGRESS)
  startCount: async (id: number): Promise<IInventoryCount> => {
    const response = await api.post(`${BASE_URL}/${id}/start`)
    return response.data
  },

  // Complete counting (all items counted)
  completeCount: async (id: number): Promise<IInventoryCount> => {
    const response = await api.post(`${BASE_URL}/${id}/complete`)
    return response.data
  },

  // Submit for approval
  submitForApproval: async (id: number): Promise<IInventoryCount> => {
    const response = await api.post(`${BASE_URL}/${id}/submit`)
    return response.data
  },

  // Approve count (applies adjustments to stock)
  approveCount: async (id: number): Promise<IInventoryCount> => {
    const response = await api.post(`${BASE_URL}/${id}/approve`)
    return response.data
  },

  // Reject count
  rejectCount: async (
    id: number,
    data: IRejectCountDto
  ): Promise<IInventoryCount> => {
    const response = await api.post(`${BASE_URL}/${id}/reject`, data)
    return response.data
  },

  // Cancel count
  cancelCount: async (id: number): Promise<IInventoryCount> => {
    const response = await api.post(`${BASE_URL}/${id}/cancel`)
    return response.data
  },
}

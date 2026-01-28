import api from '@/shared/lib/axios'

import type {
  IHall,
  ICreateHallDto,
  IUpdateHallDto,
  ICanDeleteHallResponse,
} from './types'

export const hallApi = {
  /**
   * Get all halls for a branch
   */
  async getHalls(branchId: number): Promise<IHall[]> {
    const response = await api.get<{ success: boolean; data: IHall[] }>(
      `/admin/branches/${branchId}/halls`
    )
    return response.data.data || []
  },

  /**
   * Get hall by ID
   */
  async getHallById(id: number): Promise<IHall> {
    const response = await api.get<{ success: boolean; data: IHall }>(
      `/admin/halls/${id}`
    )
    return response.data.data
  },

  /**
   * Create a new hall
   */
  async createHall(data: ICreateHallDto): Promise<IHall> {
    const response = await api.post<{ success: boolean; data: IHall }>(
      `/admin/branches/${data.branchId}/halls`,
      data
    )
    return response.data.data
  },

  /**
   * Update a hall
   */
  async updateHall(id: number, data: IUpdateHallDto): Promise<IHall> {
    const response = await api.put<{ success: boolean; data: IHall }>(
      `/admin/halls/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete a hall
   */
  async deleteHall(id: number): Promise<void> {
    await api.delete(`/admin/halls/${id}`)
  },

  /**
   * Check if hall can be deleted
   */
  async canDeleteHall(id: number): Promise<ICanDeleteHallResponse> {
    const response = await api.get<{
      success: boolean
      data: ICanDeleteHallResponse
    }>(`/admin/halls/${id}/can-delete`)
    return response.data.data
  },
}

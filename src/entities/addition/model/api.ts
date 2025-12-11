/**
 * Addition API Client
 * Based on /admin/menu/additions endpoints from ADMIN_MENU_MANAGEMENT.md
 */

import api from '@/shared/lib/axios'

import type {
  IAddition,
  ICreateAdditionDto,
  IUpdateAdditionDto,
  IGetAdditionsParams,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const additionApi = {
  // ===== Additions =====

  /**
   * Get all additions with optional filters
   * GET /admin/menu/additions
   */
  async getAdditions(params?: IGetAdditionsParams): Promise<IAddition[]> {
    const response = await api.get<ApiResponse<IAddition[]>>(
      '/admin/menu/additions',
      { params }
    )
    return response.data.data
  },

  /**
   * Get addition by ID
   * GET /admin/menu/additions/:id
   */
  async getAdditionById(id: number): Promise<IAddition> {
    const response = await api.get<ApiResponse<IAddition>>(
      `/admin/menu/additions/${id}`
    )
    return response.data.data
  },

  /**
   * Create new addition
   * POST /admin/menu/additions
   */
  async createAddition(data: ICreateAdditionDto): Promise<IAddition> {
    const response = await api.post<ApiResponse<IAddition>>(
      '/admin/menu/additions',
      data
    )
    return response.data.data
  },

  /**
   * Update addition
   * PATCH /admin/menu/additions/:id
   */
  async updateAddition(
    id: number,
    data: IUpdateAdditionDto
  ): Promise<IAddition> {
    const response = await api.patch<ApiResponse<IAddition>>(
      `/admin/menu/additions/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete addition
   * DELETE /admin/menu/additions/:id
   */
  async deleteAddition(id: number): Promise<void> {
    await api.delete(`/admin/menu/additions/${id}`)
  },
}

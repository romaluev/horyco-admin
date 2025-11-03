/**
 * Modifier API Client
 * Based on /admin/menu/modifiers endpoints from ADMIN_MENU_MANAGEMENT.md
 */

import api from '@/shared/lib/axios'

import type {
  IModifier,
  ICreateModifierDto,
  IUpdateModifierDto,
  IGetModifiersParams,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const modifierApi = {
  // ===== Modifiers =====

  /**
   * Get all modifiers with optional filters
   * GET /admin/menu/modifiers
   */
  async getModifiers(params?: IGetModifiersParams): Promise<IModifier[]> {
    const response = await api.get<ApiResponse<IModifier[]>>(
      '/admin/menu/modifiers',
      { params }
    )
    return response.data.data
  },

  /**
   * Get modifier by ID
   * GET /admin/menu/modifiers/:id
   */
  async getModifierById(id: number): Promise<IModifier> {
    const response = await api.get<ApiResponse<IModifier>>(
      `/admin/menu/modifiers/${id}`
    )
    return response.data.data
  },

  /**
   * Create new modifier
   * POST /admin/menu/modifiers
   */
  async createModifier(data: ICreateModifierDto): Promise<IModifier> {
    const response = await api.post<ApiResponse<IModifier>>(
      '/admin/menu/modifiers',
      data
    )
    return response.data.data
  },

  /**
   * Update modifier
   * PATCH /admin/menu/modifiers/:id
   */
  async updateModifier(
    id: number,
    data: IUpdateModifierDto
  ): Promise<IModifier> {
    const response = await api.patch<ApiResponse<IModifier>>(
      `/admin/menu/modifiers/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete modifier
   * DELETE /admin/menu/modifiers/:id
   */
  async deleteModifier(id: number): Promise<void> {
    await api.delete(`/admin/menu/modifiers/${id}`)
  },
}

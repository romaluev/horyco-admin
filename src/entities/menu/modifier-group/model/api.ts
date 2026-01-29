/**
 * Modifier Group API Client
 * Based on /admin/menu/modifier-groups endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IModifierGroup,
  IModifier,
  ICreateModifierGroupDto,
  IUpdateModifierGroupDto,
  IGetModifierGroupsParams,
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

export const modifierGroupApi = {
  /**
   * Get all modifier groups
   * GET /admin/menu/modifier-groups
   */
  async getModifierGroups(
    params?: IGetModifierGroupsParams
  ): Promise<IModifierGroup[]> {
    const response = await api.get<ApiResponse<IModifierGroup[]>>(
      '/admin/menu/modifier-groups',
      { params }
    )
    return response.data.data
  },

  /**
   * Get modifier group with modifiers
   * GET /admin/menu/modifier-groups/:id
   */
  async getModifierGroupById(id: number): Promise<IModifierGroup> {
    const response = await api.get<ApiResponse<IModifierGroup>>(
      `/admin/menu/modifier-groups/${id}`
    )
    return response.data.data
  },

  /**
   * Create modifier group
   * POST /admin/menu/modifier-groups
   */
  async createModifierGroup(
    data: ICreateModifierGroupDto
  ): Promise<IModifierGroup> {
    const response = await api.post<ApiResponse<IModifierGroup>>(
      '/admin/menu/modifier-groups',
      data
    )
    return response.data.data
  },

  /**
   * Update modifier group
   * PATCH /admin/menu/modifier-groups/:id
   */
  async updateModifierGroup(
    id: number,
    data: IUpdateModifierGroupDto
  ): Promise<IModifierGroup> {
    const response = await api.patch<ApiResponse<IModifierGroup>>(
      `/admin/menu/modifier-groups/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete modifier group
   * DELETE /admin/menu/modifier-groups/:id
   */
  async deleteModifierGroup(id: number): Promise<void> {
    await api.delete(`/admin/menu/modifier-groups/${id}`)
  },

  /**
   * Get modifier groups for product
   * GET /admin/menu/products/:productId/modifier-groups
   */
  async getProductModifierGroups(productId: number): Promise<IModifierGroup[]> {
    const response = await api.get<ApiResponse<IModifierGroup[]>>(
      `/admin/menu/products/${productId}/modifier-groups`
    )
    return response.data.data
  },

  /**
   * Attach modifier group to product (RECOMMENDED)
   * POST /admin/menu/products/:productId/attach-modifier-group
   * Body: { "groupId": number }
   */
  async attachModifierGroupToProduct(
    productId: number,
    groupId: number
  ): Promise<void> {
    await api.post(`/admin/menu/products/${productId}/attach-modifier-group`, {
      groupId,
    })
  },

  /**
   * Detach modifier group from product (RECOMMENDED)
   * DELETE /admin/menu/products/:productId/detach-modifier-group
   * Body: { "groupId": number }
   */
  async detachModifierGroupFromProduct(
    productId: number,
    groupId: number
  ): Promise<void> {
    await api.delete(
      `/admin/menu/products/${productId}/detach-modifier-group`,
      { data: { groupId } }
    )
  },

  // ===== Modifiers =====

  /**
   * Get all modifiers
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
   * Create modifier
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

  /**
   * Reorder modifiers within group
   * PATCH /admin/menu/modifier-groups/:groupId/modifiers/reorder
   * Body: { "modifierIds": number[] }
   */
  async reorderModifiers(
    groupId: number,
    modifierIds: number[]
  ): Promise<void> {
    await api.patch(
      `/admin/menu/modifier-groups/${groupId}/modifiers/reorder`,
      { modifierIds }
    )
  },
}

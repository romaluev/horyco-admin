/**
 * Branch Override API
 * API client for branch-specific product overrides
 * Based on /admin/menu/products/:id/branches endpoints from ADMIN_MENU_MANAGEMENT.md
 */

import api from '@/shared/lib/axios'

import type { IBranchOverride, IUpsertBranchOverrideDto } from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

/**
 * Branch override API client
 * Per docs: Branch overrides are managed through product and branch-specific endpoints
 */
export const branchOverrideApi = {
  /**
   * GET /admin/menu/products/:id/branches
   * Get all branch overrides for a specific product
   */
  async getProductBranchOverrides(
    productId: number
  ): Promise<IBranchOverride[]> {
    const response = await api.get<ApiResponse<IBranchOverride[]>>(
      `/admin/menu/products/${productId}/branches`
    )
    return response.data.data
  },

  /**
   * GET /admin/menu/branches/:branchId/overrides
   * Get all product overrides for a specific branch
   */
  async getBranchOverrides(branchId: number): Promise<IBranchOverride[]> {
    const response = await api.get<ApiResponse<IBranchOverride[]>>(
      `/admin/menu/branches/${branchId}/overrides`
    )
    return response.data.data
  },

  /**
   * PUT /admin/menu/products/:id/branches/:branchId
   * Create or update branch override (upsert)
   * Setting a field to null means "use base product value"
   * Response codes: 201 Created (new), 200 OK (updated)
   */
  async upsertBranchOverride(
    productId: number,
    branchId: number,
    data: IUpsertBranchOverrideDto
  ): Promise<IBranchOverride> {
    const response = await api.put<ApiResponse<IBranchOverride>>(
      `/admin/menu/products/${productId}/branches/${branchId}`,
      data
    )
    return response.data.data
  },

  /**
   * DELETE /admin/menu/products/:id/branches/:branchId
   * Remove branch override (product will use base settings)
   */
  async deleteBranchOverride(
    productId: number,
    branchId: number
  ): Promise<void> {
    await api.delete(`/admin/menu/products/${productId}/branches/${branchId}`)
  },
}

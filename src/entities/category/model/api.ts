/**
 * Category API Client
 * Based on /admin/menu/categories endpoints from ADMIN_STAFF_MANAGEMENT.md
 */

import api from '@/shared/lib/axios'

import type {
  ICategory,
  ICreateCategoryDto,
  IUpdateCategoryDto,
  IReorderCategoriesDto,
  IGetCategoriesParams,
} from './types'

export const categoryApi = {
  /**
   * Get all categories with optional filters
   * GET /admin/menu/categories
   */
  async getCategories(params?: IGetCategoriesParams): Promise<ICategory[]> {
    const response = await api.get<{ data: ICategory[] }>(
      '/admin/menu/categories',
      { params }
    )
    return response.data.data || []
  },

  /**
   * Get category by ID
   * GET /admin/menu/categories/:id
   */
  async getCategoryById(id: number): Promise<ICategory> {
    const response = await api.get<ICategory>(`/admin/menu/categories/${id}`)
    return response.data
  },

  /**
   * Create new category
   * POST /admin/menu/categories
   */
  async createCategory(data: ICreateCategoryDto): Promise<ICategory> {
    const response = await api.post<ICategory>('/admin/menu/categories', data)
    return response.data
  },

  /**
   * Update existing category
   * PATCH /admin/menu/categories/:id
   */
  async updateCategory(
    id: number,
    data: IUpdateCategoryDto
  ): Promise<ICategory> {
    const response = await api.patch<ICategory>(
      `/admin/menu/categories/${id}`,
      data
    )
    return response.data
  },

  /**
   * Delete category
   * DELETE /admin/menu/categories/:id
   */
  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/admin/menu/categories/${id}`)
  },

  /**
   * Reorder categories
   * PATCH /admin/menu/categories/reorder
   */
  async reorderCategories(data: IReorderCategoriesDto): Promise<void> {
    await api.patch('/admin/menu/categories/reorder', data)
  },
}

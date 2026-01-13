/**
 * Recipe API Client
 * Based on /admin/inventory/recipes endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IRecipe,
  IRecipeIngredient,
  ICreateRecipeDto,
  IUpdateRecipeDto,
  IGetRecipesParams,
  ICreateRecipeIngredientDto,
  IUpdateRecipeIngredientDto,
  IDuplicateRecipeDto,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const recipeApi = {
  /**
   * Get all recipes
   * GET /admin/inventory/recipes
   */
  async getRecipes(params?: IGetRecipesParams): Promise<IRecipe[]> {
    const response = await api.get<ApiResponse<IRecipe[]> | IRecipe[]>(
      '/admin/inventory/recipes',
      { params }
    )
    const data = response.data
    if (Array.isArray(data)) {
      return data
    }
    return data.data || []
  },

  /**
   * Get recipe by ID with ingredients
   * GET /admin/inventory/recipes/:id
   */
  async getRecipeById(id: number): Promise<IRecipe> {
    const response = await api.get<ApiResponse<IRecipe>>(
      `/admin/inventory/recipes/${id}`
    )
    return response.data.data
  },

  /**
   * Create recipe
   * POST /admin/inventory/recipes
   */
  async createRecipe(data: ICreateRecipeDto): Promise<IRecipe> {
    const response = await api.post<ApiResponse<IRecipe>>(
      '/admin/inventory/recipes',
      data
    )
    return response.data.data
  },

  /**
   * Update recipe
   * PATCH /admin/inventory/recipes/:id
   */
  async updateRecipe(id: number, data: IUpdateRecipeDto): Promise<IRecipe> {
    const response = await api.patch<ApiResponse<IRecipe>>(
      `/admin/inventory/recipes/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete recipe
   * DELETE /admin/inventory/recipes/:id
   */
  async deleteRecipe(id: number): Promise<void> {
    await api.delete(`/admin/inventory/recipes/${id}`)
  },

  /**
   * Duplicate recipe
   * POST /admin/inventory/recipes/:id/duplicate
   */
  async duplicateRecipe(id: number, data: IDuplicateRecipeDto): Promise<IRecipe> {
    const response = await api.post<ApiResponse<IRecipe>>(
      `/admin/inventory/recipes/${id}/duplicate`,
      data
    )
    return response.data.data
  },

  /**
   * Recalculate recipe cost
   * POST /admin/inventory/recipes/:id/recalculate
   */
  async recalculateCost(id: number): Promise<IRecipe> {
    const response = await api.post<ApiResponse<IRecipe>>(
      `/admin/inventory/recipes/${id}/recalculate`
    )
    return response.data.data
  },

  /**
   * Get recipe ingredients
   * GET /admin/inventory/recipes/:id/ingredients
   */
  async getIngredients(id: number): Promise<IRecipeIngredient[]> {
    const response = await api.get<ApiResponse<IRecipeIngredient[]>>(
      `/admin/inventory/recipes/${id}/ingredients`
    )
    return response.data.data
  },

  /**
   * Add ingredient to recipe
   * POST /admin/inventory/recipes/:id/ingredients
   */
  async addIngredient(id: number, data: ICreateRecipeIngredientDto): Promise<IRecipeIngredient> {
    const response = await api.post<ApiResponse<IRecipeIngredient>>(
      `/admin/inventory/recipes/${id}/ingredients`,
      data
    )
    return response.data.data
  },

  /**
   * Update recipe ingredient
   * PATCH /admin/inventory/recipes/:id/ingredients/:ingredientId
   */
  async updateIngredient(
    recipeId: number,
    ingredientId: number,
    data: IUpdateRecipeIngredientDto
  ): Promise<IRecipeIngredient> {
    const response = await api.patch<ApiResponse<IRecipeIngredient>>(
      `/admin/inventory/recipes/${recipeId}/ingredients/${ingredientId}`,
      data
    )
    return response.data.data
  },

  /**
   * Remove ingredient from recipe
   * DELETE /admin/inventory/recipes/:id/ingredients/:ingredientId
   */
  async removeIngredient(recipeId: number, ingredientId: number): Promise<void> {
    await api.delete(`/admin/inventory/recipes/${recipeId}/ingredients/${ingredientId}`)
  },
}

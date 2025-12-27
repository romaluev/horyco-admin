/**
 * Recipe API Client
 * Based on /api/admin/inventory/recipes endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IRecipe,
  IRecipesResponse,
  ICreateRecipeDto,
  IUpdateRecipeDto,
  IGetRecipesParams,
  IRecipeIngredient,
  ICreateRecipeIngredientDto,
  IUpdateRecipeIngredientDto,
  IRecipeCostResult,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const recipeApi = {
  /**
   * Get all recipes with filters
   * GET /admin/inventory/recipes
   */
  async getRecipes(params?: IGetRecipesParams): Promise<IRecipesResponse> {
    const response = await api.get<ApiResponse<IRecipesResponse>>(
      '/admin/inventory/recipes',
      { params }
    )
    return response.data.data
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
   * Create new recipe
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
  async duplicateRecipe(id: number): Promise<IRecipe> {
    const response = await api.post<ApiResponse<IRecipe>>(
      `/admin/inventory/recipes/${id}/duplicate`
    )
    return response.data.data
  },

  /**
   * Recalculate recipe cost
   * POST /admin/inventory/recipes/:id/recalculate
   */
  async recalculateCost(id: number): Promise<IRecipeCostResult> {
    const response = await api.post<ApiResponse<IRecipeCostResult>>(
      `/admin/inventory/recipes/${id}/recalculate`
    )
    return response.data.data
  },

  // ===== Ingredients =====

  /**
   * Add ingredient to recipe
   * POST /admin/inventory/recipes/:id/ingredients
   */
  async addIngredient(
    recipeId: number,
    data: ICreateRecipeIngredientDto
  ): Promise<IRecipeIngredient> {
    const response = await api.post<ApiResponse<IRecipeIngredient>>(
      `/admin/inventory/recipes/${recipeId}/ingredients`,
      data
    )
    return response.data.data
  },

  /**
   * Update ingredient
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
    await api.delete(
      `/admin/inventory/recipes/${recipeId}/ingredients/${ingredientId}`
    )
  },
}

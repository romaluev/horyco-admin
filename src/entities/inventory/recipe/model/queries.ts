import { useQuery } from '@tanstack/react-query'

import { recipeApi } from './api'
import { recipeKeys } from './query-keys'

import type { IGetRecipesParams } from './types'

/**
 * Get all recipes
 */
export const useGetRecipes = (params?: IGetRecipesParams) => {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: () => recipeApi.getRecipes(params),
  })
}

// Alias
export const useRecipeList = useGetRecipes

/**
 * Get recipe by ID with ingredients
 */
export const useRecipeById = (id: number) => {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => recipeApi.getRecipeById(id),
    enabled: !!id,
  })
}

/**
 * Get recipe ingredients
 */
export const useRecipeIngredients = (id: number) => {
  return useQuery({
    queryKey: recipeKeys.ingredients(id),
    queryFn: () => recipeApi.getIngredients(id),
    enabled: !!id,
  })
}

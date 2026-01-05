/**
 * Recipe Query Hooks
 * TanStack React Query hooks for fetching recipe data
 */

import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'

import { recipeApi } from './api'
import { recipeKeys } from './query-keys'
import type { IRecipe, IRecipesResponse, IGetRecipesParams } from './types'

export const useGetRecipes = (
  params?: IGetRecipesParams,
  options?: Omit<UseQueryOptions<IRecipesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: () => recipeApi.getRecipes(params),
    ...options,
  })
}

export const useGetRecipeById = (
  id: number,
  options?: Omit<UseQueryOptions<IRecipe>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => recipeApi.getRecipeById(id),
    enabled: !!id,
    ...options,
  })
}

export const useGetRecipeByProduct = (
  productId: number,
  options?: Omit<UseQueryOptions<IRecipesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: recipeKeys.byProduct(productId),
    queryFn: () => recipeApi.getRecipes({ productId }),
    enabled: !!productId,
    ...options,
  })
}

export const useGetRecipeByModifier = (
  modifierId: number,
  options?: Omit<UseQueryOptions<IRecipesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: recipeKeys.byModifier(modifierId),
    queryFn: () => recipeApi.getRecipes({ modifierId }),
    enabled: !!modifierId,
    ...options,
  })
}

export const useGetRecipeByItem = (
  itemId: number,
  options?: Omit<UseQueryOptions<IRecipesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: recipeKeys.byItem(itemId),
    queryFn: () => recipeApi.getRecipes({ itemId }),
    enabled: !!itemId,
    ...options,
  })
}

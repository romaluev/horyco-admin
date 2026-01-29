import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { getErrorMessage } from '@/shared/lib/get-error-message'

import { recipeApi } from './api'
import { recipeKeys } from './query-keys'

import type {
  ICreateRecipeDto,
  IUpdateRecipeDto,
  ICreateRecipeIngredientDto,
  IUpdateRecipeIngredientDto,
  IDuplicateRecipeDto,
} from './types'

/**
 * Create recipe mutation
 */
export const useCreateRecipe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateRecipeDto) => recipeApi.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      toast.success('Техкарта создана')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при создании техкарты'))
    },
  })
}

/**
 * Update recipe mutation
 */
export const useUpdateRecipe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateRecipeDto }) =>
      recipeApi.updateRecipe(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) })
      toast.success('Техкарта обновлена')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при обновлении техкарты'))
    },
  })
}

/**
 * Delete recipe mutation
 */
export const useDeleteRecipe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => recipeApi.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      toast.success('Техкарта удалена')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при удалении техкарты'))
    },
  })
}

/**
 * Duplicate recipe mutation
 */
export const useDuplicateRecipe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IDuplicateRecipeDto }) =>
      recipeApi.duplicateRecipe(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      toast.success('Техкарта дублирована')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при дублировании техкарты'))
    },
  })
}

/**
 * Recalculate recipe cost mutation
 */
export const useRecalculateRecipeCost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => recipeApi.recalculateCost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) })
      toast.success('Себестоимость пересчитана')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при пересчете себестоимости'))
    },
  })
}

/**
 * Add ingredient to recipe mutation
 */
export const useAddRecipeIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: number
      data: ICreateRecipeIngredientDto
    }) => recipeApi.addIngredient(recipeId, data),
    onSuccess: (_, { recipeId }) => {
      queryClient.invalidateQueries({
        queryKey: recipeKeys.ingredients(recipeId),
      })
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(recipeId) })
      toast.success('Ингредиент добавлен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при добавлении ингредиента'))
    },
  })
}

/**
 * Update recipe ingredient mutation
 */
export const useUpdateRecipeIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
      data,
    }: {
      recipeId: number
      ingredientId: number
      data: IUpdateRecipeIngredientDto
    }) => recipeApi.updateIngredient(recipeId, ingredientId, data),
    onSuccess: (_, { recipeId }) => {
      queryClient.invalidateQueries({
        queryKey: recipeKeys.ingredients(recipeId),
      })
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(recipeId) })
      toast.success('Ингредиент обновлен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при обновлении ингредиента'))
    },
  })
}

/**
 * Remove ingredient from recipe mutation
 */
export const useRemoveRecipeIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
    }: {
      recipeId: number
      ingredientId: number
    }) => recipeApi.removeIngredient(recipeId, ingredientId),
    onSuccess: (_, { recipeId }) => {
      queryClient.invalidateQueries({
        queryKey: recipeKeys.ingredients(recipeId),
      })
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(recipeId) })
      toast.success('Ингредиент удален')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при удалении ингредиента'))
    },
  })
}

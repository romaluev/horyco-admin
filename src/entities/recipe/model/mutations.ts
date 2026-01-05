/**
 * Recipe Mutation Hooks
 * TanStack React Query hooks for modifying recipe data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { recipeApi } from './api'
import { recipeKeys } from './query-keys'
import type {
  ICreateRecipeDto,
  IUpdateRecipeDto,
  ICreateRecipeIngredientDto,
  IUpdateRecipeIngredientDto,
} from './types'

export const useCreateRecipe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateRecipeDto) => recipeApi.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all() })
      toast.success('Техкарта успешно создана')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании техкарты')
      console.error('Create recipe error:', error)
    },
  })
}

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateRecipeDto }) =>
      recipeApi.updateRecipe(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(variables.id) })
      toast.success('Техкарта успешно обновлена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении техкарты')
      console.error('Update recipe error:', error)
    },
  })
}

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => recipeApi.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all() })
      toast.success('Техкарта успешно удалена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении техкарты')
      console.error('Delete recipe error:', error)
    },
  })
}

export const useDuplicateRecipe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => recipeApi.duplicateRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all() })
      toast.success('Техкарта успешно скопирована')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при копировании техкарты')
      console.error('Duplicate recipe error:', error)
    },
  })
}

export const useRecalculateCost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => recipeApi.recalculateCost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      toast.success('Себестоимость пересчитана')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при пересчёте себестоимости')
      console.error('Recalculate cost error:', error)
    },
  })
}

// Ingredient Mutations

export const useAddIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: number
      data: ICreateRecipeIngredientDto
    }) => recipeApi.addIngredient(recipeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(variables.recipeId),
      })
      toast.success('Ингредиент добавлен')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при добавлении ингредиента')
      console.error('Add ingredient error:', error)
    },
  })
}

export const useUpdateIngredient = () => {
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(variables.recipeId),
      })
      toast.success('Ингредиент обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении ингредиента')
      console.error('Update ingredient error:', error)
    },
  })
}

export const useRemoveIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
    }: {
      recipeId: number
      ingredientId: number
    }) => recipeApi.removeIngredient(recipeId, ingredientId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(variables.recipeId),
      })
      toast.success('Ингредиент удалён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении ингредиента')
      console.error('Remove ingredient error:', error)
    },
  })
}

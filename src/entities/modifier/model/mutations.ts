/**
 * Modifier Mutation Hooks
 * React Query mutations for modifier operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { modifierApi } from './api'
import { modifierKeys } from './query-keys'

import type { ICreateModifierDto, IUpdateModifierDto } from './types'

/**
 * Create modifier mutation
 */
export const useCreateModifier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateModifierDto) => modifierApi.createModifier(_data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modifierKeys.all() })
      toast.success('Модификатор успешно создан')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании модификатора')
      console.error('Create modifier error:', error)
    },
  })
}

/**
 * Update modifier mutation
 */
export const useUpdateModifier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateModifierDto }) =>
      modifierApi.updateModifier(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: modifierKeys.all() })
      queryClient.invalidateQueries({ queryKey: modifierKeys.detail(id) })
      toast.success('Модификатор успешно обновлен')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении модификатора')
      console.error('Update modifier error:', error)
    },
  })
}

/**
 * Delete modifier mutation
 */
export const useDeleteModifier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => modifierApi.deleteModifier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modifierKeys.all() })
      toast.success('Модификатор успешно удален')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении модификатора')
      console.error('Delete modifier error:', error)
    },
  })
}

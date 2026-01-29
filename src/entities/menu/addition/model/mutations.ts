/**
 * Addition Mutation Hooks
 * React Query mutations for addition operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { additionApi } from './api'
import { additionKeys } from './query-keys'

import type { ICreateAdditionDto, IUpdateAdditionDto } from './types'

/**
 * Create addition mutation
 */
export const useCreateAddition = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateAdditionDto) => additionApi.createAddition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionKeys.all() })
      toast.success('Дополнение успешно создано')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании дополнения')
      console.error('Create addition error:', error)
    },
  })
}

/**
 * Update addition mutation
 */
export const useUpdateAddition = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateAdditionDto }) =>
      additionApi.updateAddition(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: additionKeys.all() })
      queryClient.invalidateQueries({ queryKey: additionKeys.detail(id) })
      toast.success('Дополнение успешно обновлено')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении дополнения')
      console.error('Update addition error:', error)
    },
  })
}

/**
 * Delete addition mutation
 */
export const useDeleteAddition = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => additionApi.deleteAddition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionKeys.all() })
      toast.success('Дополнение успешно удалено')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении дополнения')
      console.error('Delete addition error:', error)
    },
  })
}

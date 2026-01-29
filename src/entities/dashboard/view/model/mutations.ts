import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { viewApi } from './api'
import { viewKeys } from './query-keys'

import type { ICreateViewDto, IUpdateViewDto } from './types'
import type { ICreateViewInput, IUpdateViewInput } from '@/shared/api/graphql'

/**
 * Create a new view
 */
export const useCreateView = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateViewDto) => {
      const input: ICreateViewInput = {
        pageCode: data.pageCode,
        name: data.name,
        config: data.config,
        isPinned: data.isPinned,
      }
      return viewApi.createView(input)
    },
    onSuccess: () => {
      toast.success('Представление успешно создано')
      queryClient.invalidateQueries({ queryKey: viewKeys.all() })
    },
    onError: () => {
      toast.error('Ошибка при создании представления')
    },
  })
}

/**
 * Update an existing view
 */
export const useUpdateView = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateViewDto }) => {
      const input: IUpdateViewInput = {
        name: data.name,
        config: data.config,
        isPinned: data.isPinned,
        isShared: data.isShared,
      }
      return viewApi.updateView(id, input)
    },
    onSuccess: (_, { id }) => {
      toast.success('Представление обновлено')
      queryClient.invalidateQueries({ queryKey: viewKeys.all() })
      queryClient.invalidateQueries({ queryKey: viewKeys.byId(id) })
    },
    onError: () => {
      toast.error('Ошибка при обновлении представления')
    },
  })
}

/**
 * Delete a view
 */
export const useDeleteView = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => viewApi.deleteView(id),
    onSuccess: () => {
      toast.success('Представление удалено')
      queryClient.invalidateQueries({ queryKey: viewKeys.all() })
    },
    onError: () => {
      toast.error('Ошибка при удалении представления')
    },
  })
}

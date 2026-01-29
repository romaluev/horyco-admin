import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { hallApi } from './api'
import { hallKeys } from './query-keys'

import type { ICreateHallDto, IUpdateHallDto } from './types'

/**
 * Create a new hall
 */
export const useCreateHall = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateHallDto) => hallApi.createHall(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hallKeys.list(data.branchId) })
      toast.success('Зал успешно создан')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при создании зала: ${error.message}`)
    },
  })
}

/**
 * Update a hall
 */
export const useUpdateHall = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateHallDto }) =>
      hallApi.updateHall(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hallKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: hallKeys.list(data.branchId) })
      toast.success('Зал успешно обновлен')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при обновлении зала: ${error.message}`)
    },
  })
}

/**
 * Delete a hall
 */
export const useDeleteHall = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => hallApi.deleteHall(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hallKeys.lists() })
      toast.success('Зал успешно удален')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при удалении зала: ${error.message}`)
    },
  })
}

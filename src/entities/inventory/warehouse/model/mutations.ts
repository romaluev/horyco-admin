import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { warehouseApi } from './api'
import { warehouseKeys } from './query-keys'

import type { ICreateWarehouseDto, IUpdateWarehouseDto } from './types'

interface ApiError {
  message?: string
  response?: {
    data?: {
      error?: {
        message?: string
        code?: string
      }
    }
  }
}

const getErrorMessage = (error: ApiError, defaultMsg: string): string => {
  const apiMessage = error.response?.data?.error?.message || error.message
  if (apiMessage?.includes('already exists for branch')) {
    return 'Склад для этого филиала уже существует'
  }
  if (apiMessage?.includes('Cannot delete warehouse with existing stock')) {
    return 'Нельзя удалить склад с остатками. Сначала перенесите или спишите товары.'
  }
  return apiMessage || defaultMsg
}

/**
 * Create a new warehouse
 */
export const useCreateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateWarehouseDto) =>
      warehouseApi.createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      toast.success('Склад успешно создан')
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Ошибка при создании склада'))
    },
  })
}

/**
 * Update a warehouse
 */
export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateWarehouseDto }) =>
      warehouseApi.updateWarehouse(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      toast.success('Склад успешно обновлен')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при обновлении склада: ${error.message}`)
    },
  })
}

/**
 * Delete a warehouse
 */
export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => warehouseApi.deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      toast.success('Склад успешно удален')
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Ошибка при удалении склада'))
    },
  })
}

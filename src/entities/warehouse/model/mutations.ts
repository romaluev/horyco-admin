import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { warehouseApi } from './api'
import { warehouseKeys } from './query-keys'

import type { ICreateWarehouseDto, IUpdateWarehouseDto } from './types'

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
    onError: (error: Error) => {
      toast.error(`Ошибка при создании склада: ${error.message}`)
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
    onError: (error: Error) => {
      toast.error(`Ошибка при удалении склада: ${error.message}`)
    },
  })
}

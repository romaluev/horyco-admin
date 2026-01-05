/**
 * Warehouse Mutation Hooks
 * TanStack React Query hooks for modifying warehouse data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { warehouseApi } from './api'
import { warehouseKeys } from './query-keys'
import type { ICreateWarehouseDto, IUpdateWarehouseDto } from './types'

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateWarehouseDto) => warehouseApi.createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all() })
      toast.success('Склад успешно создан')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании склада')
      console.error('Create warehouse error:', error)
    },
  })
}

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateWarehouseDto }) =>
      warehouseApi.updateWarehouse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all() })
      queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(variables.id) })
      toast.success('Склад успешно обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении склада')
      console.error('Update warehouse error:', error)
    },
  })
}

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => warehouseApi.deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all() })
      toast.success('Склад успешно удалён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении склада')
      console.error('Delete warehouse error:', error)
    },
  })
}

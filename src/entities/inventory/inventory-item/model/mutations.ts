/**
 * Inventory Item Mutation Hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { inventoryItemApi } from './api'
import { inventoryItemKeys } from './query-keys'

import type {
  ICreateInventoryItemDto,
  IUpdateInventoryItemDto,
  ICreateUnitConversionDto,
} from './types'

/**
 * Create inventory item mutation
 */
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateInventoryItemDto) =>
      inventoryItemApi.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryItemKeys.all() })
      toast.success('Товар успешно создан')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании товара')
      console.error('Create inventory item error:', error)
    },
  })
}

/**
 * Update inventory item mutation
 */
export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateInventoryItemDto }) =>
      inventoryItemApi.updateItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryItemKeys.all() })
      queryClient.invalidateQueries({ queryKey: inventoryItemKeys.detail(id) })
      toast.success('Товар успешно обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении товара')
      console.error('Update inventory item error:', error)
    },
  })
}

/**
 * Delete inventory item mutation
 */
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryItemApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryItemKeys.all() })
      toast.success('Товар успешно удалён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении товара')
      console.error('Delete inventory item error:', error)
    },
  })
}

/**
 * Add unit conversion mutation
 */
export const useAddUnitConversion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: ICreateUnitConversionDto
    }) => inventoryItemApi.addConversion(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.conversions(id),
      })
      toast.success('Конверсия добавлена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при добавлении конверсии')
      console.error('Add unit conversion error:', error)
    },
  })
}

/**
 * Remove unit conversion mutation
 */
export const useRemoveUnitConversion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, conversionId }: { id: number; conversionId: number }) =>
      inventoryItemApi.removeConversion(id, conversionId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.conversions(id),
      })
      toast.success('Конверсия удалена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении конверсии')
      console.error('Remove unit conversion error:', error)
    },
  })
}

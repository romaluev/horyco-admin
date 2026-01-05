/**
 * Inventory Item Mutation Hooks
 * TanStack React Query hooks for modifying inventory item data
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

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateInventoryItemDto) => inventoryItemApi.createItem(data),
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

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateInventoryItemDto }) =>
      inventoryItemApi.updateItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryItemKeys.all() })
      queryClient.invalidateQueries({ queryKey: inventoryItemKeys.detail(variables.id) })
      toast.success('Товар успешно обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении товара')
      console.error('Update inventory item error:', error)
    },
  })
}

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

// Unit Conversion Mutations

export const useAddUnitConversion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number
      data: ICreateUnitConversionDto
    }) => inventoryItemApi.addConversion(itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.conversions(variables.itemId),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.detail(variables.itemId),
      })
      toast.success('Единица измерения добавлена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при добавлении единицы измерения')
      console.error('Add unit conversion error:', error)
    },
  })
}

export const useDeleteUnitConversion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      conversionId,
    }: {
      itemId: number
      conversionId: number
    }) => inventoryItemApi.deleteConversion(itemId, conversionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.conversions(variables.itemId),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.detail(variables.itemId),
      })
      toast.success('Единица измерения удалена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении единицы измерения')
      console.error('Delete unit conversion error:', error)
    },
  })
}

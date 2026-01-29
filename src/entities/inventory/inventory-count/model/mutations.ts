import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { getErrorMessage } from '@/shared/lib/get-error-message'

import { stockKeys } from '@/entities/inventory/stock/model/query-keys'
import { movementKeys } from '@/entities/inventory/stock-movement/model/query-keys'

import { inventoryCountApi } from './api'
import { inventoryCountKeys } from './query-keys'

import type {
  ICreateInventoryCountDto,
  ICreateCountItemDto,
  IUpdateCountItemDto,
} from './types'

/**
 * Create inventory count mutation
 */
export const useCreateInventoryCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateInventoryCountDto) =>
      inventoryCountApi.createCount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.lists() })
      toast.success('Инвентаризация создана')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при создании инвентаризации'))
    },
  })
}

/**
 * Add item to count mutation
 */
export const useAddCountItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      countId,
      data,
    }: {
      countId: number
      data: ICreateCountItemDto
    }) => inventoryCountApi.addItem(countId, data),
    onSuccess: (_, { countId }) => {
      queryClient.invalidateQueries({
        queryKey: inventoryCountKeys.detail(countId),
      })
      toast.success('Товар добавлен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при добавлении товара'))
    },
  })
}

/**
 * Update count item mutation
 */
export const useUpdateCountItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      countId,
      countItemId,
      data,
    }: {
      countId: number
      countItemId: number
      data: IUpdateCountItemDto
    }) => inventoryCountApi.updateItem(countId, countItemId, data),
    onSuccess: (_, { countId }) => {
      queryClient.invalidateQueries({
        queryKey: inventoryCountKeys.detail(countId),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryCountKeys.variance(countId),
      })
      toast.success('Данные сохранены')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при сохранении'))
    },
  })
}

/**
 * Complete count mutation
 */
export const useCompleteCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryCountApi.completeCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.lists() })
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.detail(id) })
      toast.success('Инвентаризация завершена и отправлена на согласование')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Ошибка при завершении инвентаризации')
      )
    },
  })
}

/**
 * Approve count mutation
 */
export const useApproveCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryCountApi.approveCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.lists() })
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: stockKeys.all })
      queryClient.invalidateQueries({ queryKey: movementKeys.all })
      toast.success('Инвентаризация одобрена, корректировки применены')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при одобрении инвентаризации'))
    },
  })
}

/**
 * Cancel count mutation
 */
export const useCancelCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryCountApi.cancelCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.lists() })
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.detail(id) })
      toast.success('Инвентаризация отменена')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при отмене инвентаризации'))
    },
  })
}

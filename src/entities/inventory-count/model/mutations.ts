/**
 * Inventory Count Mutation Hooks
 * TanStack React Query hooks for modifying inventory count data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { stockKeys } from '../../stock/model/query-keys'
import { stockMovementKeys } from '../../stock-movement/model/query-keys'
import { inventoryCountApi } from './api'
import { inventoryCountKeys } from './query-keys'
import type {
  ICreateCountDto,
  IUpdateCountDto,
  ICountItemDto,
  IRejectCountDto,
} from './types'

export const useCreateInventoryCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: number
      data: ICreateCountDto
    }) => inventoryCountApi.createCount(branchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.all() })
      toast.success('Инвентаризация создана')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании инвентаризации')
      console.error('Create inventory count error:', error)
    },
  })
}

export const useUpdateInventoryCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateCountDto }) =>
      inventoryCountApi.updateCount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.all() })
      queryClient.invalidateQueries({
        queryKey: inventoryCountKeys.detail(variables.id),
      })
      toast.success('Инвентаризация обновлена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении инвентаризации')
      console.error('Update inventory count error:', error)
    },
  })
}

export const useDeleteInventoryCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryCountApi.deleteCount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.all() })
      toast.success('Инвентаризация удалена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении инвентаризации')
      console.error('Delete inventory count error:', error)
    },
  })
}

// Item counting mutations

export const useCountItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      countId,
      itemId,
      data,
    }: {
      countId: number
      itemId: number
      data: ICountItemDto
    }) => inventoryCountApi.countItem(countId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryCountKeys.detail(variables.countId),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryCountKeys.variance(variables.countId),
      })
    },
    onError: (error: Error) => {
      toast.error('Ошибка при сохранении подсчёта')
      console.error('Count item error:', error)
    },
  })
}

export const useClearItemCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ countId, itemId }: { countId: number; itemId: number }) =>
      inventoryCountApi.clearItemCount(countId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryCountKeys.detail(variables.countId),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryCountKeys.variance(variables.countId),
      })
    },
    onError: (error: Error) => {
      toast.error('Ошибка при сбросе подсчёта')
      console.error('Clear item count error:', error)
    },
  })
}

// Status action mutations

export const useStartCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryCountApi.startCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.all() })
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.detail(id) })
      toast.success('Инвентаризация начата')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при начале инвентаризации')
      console.error('Start count error:', error)
    },
  })
}

export const useCompleteCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryCountApi.completeCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.all() })
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.detail(id) })
      toast.success('Подсчёт завершён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при завершении подсчёта')
      console.error('Complete count error:', error)
    },
  })
}

export const useSubmitCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryCountApi.submitForApproval(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.all() })
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.detail(id) })
      toast.success('Инвентаризация отправлена на утверждение')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при отправке на утверждение')
      console.error('Submit count error:', error)
    },
  })
}

export const useApproveCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryCountApi.approveCount(id),
    onSuccess: (_, id) => {
      // Invalidate count queries
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.all() })
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.detail(id) })
      // Invalidate stock (approval adjusts stock levels)
      queryClient.invalidateQueries({ queryKey: stockKeys.all() })
      queryClient.invalidateQueries({ queryKey: stockMovementKeys.all() })
      toast.success('Инвентаризация утверждена, остатки скорректированы')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при утверждении инвентаризации')
      console.error('Approve count error:', error)
    },
  })
}

export const useRejectCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IRejectCountDto }) =>
      inventoryCountApi.rejectCount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.all() })
      queryClient.invalidateQueries({
        queryKey: inventoryCountKeys.detail(variables.id),
      })
      toast.success('Инвентаризация отклонена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при отклонении инвентаризации')
      console.error('Reject count error:', error)
    },
  })
}

export const useCancelCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inventoryCountApi.cancelCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.all() })
      queryClient.invalidateQueries({ queryKey: inventoryCountKeys.detail(id) })
      toast.success('Инвентаризация отменена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при отмене инвентаризации')
      console.error('Cancel count error:', error)
    },
  })
}

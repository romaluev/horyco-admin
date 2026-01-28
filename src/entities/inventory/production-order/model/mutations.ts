import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { productionOrderApi } from './api'
import { productionOrderKeys } from './query-keys'
import { stockKeys } from '@/entities/inventory/stock/model/query-keys'
import { movementKeys } from '@/entities/inventory/stock-movement/model/query-keys'
import { getErrorMessage } from '@/shared/lib/get-error-message'

import type {
  ICreateProductionOrderDto,
  IUpdateProductionOrderDto,
  IStartProductionDto,
  ICompleteProductionDto,
} from './types'

/**
 * Create production order mutation
 */
export const useCreateProductionOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateProductionOrderDto) => productionOrderApi.createProductionOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.lists() })
      toast.success('Заказ на производство создан')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при создании заказа'))
    },
  })
}

/**
 * Update production order mutation
 */
export const useUpdateProductionOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateProductionOrderDto }) =>
      productionOrderApi.updateProductionOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.detail(id) })
      toast.success('Заказ обновлен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при обновлении заказа'))
    },
  })
}

/**
 * Delete production order mutation
 */
export const useDeleteProductionOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productionOrderApi.deleteProductionOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.lists() })
      toast.success('Заказ удален')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при удалении заказа'))
    },
  })
}

/**
 * Start production mutation
 */
export const useStartProduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: IStartProductionDto }) =>
      productionOrderApi.startProduction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: stockKeys.all })
      queryClient.invalidateQueries({ queryKey: movementKeys.all })
      toast.success('Производство начато')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при запуске производства'))
    },
  })
}

/**
 * Complete production mutation
 */
export const useCompleteProduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ICompleteProductionDto }) =>
      productionOrderApi.completeProduction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: stockKeys.all })
      queryClient.invalidateQueries({ queryKey: movementKeys.all })
      toast.success('Производство завершено')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при завершении производства'))
    },
  })
}

/**
 * Cancel production mutation
 */
export const useCancelProduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productionOrderApi.cancelProduction(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: stockKeys.all })
      queryClient.invalidateQueries({ queryKey: movementKeys.all })
      toast.success('Производство отменено')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при отмене производства'))
    },
  })
}

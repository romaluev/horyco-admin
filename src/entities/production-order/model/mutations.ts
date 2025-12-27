/**
 * Production Order Mutation Hooks
 * TanStack React Query hooks for modifying production order data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { stockKeys } from '../../stock/model/query-keys'
import { stockMovementKeys } from '../../stock-movement/model/query-keys'
import { productionOrderApi } from './api'
import { productionOrderKeys } from './query-keys'
import type {
  ICreateProductionOrderDto,
  IUpdateProductionOrderDto,
  ICompleteProductionDto,
} from './types'

export const useCreateProductionOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: number
      data: ICreateProductionOrderDto
    }) => productionOrderApi.createProductionOrder(branchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.all() })
      toast.success('Производственный заказ создан')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании производственного заказа')
      console.error('Create production order error:', error)
    },
  })
}

export const useUpdateProductionOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: IUpdateProductionOrderDto
    }) => productionOrderApi.updateProductionOrder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.all() })
      queryClient.invalidateQueries({
        queryKey: productionOrderKeys.detail(variables.id),
      })
      toast.success('Производственный заказ обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении производственного заказа')
      console.error('Update production order error:', error)
    },
  })
}

export const useDeleteProductionOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productionOrderApi.deleteProductionOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.all() })
      toast.success('Производственный заказ удалён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении производственного заказа')
      console.error('Delete production order error:', error)
    },
  })
}

// Status action mutations

export const useStartProduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productionOrderApi.startProduction(id),
    onSuccess: (_, id) => {
      // Invalidate production queries
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.all() })
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.detail(id) })
      // Invalidate stock (starting deducts ingredients)
      queryClient.invalidateQueries({ queryKey: stockKeys.all() })
      queryClient.invalidateQueries({ queryKey: stockMovementKeys.all() })
      toast.success('Производство начато, ингредиенты списаны')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при начале производства')
      console.error('Start production error:', error)
    },
  })
}

export const useCompleteProduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data?: ICompleteProductionDto
    }) => productionOrderApi.completeProduction(id, data),
    onSuccess: (_, variables) => {
      // Invalidate production queries
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.all() })
      queryClient.invalidateQueries({
        queryKey: productionOrderKeys.detail(variables.id),
      })
      // Invalidate stock (completing adds produced items)
      queryClient.invalidateQueries({ queryKey: stockKeys.all() })
      queryClient.invalidateQueries({ queryKey: stockMovementKeys.all() })
      toast.success('Производство завершено, продукция оприходована')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при завершении производства')
      console.error('Complete production error:', error)
    },
  })
}

export const useCancelProduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productionOrderApi.cancelProduction(id),
    onSuccess: (_, id) => {
      // Invalidate production queries
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.all() })
      queryClient.invalidateQueries({ queryKey: productionOrderKeys.detail(id) })
      // Invalidate stock (cancelling may return ingredients)
      queryClient.invalidateQueries({ queryKey: stockKeys.all() })
      queryClient.invalidateQueries({ queryKey: stockMovementKeys.all() })
      toast.success('Производство отменено')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при отмене производства')
      console.error('Cancel production error:', error)
    },
  })
}

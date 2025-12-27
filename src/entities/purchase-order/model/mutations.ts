/**
 * Purchase Order Mutation Hooks
 * TanStack React Query hooks for modifying purchase order data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { stockKeys } from '../../stock/model/query-keys'
import { stockMovementKeys } from '../../stock-movement/model/query-keys'
import { purchaseOrderApi } from './api'
import { purchaseOrderKeys } from './query-keys'
import type {
  ICreatePurchaseOrderDto,
  IUpdatePurchaseOrderDto,
  ICreatePOItemDto,
  IUpdatePOItemDto,
  IReceivePODto,
} from './types'

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreatePurchaseOrderDto) =>
      purchaseOrderApi.createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all() })
      toast.success('Заказ поставщику создан')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании заказа')
      console.error('Create purchase order error:', error)
    },
  })
}

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdatePurchaseOrderDto }) =>
      purchaseOrderApi.updatePurchaseOrder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all() })
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.id),
      })
      toast.success('Заказ обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении заказа')
      console.error('Update purchase order error:', error)
    },
  })
}

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => purchaseOrderApi.deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all() })
      toast.success('Заказ удалён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении заказа')
      console.error('Delete purchase order error:', error)
    },
  })
}

// PO Item Mutations

export const useAddPOItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ poId, data }: { poId: number; data: ICreatePOItemDto }) =>
      purchaseOrderApi.addItem(poId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.poId),
      })
      toast.success('Товар добавлен в заказ')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при добавлении товара')
      console.error('Add PO item error:', error)
    },
  })
}

export const useUpdatePOItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      poId,
      itemId,
      data,
    }: {
      poId: number
      itemId: number
      data: IUpdatePOItemDto
    }) => purchaseOrderApi.updateItem(poId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.poId),
      })
      toast.success('Товар обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении товара')
      console.error('Update PO item error:', error)
    },
  })
}

export const useRemovePOItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ poId, itemId }: { poId: number; itemId: number }) =>
      purchaseOrderApi.removeItem(poId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.poId),
      })
      toast.success('Товар удалён из заказа')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении товара')
      console.error('Remove PO item error:', error)
    },
  })
}

// Status Action Mutations

export const useSendToSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => purchaseOrderApi.sendToSupplier(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all() })
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) })
      toast.success('Заказ отправлен поставщику')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при отправке заказа')
      console.error('Send to supplier error:', error)
    },
  })
}

export const useReceiveItems = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IReceivePODto }) =>
      purchaseOrderApi.receiveItems(id, data),
    onSuccess: (_, variables) => {
      // Invalidate PO queries
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all() })
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.id),
      })
      // Invalidate stock queries (receiving updates stock)
      queryClient.invalidateQueries({ queryKey: stockKeys.all() })
      queryClient.invalidateQueries({ queryKey: stockMovementKeys.all() })
      toast.success('Товары приняты на склад')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при приёме товаров')
      console.error('Receive items error:', error)
    },
  })
}

export const useCancelPurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => purchaseOrderApi.cancelPurchaseOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all() })
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) })
      toast.success('Заказ отменён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при отмене заказа')
      console.error('Cancel purchase order error:', error)
    },
  })
}

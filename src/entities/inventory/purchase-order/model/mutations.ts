import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { getErrorMessage } from '@/shared/lib/get-error-message'

import { stockKeys } from '@/entities/inventory/stock/model/query-keys'
import { movementKeys } from '@/entities/inventory/stock-movement/model/query-keys'

import { purchaseOrderApi } from './api'
import { purchaseOrderKeys } from './query-keys'


import type {
  ICreatePurchaseOrderDto,
  IUpdatePurchaseOrderDto,
  ICreatePOItemDto,
  IUpdatePOItemDto,
  IReceivePODto,
  ICancelPODto,
} from './types'

/**
 * Create purchase order mutation
 */
export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreatePurchaseOrderDto) => purchaseOrderApi.createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() })
      toast.success('Заказ поставщику создан')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при создании заказа'))
    },
  })
}

/**
 * Update purchase order mutation
 */
export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdatePurchaseOrderDto }) =>
      purchaseOrderApi.updatePurchaseOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) })
      toast.success('Заказ обновлен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при обновлении заказа'))
    },
  })
}

/**
 * Delete purchase order mutation
 */
export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => purchaseOrderApi.deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() })
      toast.success('Заказ удален')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при удалении заказа'))
    },
  })
}

/**
 * Add item to purchase order mutation
 */
export const useAddPOItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ poId, data }: { poId: number; data: ICreatePOItemDto }) =>
      purchaseOrderApi.addItem(poId, data),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(poId) })
      toast.success('Товар добавлен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при добавлении товара'))
    },
  })
}

/**
 * Update purchase order item mutation
 */
export const useUpdatePOItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ poId, poItemId, data }: { poId: number; poItemId: number; data: IUpdatePOItemDto }) =>
      purchaseOrderApi.updateItem(poId, poItemId, data),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(poId) })
      toast.success('Товар обновлен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при обновлении товара'))
    },
  })
}

/**
 * Remove item from purchase order mutation
 */
export const useRemovePOItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ poId, poItemId }: { poId: number; poItemId: number }) =>
      purchaseOrderApi.removeItem(poId, poItemId),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(poId) })
      toast.success('Товар удален')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при удалении товара'))
    },
  })
}

/**
 * Send purchase order mutation
 */
export const useSendPurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => purchaseOrderApi.sendPurchaseOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) })
      toast.success('Заказ отправлен поставщику')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при отправке заказа'))
    },
  })
}

/**
 * Receive purchase order mutation
 */
export const useReceivePurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IReceivePODto }) =>
      purchaseOrderApi.receivePurchaseOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: stockKeys.all })
      queryClient.invalidateQueries({ queryKey: movementKeys.all })
      toast.success('Товары приняты')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при приёме товаров'))
    },
  })
}

/**
 * Cancel purchase order mutation
 */
export const useCancelPurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ICancelPODto }) =>
      purchaseOrderApi.cancelPurchaseOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) })
      toast.success('Заказ отменен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при отмене заказа'))
    },
  })
}

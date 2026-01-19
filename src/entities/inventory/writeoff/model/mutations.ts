import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { writeoffApi } from './api'
import { writeoffKeys } from './query-keys'
import { stockKeys } from '@/entities/inventory/stock/model/query-keys'
import { movementKeys } from '@/entities/inventory/stock-movement/model/query-keys'
import { getErrorMessage } from '@/shared/lib/get-error-message'

import type {
  ICreateWriteoffDto,
  IUpdateWriteoffDto,
  ICreateWriteoffItemDto,
  IUpdateWriteoffItemDto,
  IRejectWriteoffDto,
} from './types'

/**
 * Create writeoff mutation
 */
export const useCreateWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateWriteoffDto) => writeoffApi.createWriteoff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.lists() })
      toast.success('Списание создано')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при создании списания'))
    },
  })
}

/**
 * Update writeoff mutation
 */
export const useUpdateWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateWriteoffDto }) =>
      writeoffApi.updateWriteoff(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.lists() })
      queryClient.invalidateQueries({ queryKey: writeoffKeys.detail(id) })
      toast.success('Списание обновлено')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при обновлении списания'))
    },
  })
}

/**
 * Delete writeoff mutation
 */
export const useDeleteWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => writeoffApi.deleteWriteoff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.lists() })
      toast.success('Списание удалено')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при удалении списания'))
    },
  })
}

/**
 * Add item to writeoff mutation
 */
export const useAddWriteoffItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ writeoffId, data }: { writeoffId: number; data: ICreateWriteoffItemDto }) =>
      writeoffApi.addItem(writeoffId, data),
    onSuccess: (_, { writeoffId }) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.detail(writeoffId) })
      toast.success('Товар добавлен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при добавлении товара'))
    },
  })
}

/**
 * Update writeoff item mutation
 */
export const useUpdateWriteoffItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      writeoffId,
      itemId,
      data,
    }: {
      writeoffId: number
      itemId: number
      data: IUpdateWriteoffItemDto
    }) => writeoffApi.updateItem(writeoffId, itemId, data),
    onSuccess: (_, { writeoffId }) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.detail(writeoffId) })
      toast.success('Товар обновлен')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при обновлении товара'))
    },
  })
}

/**
 * Remove item from writeoff mutation
 */
export const useRemoveWriteoffItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ writeoffId, itemId }: { writeoffId: number; itemId: number }) =>
      writeoffApi.removeItem(writeoffId, itemId),
    onSuccess: (_, { writeoffId }) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.detail(writeoffId) })
      toast.success('Товар удален')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при удалении товара'))
    },
  })
}

/**
 * Submit writeoff for approval mutation
 */
export const useSubmitWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => writeoffApi.submitWriteoff(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.lists() })
      queryClient.invalidateQueries({ queryKey: writeoffKeys.detail(id) })
      toast.success('Списание отправлено на согласование')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при отправке на согласование'))
    },
  })
}

/**
 * Approve writeoff mutation
 */
export const useApproveWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => writeoffApi.approveWriteoff(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.lists() })
      queryClient.invalidateQueries({ queryKey: writeoffKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: stockKeys.all })
      queryClient.invalidateQueries({ queryKey: movementKeys.all })
      toast.success('Списание одобрено')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при одобрении списания'))
    },
  })
}

/**
 * Reject writeoff mutation
 */
export const useRejectWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IRejectWriteoffDto }) =>
      writeoffApi.rejectWriteoff(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.lists() })
      queryClient.invalidateQueries({ queryKey: writeoffKeys.detail(id) })
      toast.success('Списание отклонено')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Ошибка при отклонении списания'))
    },
  })
}

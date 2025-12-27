/**
 * Writeoff Mutation Hooks
 * TanStack React Query hooks for modifying writeoff data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { stockKeys } from '../../stock/model/query-keys'
import { stockMovementKeys } from '../../stock-movement/model/query-keys'
import { writeoffApi } from './api'
import { writeoffKeys } from './query-keys'
import type {
  ICreateWriteoffDto,
  IUpdateWriteoffDto,
  IAddWriteoffItemDto,
  IUpdateWriteoffItemDto,
  IRejectWriteoffDto,
} from './types'

export const useCreateWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: number
      data: ICreateWriteoffDto
    }) => writeoffApi.createWriteoff(branchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.all() })
      toast.success('Списание создано')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании списания')
      console.error('Create writeoff error:', error)
    },
  })
}

export const useUpdateWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateWriteoffDto }) =>
      writeoffApi.updateWriteoff(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.all() })
      queryClient.invalidateQueries({
        queryKey: writeoffKeys.detail(variables.id),
      })
      toast.success('Списание обновлено')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении списания')
      console.error('Update writeoff error:', error)
    },
  })
}

export const useDeleteWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => writeoffApi.deleteWriteoff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.all() })
      toast.success('Списание удалено')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении списания')
      console.error('Delete writeoff error:', error)
    },
  })
}

// Item mutations

export const useAddWriteoffItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      writeoffId,
      data,
    }: {
      writeoffId: number
      data: IAddWriteoffItemDto
    }) => writeoffApi.addItem(writeoffId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: writeoffKeys.detail(variables.writeoffId),
      })
      toast.success('Товар добавлен')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при добавлении товара')
      console.error('Add writeoff item error:', error)
    },
  })
}

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: writeoffKeys.detail(variables.writeoffId),
      })
      toast.success('Товар обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении товара')
      console.error('Update writeoff item error:', error)
    },
  })
}

export const useRemoveWriteoffItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      writeoffId,
      itemId,
    }: {
      writeoffId: number
      itemId: number
    }) => writeoffApi.removeItem(writeoffId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: writeoffKeys.detail(variables.writeoffId),
      })
      toast.success('Товар удалён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении товара')
      console.error('Remove writeoff item error:', error)
    },
  })
}

// Status action mutations

export const useSubmitWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => writeoffApi.submitForApproval(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.all() })
      queryClient.invalidateQueries({ queryKey: writeoffKeys.detail(id) })
      toast.success('Списание отправлено на утверждение')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при отправке на утверждение')
      console.error('Submit writeoff error:', error)
    },
  })
}

export const useApproveWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => writeoffApi.approveWriteoff(id),
    onSuccess: (_, id) => {
      // Invalidate writeoff queries
      queryClient.invalidateQueries({ queryKey: writeoffKeys.all() })
      queryClient.invalidateQueries({ queryKey: writeoffKeys.detail(id) })
      // Invalidate stock (approval deducts from stock)
      queryClient.invalidateQueries({ queryKey: stockKeys.all() })
      queryClient.invalidateQueries({ queryKey: stockMovementKeys.all() })
      toast.success('Списание утверждено')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при утверждении списания')
      console.error('Approve writeoff error:', error)
    },
  })
}

export const useRejectWriteoff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IRejectWriteoffDto }) =>
      writeoffApi.rejectWriteoff(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: writeoffKeys.all() })
      queryClient.invalidateQueries({
        queryKey: writeoffKeys.detail(variables.id),
      })
      toast.success('Списание отклонено')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при отклонении списания')
      console.error('Reject writeoff error:', error)
    },
  })
}

/**
 * Supplier Mutation Hooks
 * TanStack React Query hooks for modifying supplier data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { supplierApi } from './api'
import { supplierKeys } from './query-keys'
import type {
  ICreateSupplierDto,
  IUpdateSupplierDto,
  ICreateSupplierItemDto,
  IUpdateSupplierItemDto,
} from './types'

export const useCreateSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateSupplierDto) => supplierApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all() })
      toast.success('Поставщик успешно создан')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании поставщика')
      console.error('Create supplier error:', error)
    },
  })
}

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateSupplierDto }) =>
      supplierApi.updateSupplier(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all() })
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(variables.id) })
      toast.success('Поставщик успешно обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении поставщика')
      console.error('Update supplier error:', error)
    },
  })
}

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => supplierApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all() })
      toast.success('Поставщик успешно удалён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении поставщика')
      console.error('Delete supplier error:', error)
    },
  })
}

// Supplier Item Mutations

export const useAddSupplierItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      supplierId,
      data,
    }: {
      supplierId: number
      data: ICreateSupplierItemDto
    }) => supplierApi.addSupplierItem(supplierId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.items(variables.supplierId),
      })
      toast.success('Товар добавлен к поставщику')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при добавлении товара')
      console.error('Add supplier item error:', error)
    },
  })
}

export const useUpdateSupplierItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      supplierId,
      itemId,
      data,
    }: {
      supplierId: number
      itemId: number
      data: IUpdateSupplierItemDto
    }) => supplierApi.updateSupplierItem(supplierId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.items(variables.supplierId),
      })
      queryClient.invalidateQueries({
        queryKey: supplierKeys.priceHistory(variables.supplierId),
      })
      toast.success('Товар обновлён')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении товара')
      console.error('Update supplier item error:', error)
    },
  })
}

export const useRemoveSupplierItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      supplierId,
      itemId,
    }: {
      supplierId: number
      itemId: number
    }) => supplierApi.removeSupplierItem(supplierId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.items(variables.supplierId),
      })
      toast.success('Товар удалён от поставщика')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении товара')
      console.error('Remove supplier item error:', error)
    },
  })
}

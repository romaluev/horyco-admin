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

interface ApiError {
  message?: string
  response?: {
    data?: {
      error?: {
        message?: string
        details?: {
          originalError?: string
        }
      }
    }
  }
}

const getDeleteErrorMessage = (error: ApiError): string => {
  const apiMessage = error.response?.data?.error?.message
  const originalError = error.response?.data?.error?.details?.originalError

  if (originalError?.includes('Cannot delete supplier with existing purchase orders') ||
      apiMessage?.includes('Cannot delete supplier')) {
    return 'Нельзя удалить поставщика с заказами. Деактивируйте его вместо удаления.'
  }
  return apiMessage || error.message || 'Ошибка при удалении поставщика'
}

/**
 * Create supplier mutation
 */
export const useCreateSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateSupplierDto) => supplierApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })
      toast.success('Поставщик создан')
    },
    onError: () => {
      toast.error('Ошибка при создании поставщика')
    },
  })
}

/**
 * Update supplier mutation
 */
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateSupplierDto }) =>
      supplierApi.updateSupplier(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) })
      toast.success('Поставщик обновлен')
    },
    onError: () => {
      toast.error('Ошибка при обновлении поставщика')
    },
  })
}

/**
 * Delete supplier mutation
 */
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => supplierApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })
      toast.success('Поставщик удален')
    },
    onError: (error: ApiError) => {
      toast.error(getDeleteErrorMessage(error))
    },
  })
}

/**
 * Activate supplier mutation
 */
export const useActivateSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => supplierApi.activateSupplier(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) })
      toast.success('Поставщик активирован')
    },
    onError: () => {
      toast.error('Ошибка при активации поставщика')
    },
  })
}

/**
 * Deactivate supplier mutation
 */
export const useDeactivateSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => supplierApi.deactivateSupplier(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) })
      toast.success('Поставщик деактивирован')
    },
    onError: () => {
      toast.error('Ошибка при деактивации поставщика')
    },
  })
}

/**
 * Add item to supplier catalog mutation
 */
export const useAddSupplierItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ supplierId, data }: { supplierId: number; data: ICreateSupplierItemDto }) =>
      supplierApi.addSupplierItem(supplierId, data),
    onSuccess: (_, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.items(supplierId) })
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(supplierId) })
      toast.success('Товар добавлен к поставщику')
    },
    onError: () => {
      toast.error('Ошибка при добавлении товара')
    },
  })
}

/**
 * Update supplier item mutation
 */
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
    onSuccess: (_, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.items(supplierId) })
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(supplierId) })
      toast.success('Товар поставщика обновлен')
    },
    onError: () => {
      toast.error('Ошибка при обновлении товара')
    },
  })
}

/**
 * Remove item from supplier catalog mutation
 */
export const useRemoveSupplierItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ supplierId, itemId }: { supplierId: number; itemId: number }) =>
      supplierApi.removeSupplierItem(supplierId, itemId),
    onSuccess: (_, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.items(supplierId) })
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(supplierId) })
      toast.success('Товар удален от поставщика')
    },
    onError: () => {
      toast.error('Ошибка при удалении товара')
    },
  })
}

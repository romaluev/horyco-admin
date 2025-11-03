/**
 * Modifier Group Mutation Hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { modifierGroupApi } from './api'
import { modifierGroupKeys } from './query-keys'

import type {
  ICreateModifierGroupDto,
  IUpdateModifierGroupDto,
  ICreateModifierDto,
  IUpdateModifierDto,
} from './types'

export const useCreateModifierGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateModifierGroupDto) =>
      modifierGroupApi.createModifierGroup(_data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modifierGroupKeys.all() })
      toast.success('Группа модификаторов создана')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании группы')
      console.error('Create modifier group error:', error)
    },
  })
}

export const useUpdateModifierGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateModifierGroupDto }) =>
      modifierGroupApi.updateModifierGroup(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: modifierGroupKeys.all() })
      queryClient.invalidateQueries({ queryKey: modifierGroupKeys.detail(id) })
      toast.success('Группа модификаторов обновлена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении группы')
      console.error('Update modifier group error:', error)
    },
  })
}

export const useDeleteModifierGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => modifierGroupApi.deleteModifierGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modifierGroupKeys.all() })
      toast.success('Группа модификаторов удалена')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении группы')
      console.error('Delete modifier group error:', error)
    },
  })
}

export const useAttachModifierGroupToProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      groupId,
    }: {
      productId: number
      groupId: number
    }) => modifierGroupApi.attachModifierGroupToProduct(productId, groupId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: modifierGroupKeys.productGroups(productId),
      })
      toast.success('Группа привязана к продукту')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при привязке группы')
      console.error('Attach modifier group error:', error)
    },
  })
}

export const useDetachModifierGroupFromProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      groupId,
    }: {
      productId: number
      groupId: number
    }) => modifierGroupApi.detachModifierGroupFromProduct(productId, groupId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: modifierGroupKeys.productGroups(productId),
      })
      toast.success('Группа отвязана от продукта')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при отвязке группы')
      console.error('Detach modifier group error:', error)
    },
  })
}

// ===== Modifier Mutations =====

export const useCreateModifier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateModifierDto) =>
      modifierGroupApi.createModifier(_data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: modifierGroupKeys.modifiers.all(),
      })
      queryClient.invalidateQueries({ queryKey: modifierGroupKeys.all() })
      toast.success('Модификатор создан')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании модификатора')
      console.error('Create modifier error:', error)
    },
  })
}

export const useUpdateModifier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateModifierDto }) =>
      modifierGroupApi.updateModifier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: modifierGroupKeys.modifiers.all(),
      })
      queryClient.invalidateQueries({ queryKey: modifierGroupKeys.all() })
      toast.success('Модификатор обновлен')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении модификатора')
      console.error('Update modifier error:', error)
    },
  })
}

export const useDeleteModifier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => modifierGroupApi.deleteModifier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: modifierGroupKeys.modifiers.all(),
      })
      queryClient.invalidateQueries({ queryKey: modifierGroupKeys.all() })
      toast.success('Модификатор удален')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении модификатора')
      console.error('Delete modifier error:', error)
    },
  })
}

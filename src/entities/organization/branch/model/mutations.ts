import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { branchApi } from './api'
import { queryKeys } from './query-keys'

import type {
  ICreateBranchDto,
  IUpdateBranchDto,
  IBulkCreateBranchDto,
} from './types'

export const useCreateBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateBranchDto) => branchApi.createBranch(data),
    onSuccess: () => {
      toast.success('Филиал успешно создан')
      queryClient.invalidateQueries({ queryKey: queryKeys.all() })
    },
    onError: () => {
      toast.error('При создании филиала произошла ошибка')
    },
  })
}

export const useUpdateBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateBranchDto }) =>
      branchApi.updateBranch(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Филиал успешно обновлен')
      queryClient.invalidateQueries({ queryKey: queryKeys.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.byId(id) })
    },
    onError: () => {
      toast.error('При обновлении филиала произошла ошибка')
    },
  })
}

export const useDeleteBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => branchApi.deleteBranch(id),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all() })
      toast.success('Филиал успешно удален')
    },
    onError: () => {
      toast.error('При удалении филиала произошла ошибка')
    },
  })
}

export const useBulkCreateBranches = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IBulkCreateBranchDto) =>
      branchApi.bulkCreateBranches(data),
    onSuccess: (result) => {
      toast.success(
        `Импорт завершен: ${result.success} успешно, ${result.failed} ошибок`
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.all() })
    },
    onError: () => {
      toast.error('При импорте филиалов произошла ошибка')
    },
  })
}

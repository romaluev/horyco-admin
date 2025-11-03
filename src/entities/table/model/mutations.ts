import { useMutation, useQueryClient } from '@tanstack/react-query'

import { tableApi } from './api'
import { tableKeys } from './query-keys'

import type { ICreateTableDto, IUpdateTableDto } from './types'

export const useCreateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateTableDto) => tableApi.createTable(_data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() })
    },
  })
}

export const useUpdateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateTableDto }) =>
      tableApi.updateTable(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() })
      queryClient.invalidateQueries({ queryKey: tableKeys.detail(id) })
    },
  })
}

export const useDeleteTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => tableApi.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() })
    },
  })
}

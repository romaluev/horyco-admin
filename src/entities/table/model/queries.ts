import { useQuery } from '@tanstack/react-query'

import { tableApi } from './api'
import { tableKeys } from './query-keys'

import type { ApiParams } from '@/shared/types'

export const useTableList = (params?: ApiParams) => {
  return useQuery({
    queryKey: tableKeys.list(JSON.stringify(params)),
    queryFn: () => tableApi.getTables(params),
  })
}

export const useTableById = (id: number) => {
  return useQuery({
    queryKey: tableKeys.detail(id),
    queryFn: () => tableApi.getTableById(id),
  })
}

import { useQuery } from '@tanstack/react-query'

import { branchApi } from './api'
import { queryKeys } from './query-keys'

import type { ApiParams } from '@/shared/types'

export const useGetAllBranches = (params?: ApiParams) => {
  return useQuery({
    queryKey: [...queryKeys.all(), JSON.stringify(params)],
    queryFn: () => branchApi.getBranches(params),
  })
}

export const useGetBranchById = (id: number) => {
  return useQuery({
    queryKey: queryKeys.byId(id),
    queryFn: () => branchApi.getBranchById(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

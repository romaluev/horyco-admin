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

export const useCanDeleteBranch = (id: number) => {
  return useQuery({
    queryKey: queryKeys.canDelete(id),
    queryFn: () => branchApi.canDeleteBranch(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export const useBranchStatistics = (
  id: number,
  period: 'today' | 'week' | 'month' | 'year' = 'week'
) => {
  return useQuery({
    queryKey: queryKeys.statistics(id, period),
    queryFn: () => branchApi.getBranchStatistics(id, period),
    enabled: Number.isFinite(id) && id > 0,
  })
}

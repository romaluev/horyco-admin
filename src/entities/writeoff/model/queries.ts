/**
 * Writeoff Query Hooks
 * TanStack React Query hooks for fetching writeoff data
 */

import { useQuery } from '@tanstack/react-query'

import { writeoffApi } from './api'
import { writeoffKeys } from './query-keys'
import type { IWriteoffListParams } from './types'
import { WriteoffStatus } from '@/shared/types/inventory'

export const useGetWriteoffs = (
  branchId: number,
  params?: IWriteoffListParams,
  enabled = true
) => {
  return useQuery({
    queryKey: writeoffKeys.list(branchId, params),
    queryFn: () => writeoffApi.getWriteoffs(branchId, params),
    enabled: enabled && !!branchId,
  })
}

export const useGetWriteoffById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: writeoffKeys.detail(id),
    queryFn: () => writeoffApi.getWriteoffById(id),
    enabled: enabled && !!id,
  })
}

export const useGetPendingWriteoffs = (branchId: number, enabled = true) => {
  return useQuery({
    queryKey: writeoffKeys.pending(branchId),
    queryFn: () =>
      writeoffApi.getWriteoffs(branchId, { status: WriteoffStatus.PENDING }),
    enabled: enabled && !!branchId,
    select: (data) => data.data,
  })
}

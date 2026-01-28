import { useQuery } from '@tanstack/react-query'

import { writeoffApi } from './api'
import { writeoffKeys } from './query-keys'

import type { IGetWriteoffsParams } from './types'

/**
 * Get all writeoffs
 */
export const useGetWriteoffs = (params?: IGetWriteoffsParams) => {
  return useQuery({
    queryKey: writeoffKeys.list(params),
    queryFn: () => writeoffApi.getWriteoffs(params),
  })
}

// Alias
export const useWriteoffList = useGetWriteoffs

/**
 * Get writeoff by ID with items
 */
export const useWriteoffById = (id: number) => {
  return useQuery({
    queryKey: writeoffKeys.detail(id),
    queryFn: () => writeoffApi.getWriteoffById(id),
    enabled: !!id,
  })
}

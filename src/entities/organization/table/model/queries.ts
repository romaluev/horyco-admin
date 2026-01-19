import { useQuery } from '@tanstack/react-query'

import { tableApi } from './api'
import { tableKeys } from './query-keys'

/**
 * Get all tables for a hall
 */
export const useTableList = (hallId: number) => {
  return useQuery({
    queryKey: tableKeys.list(hallId),
    queryFn: () => tableApi.getTables(hallId),
    enabled: !!hallId,
  })
}

/**
 * Get table by ID
 */
export const useTableById = (id: number) => {
  return useQuery({
    queryKey: tableKeys.detail(id),
    queryFn: () => tableApi.getTableById(id),
    enabled: !!id,
  })
}

/**
 * Get table session status
 */
export const useTableSession = (id: number) => {
  return useQuery({
    queryKey: tableKeys.session(id),
    queryFn: () => tableApi.getSessionStatus(id),
    enabled: !!id,
  })
}

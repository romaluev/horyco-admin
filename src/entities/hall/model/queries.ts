import { useQuery } from '@tanstack/react-query'

import { hallApi } from './api'
import { hallKeys } from './query-keys'

/**
 * Get all halls for a branch
 */
export const useHallList = (branchId: number) => {
  return useQuery({
    queryKey: hallKeys.list(branchId),
    queryFn: () => hallApi.getHalls(branchId),
    enabled: !!branchId,
  })
}

/**
 * Get hall by ID
 */
export const useHallById = (id: number) => {
  return useQuery({
    queryKey: hallKeys.detail(id),
    queryFn: () => hallApi.getHallById(id),
    enabled: !!id,
  })
}

/**
 * Check if hall can be deleted
 */
export const useCanDeleteHall = (id: number) => {
  return useQuery({
    queryKey: hallKeys.canDelete(id),
    queryFn: () => hallApi.canDeleteHall(id),
    enabled: !!id,
  })
}

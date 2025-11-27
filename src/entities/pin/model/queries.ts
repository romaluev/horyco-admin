/**
 * React Query hooks for PIN management
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import { getPinStatus } from './api'
import { pinKeys } from './query-keys'

import type { IPinStatusResponse } from './types'

/**
 * Cache configuration
 */
const FIVE_MINUTES_MS = 5 * 60 * 1000

/**
 * Hook to get PIN status for an employee
 * Automatically refetches every 5 minutes to keep status fresh
 *
 * @param employeeId - ID of employee
 * @param enabled - Whether to enable the query
 * @returns Query result with PIN status
 */
export const usePinStatus = (
  employeeId: number | undefined,
  enabled = true
): UseQueryResult<IPinStatusResponse> => {
  return useQuery({
    queryKey: pinKeys.status(employeeId!),
    queryFn: () => getPinStatus(employeeId!),
    enabled: enabled && Boolean(employeeId),
    staleTime: FIVE_MINUTES_MS,
    refetchInterval: FIVE_MINUTES_MS,
  })
}

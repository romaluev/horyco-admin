/**
 * File Queries
 * React Query queries for file data fetching
 */

import { useQuery } from '@tanstack/react-query'

import { getFileById, getEntityFiles } from './api'
import { fileKeys } from './query-keys'

import type { EntityType } from './types'

/**
 * Hook to fetch file by ID
 */
export const useGetFile = (fileId: number) => {
  return useQuery({
    queryKey: fileKeys.byId(fileId),
    queryFn: () => getFileById(fileId),
    enabled: !!fileId,
  })
}

/**
 * Hook to fetch all files for an entity
 */
export const useGetEntityFiles = (
  entityType: EntityType,
  entityId: number,
  enabled = true
) => {
  return useQuery({
    queryKey: fileKeys.byEntity(entityType, entityId),
    queryFn: () => getEntityFiles(entityType, entityId),
    enabled: enabled && !!entityId,
  })
}

/**
 * File API Client
 * Handles file management operations
 *
 * v4.0 Update: Using unified /files endpoint (no /admin prefix)
 * See: src/shared/lib/file-upload.ts for upload utilities
 * Docs: ADMIN_FILE_MANAGEMENT.md
 */

import api from '@/shared/lib/axios'

import type {
  EntityType,
  IDeleteFileParams,
  IFileResponse,
} from './types'

/**
 * Get file metadata with all variants
 * Returns fresh presigned URLs (15-minute expiry)
 */
export const getFileById = async (fileId: number): Promise<IFileResponse> => {
  const response = await api.get<{ success: boolean; data: IFileResponse }>(
    `/files/${fileId}`
  )
  return response.data.data
}

/**
 * Get all files for an entity
 */
export const getEntityFiles = async (
  entityType: EntityType,
  entityId: number
): Promise<IFileResponse[]> => {
  const response = await api.get<{ success: boolean; data: IFileResponse[] }>(
    `/files/entity/${entityType}/${entityId}`
  )
  return response.data.data
}

/**
 * Delete file from storage and database
 * entityType and entityId are required for validation
 */
export const deleteFile = async (
  params: IDeleteFileParams
): Promise<{ id: number }> => {
  const { fileId, entityType, entityId } = params

  const queryParams = new URLSearchParams()
  if (entityType !== undefined) {
    queryParams.append('entityType', entityType)
  }
  if (entityId !== undefined) {
    queryParams.append('entityId', String(entityId))
  }

  const queryString = queryParams.toString()
  const url = queryString
    ? `/files/${fileId}?${queryString}`
    : `/files/${fileId}`

  const response = await api.delete<{ id: number }>(url)
  return response.data
}

/**
 * File API Client
 * Handles file management operations
 *
 * Note: Admin Panel uses direct upload (Method 1) via /admin/files/upload
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
 */
export const getFileById = async (fileId: number): Promise<IFileResponse> => {
  const response = await api.get<IFileResponse>(`/admin/files/${fileId}`)
  return response.data
}

/**
 * Get all files for an entity
 */
export const getEntityFiles = async (
  entityType: EntityType,
  entityId: number
): Promise<IFileResponse[]> => {
  const response = await api.get<IFileResponse[]>(
    `/admin/files/entity/${entityType}/${entityId}`
  )
  return response.data
}

/**
 * Delete file from storage and database
 * entityType and entityId are optional (defaults: PRODUCT and 0)
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
    ? `/admin/files/${fileId}?${queryString}`
    : `/admin/files/${fileId}`

  const response = await api.delete<{ id: number }>(url)
  return response.data
}

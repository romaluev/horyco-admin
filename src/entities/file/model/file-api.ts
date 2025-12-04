/**
 * File Management API Client (v4.0 - Unified)
 * All endpoints under /files (not /admin/files or /pos/files)
 * Based on ADMIN_FILE_MANAGEMENT.md specification
 */

import api from '@/shared/lib/axios'

import type {
  FileUploadResponse,
  MultipleFilesUploadResponse,
  FileInfo,
  FileListResponse,
  FileDeleteResponse,
  EntityType,
} from './file-types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

/**
 * Upload single file
 * Automatically generates variants (original, large, medium, thumb)
 * Converts to WebP (~30% smaller)
 */
export const uploadFile = async (
  file: File,
  entityType: EntityType,
  entityId: number = 0,
  altText?: string
): Promise<FileUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  let url = `/files/upload?entityType=${entityType}&entityId=${entityId}`
  if (altText) {
    url += `&altText=${encodeURIComponent(altText)}`
  }

  const response = await api.post<ApiResponse<FileUploadResponse>>(
    url,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data.data
}

/**
 * Upload multiple files (max 10)
 * Returns array of uploaded files with progress
 */
export const uploadMultipleFiles = async (
  files: File[],
  entityType: EntityType,
  entityId: number = 0,
  onProgress?: (progress: number) => void
): Promise<MultipleFilesUploadResponse> => {
  if (files.length > 10) {
    throw new Error('Maximum 10 files can be uploaded at once')
  }

  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const url = `/files/upload-multiple?entityType=${entityType}&entityId=${entityId}`

  const response = await api.post<ApiResponse<MultipleFilesUploadResponse>>(
    url,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          onProgress?.(progress)
        }
      },
    }
  )

  return response.data.data
}

/**
 * Get file by ID
 */
export const getFile = async (fileId: number): Promise<FileInfo> => {
  const response = await api.get<ApiResponse<FileInfo>>(`/files/${fileId}`)
  return response.data.data
}

/**
 * List files for an entity
 */
export const listFiles = async (
  entityType?: EntityType,
  entityId?: number,
  page: number = 1,
  limit: number = 20
): Promise<FileListResponse> => {
  let url = '/files?'
  const params = new URLSearchParams()

  if (entityType) params.append('entityType', entityType)
  if (entityId) params.append('entityId', String(entityId))
  params.append('page', String(page))
  params.append('limit', String(limit))

  const response = await api.get<ApiResponse<FileListResponse>>(
    `/files?${params.toString()}`
  )
  return response.data.data
}

/**
 * Delete a file and all its variants
 */
export const deleteFile = async (fileId: number): Promise<FileDeleteResponse> => {
  const response = await api.delete<ApiResponse<FileDeleteResponse>>(
    `/files/${fileId}`
  )
  return response.data.data
}

/**
 * Update file metadata (altText, etc.)
 */
export const updateFileMetadata = async (
  fileId: number,
  data: {
    altText?: string
  }
): Promise<FileInfo> => {
  const response = await api.patch<ApiResponse<FileInfo>>(
    `/files/${fileId}`,
    data
  )
  return response.data.data
}

/**
 * Get presigned URL for a specific variant
 * Presigned URLs expire in 15 minutes
 */
export const getPresignedUrl = async (
  fileId: number,
  variant: 'original' | 'large' | 'medium' | 'thumb' = 'medium'
): Promise<string> => {
  const response = await api.get<
    ApiResponse<{
      url: string
      expiresAt: string
    }>
  >(`/files/${fileId}/presigned-url?variant=${variant}`)

  return response.data.data.url
}

/**
 * Delete multiple files
 */
export const deleteMultipleFiles = async (
  fileIds: number[]
): Promise<FileDeleteResponse> => {
  const response = await api.post<ApiResponse<FileDeleteResponse>>(
    '/files/delete-multiple',
    {
      fileIds,
    }
  )
  return response.data.data
}

/**
 * Check if file exists
 */
export const fileExists = async (fileId: number): Promise<boolean> => {
  try {
    await getFile(fileId)
    return true
  } catch {
    return false
  }
}

/**
 * Bulk upload with progress tracking
 */
export const bulkUploadFiles = async (
  files: File[],
  entityType: EntityType,
  entityId: number,
  onFileProgress?: (fileName: string, progress: number) => void
): Promise<FileUploadResponse[]> => {
  const results: FileUploadResponse[] = []

  for (let i = 0; i < files.length; i++) {
    const currentFile = files[i]
    if (!currentFile) continue

    try {
      const result = await uploadFile(currentFile, entityType, entityId)
      results.push(result)
      onFileProgress?.(currentFile.name, ((i + 1) / files.length) * 100)
    } catch (error) {
      console.error(`Failed to upload ${currentFile.name}:`, error)
      onFileProgress?.(currentFile.name, 0) // Mark as failed
    }
  }

  return results
}

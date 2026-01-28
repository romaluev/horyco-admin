/**
 * File Management Types (v4.0 - Unified API)
 * Based on ADMIN_FILE_MANAGEMENT.md specification
 */

export type EntityType =
  | 'PRODUCT'
  | 'CATEGORY'
  | 'BRANCH'
  | 'EMPLOYEE'
  | 'RESTAURANT_LOGO'
  | 'RECEIPT_TEMPLATE'
  | 'MENU_COVER'
  | 'PROMOTIONAL_IMAGE'

export type ImageVariant = 'original' | 'large' | 'medium' | 'thumb'

export interface ImageVariants {
  original: string // Full size presigned URL
  large: string // ~1200px presigned URL
  medium: string // ~800px presigned URL
  thumb: string // ~200px presigned URL
}

export interface FileMetadata {
  width: number
  height: number
  altText?: string
  originalFileName: string
}

export interface FileUploadResponse {
  id: number
  variants: ImageVariants
  metadata: FileMetadata
  mimeType: string
  size: number
  createdAt: string
}

export interface MultipleFilesUploadResponse {
  files: FileUploadResponse[]
  failedFiles?: {
    fileName: string
    error: string
  }[]
}

export interface FileInfo {
  id: number
  entityType: EntityType
  entityId: number
  variants: ImageVariants
  metadata: FileMetadata
  mimeType: string
  size: number
  createdAt: string
  updatedAt: string
}

export interface FileListResponse {
  files: FileInfo[]
  total: number
  page: number
  limit: number
}

export interface FileDeleteResponse {
  success: boolean
  message: string
}

export interface PresignedUrlResponse {
  url: string
  expiresAt: string
  signature: string
}

export interface FileUploadProgress {
  fileName: string
  progress: number // 0-100
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

// Form data for uploads
export interface FileUploadFormData {
  file: File
  entityType: EntityType
  entityId?: number
  altText?: string
}

export interface MultipleFileUploadFormData {
  files: File[]
  entityType: EntityType
  entityId?: number
}

import api from './axios'

import type { EntityType, IFileMetadata, IFileVariants } from '@/shared/file/model/types'

/**
 * Response from single file upload endpoint
 * Based on ADMIN_FILE_MANAGEMENT.md v4.0 specification
 */
export interface FileUploadResponse {
  id: number
  url: string
  filename: string
  size: number
  mimeType: string
  folder: string
  variants: IFileVariants
  metadata: IFileMetadata
}

/**
 * Response from multiple file upload endpoint
 */
export interface MultipleFileUploadResponse {
  files: FileUploadResponse[]
  total: number
}

/**
 * Upload a single file using direct upload method (Method 1 from docs)
 * v4.0: Uses entityType and entityId instead of folder
 *
 * @param file - The file to upload
 * @param entityType - Entity type (PRODUCT, CATEGORY, EMPLOYEE, etc.)
 * @param entityId - Entity ID (use 0 for temporary files)
 * @param altText - Optional alt text for the image
 * @returns Upload response with file metadata and variant URLs
 *
 * @example
 * ```typescript
 * const result = await uploadFile({
 *   file: imageFile,
 *   entityType: 'PRODUCT',
 *   entityId: 0,
 *   altText: 'Margherita Pizza'
 * })
 * const imageUrl = result.variants.medium || result.url
 * ```
 */
export async function uploadFile({
  file,
  entityType,
  entityId = 0,
  altText,
}: {
  file: File
  entityType: EntityType
  entityId?: number
  altText?: string
}): Promise<FileUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const params = new URLSearchParams()
  params.append('entityType', entityType)
  params.append('entityId', String(entityId))
  if (altText) {
    params.append('altText', altText)
  }

  // Don't set Content-Type header for FormData - let browser handle it
  const axiosResponse = await api.post<{ success: boolean; data: FileUploadResponse }>(
    `/files/upload?${params.toString()}`,
    formData,
    {
      headers: {
        'Content-Type': undefined,
      },
    }
  )

  return axiosResponse.data.data
}

/**
 * Upload multiple files at once (max 10 for admin, 5 for POS)
 * v4.0: Uses entityType and entityId instead of folder
 *
 * @param files - Array of files to upload
 * @param entityType - Entity type (PRODUCT, CATEGORY, etc.)
 * @param entityId - Entity ID (use 0 for temporary files)
 * @param altText - Optional alt text applied to all files
 * @returns Upload response with array of uploaded files
 *
 * @example
 * ```typescript
 * const result = await uploadMultipleFiles({
 *   files: [file1, file2, file3],
 *   entityType: 'PRODUCT',
 *   entityId: 0,
 *   altText: 'Product images'
 * })
 * const urls = result.files.map(f => f.variants.medium || f.url)
 * ```
 */
export async function uploadMultipleFiles({
  files,
  entityType,
  entityId = 0,
  altText,
}: {
  files: File[]
  entityType: EntityType
  entityId?: number
  altText?: string
}): Promise<MultipleFileUploadResponse> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const params = new URLSearchParams()
  params.append('entityType', entityType)
  params.append('entityId', String(entityId))
  if (altText) {
    params.append('altText', altText)
  }

  const axiosResponse = await api.post<{
    success: boolean
    data: MultipleFileUploadResponse
  }>(`/files/upload-multiple?${params.toString()}`, formData, {
    headers: {
      'Content-Type': undefined,
    },
  })

  return axiosResponse.data.data
}

/**
 * Select the best variant URL based on use case
 *
 * @param variants - The variant URLs object from upload response
 * @param preferredVariant - The preferred variant size
 * @returns The URL of the best available variant
 *
 * @example
 * ```typescript
 * // For product grid
 * const url = selectVariant(file.variants, 'medium')
 *
 * // For detail page
 * const url = selectVariant(file.variants, 'large')
 * ```
 */
export function selectVariant(
  variants: IFileVariants,
  preferredVariant: 'thumb' | 'medium' | 'large' | 'original' = 'medium'
): string {
  // Fallback chain based on preference
  const fallbackChains: Record<
    typeof preferredVariant,
    (keyof IFileVariants)[]
  > = {
    thumb: ['thumb', 'medium', 'large', 'original'],
    medium: ['medium', 'large', 'original', 'thumb'],
    large: ['large', 'original', 'medium', 'thumb'],
    original: ['original', 'large', 'medium', 'thumb'],
  }

  const chain = fallbackChains[preferredVariant]

  for (const variant of chain) {
    if (variants[variant]) {
      return variants[variant]!
    }
  }

  // Should never happen, but provide safety
  return ''
}

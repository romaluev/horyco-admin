import type { FileFolder } from '@/entities/file/model/constants'
import type { IFileMetadata, IFileVariants } from '@/entities/file/model/types'

/**
 * Response from single file upload endpoint
 * Based on ADMIN_FILE_MANAGEMENT.md specification
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
 * Uses query parameters for folder and altText as per ADMIN_FILE_MANAGEMENT.md
 *
 * @param file - The file to upload
 * @param folder - The storage folder (products, categories, modifiers, etc.)
 * @param altText - Optional alt text for the image
 * @returns Upload response with file metadata and variant URLs
 *
 * @example
 * ```typescript
 * const result = await uploadFile({
 *   file: imageFile,
 *   folder: FILE_FOLDERS.PRODUCTS,
 *   altText: 'Margherita Pizza'
 * })
 * const imageUrl = result.variants.medium || result.url
 * ```
 */
export async function uploadFile({
  file,
  folder,
  altText,
}: {
  file: File
  folder: FileFolder
  altText?: string
}): Promise<FileUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const params = new URLSearchParams()
  params.append('folder', folder)
  if (altText) {
    params.append('altText', altText)
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/files/upload?${params.toString()}`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'File upload failed')
  }

  return response.json()
}

/**
 * Upload multiple files at once (max 10 files)
 * Uses query parameters for folder and altText as per ADMIN_FILE_MANAGEMENT.md
 *
 * @param files - Array of files to upload (max 10)
 * @param folder - The storage folder
 * @param altText - Optional alt text applied to all files
 * @returns Upload response with array of uploaded files
 *
 * @example
 * ```typescript
 * const result = await uploadMultipleFiles({
 *   files: [file1, file2, file3],
 *   folder: FILE_FOLDERS.PRODUCTS,
 *   altText: 'Product images'
 * })
 * const urls = result.files.map(f => f.variants.medium || f.url)
 * ```
 */
export async function uploadMultipleFiles({
  files,
  folder,
  altText,
}: {
  files: File[]
  folder: FileFolder
  altText?: string
}): Promise<MultipleFileUploadResponse> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const params = new URLSearchParams()
  params.append('folder', folder)
  if (altText) {
    params.append('altText', altText)
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/files/upload-multiple?${params.toString()}`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Multiple file upload failed')
  }

  return response.json()
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

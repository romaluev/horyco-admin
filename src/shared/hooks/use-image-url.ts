import { useEffect, useState } from 'react'

import { getFileById } from '@/entities/file/model/api'

/**
 * Hook to resolve image URL from either imageUrls variants or file ID
 * Handles the new file management system where:
 * - `image` or similar field contains FILE ID (number stored as string)
 * - `imageUrls` contains presigned URLs for different variants
 *
 * @param imageUrls - Object with variant URLs (thumb, medium, original, large)
 * @param fileId - File ID to fetch if imageUrls not available
 * @param preferredVariant - Preferred variant size (thumb, medium, large, original)
 * @returns Image URL or undefined
 */
export function useImageUrl(
  imageUrls?: {
    thumb?: string
    medium?: string
    large?: string
    original?: string
  },
  fileId?: string | number,
  preferredVariant: 'thumb' | 'medium' | 'large' | 'original' = 'thumb'
): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    const resolveUrl = async () => {
      // Prefer imageUrls if available
      if (imageUrls) {
        const variantUrl =
          imageUrls[preferredVariant] ||
          imageUrls.medium ||
          imageUrls.original ||
          imageUrls.thumb

        setUrl(variantUrl)
        return
      }

      // Fallback: fetch file by ID if available
      if (!fileId) {
        setUrl(undefined)
        return
      }

      try {
        const numericId = Number(fileId)
        if (isNaN(numericId)) {
          setUrl(undefined)
          return
        }

        const file = await getFileById(numericId)
        const variantUrl =
          file.variants?.[preferredVariant] ||
          file.variants?.medium ||
          file.variants?.original ||
          file.variants?.thumb

        setUrl(variantUrl)
      } catch (error) {
        console.error('Error fetching image URL:', error)
        setUrl(undefined)
      }
    }

    resolveUrl()
  }, [imageUrls, fileId, preferredVariant])

  return url
}

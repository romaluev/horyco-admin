'use client'

import { useImageUrl } from '@/shared/hooks/use-image-url'

interface ImageCellProps {
  imageUrls?: {
    thumb?: string
    medium?: string
    large?: string
    original?: string
  }
  fileId?: string | number
  alt?: string
  className?: string
  preferredVariant?: 'thumb' | 'medium' | 'large' | 'original'
}

export function ImageCell({
  imageUrls,
  fileId,
  alt = 'Image',
  className = 'h-10 w-10 rounded-md object-cover',
  preferredVariant = 'thumb',
}: ImageCellProps) {
  const imageUrl = useImageUrl(imageUrls, fileId, preferredVariant)

  if (!imageUrl) {
    return <div className={`${className} bg-muted rounded-md`} />
  }

  return <img src={imageUrl} alt={alt} className={className} />
}

/**
 * Image Upload Component
 * Stores file locally, uploads only when form is submitted
 */

'use client'

import { useCallback, useState, useEffect } from 'react'

import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'

import { useImageUrl } from '@/shared/hooks/use-image-url'

import { Button } from './base/button'
import { cn } from '../lib/utils'

interface ImageUploadProps {
  value?: File | null
  onChange: (value: File | null) => void
  className?: string
  currentImageUrl?: string
  currentImageUrls?: {
    thumb?: string
    medium?: string
    large?: string
    original?: string
  }
}

export const ImageUpload = ({
  value,
  onChange,
  className,
  currentImageUrl,
  currentImageUrls,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const resolvedImageUrl = useImageUrl(currentImageUrls, currentImageUrl, 'medium')

  useEffect(() => {
    if (value) {
      const previewUrl = URL.createObjectURL(value)
      setPreview(previewUrl)
      return () => URL.revokeObjectURL(previewUrl)
    }
    setPreview(null)
    return undefined
  }, [value])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите изображение')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB')
        return
      }

      onChange(file)
    },
    [onChange]
  )

  const handleRemove = useCallback(() => {
    onChange(null)
  }, [onChange])

  const displayImage = preview || resolvedImageUrl

  return (
    <div className={cn('space-y-2', className)}>
      {displayImage ? (
        <div className="relative inline-block">
          <img
            src={displayImage}
            alt="Uploaded"
            className="h-32 w-32 rounded-md border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          className={cn(
            'flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors',
            'hover:border-primary hover:bg-accent'
          )}
        >
          <Upload className="text-muted-foreground h-8 w-8" />
          <span className="text-muted-foreground mt-2 text-xs">Загрузить</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
      <p className="text-muted-foreground text-xs">
        Рекомендуемый размер: 512x512px. Макс: 5MB
      </p>
    </div>
  )
}

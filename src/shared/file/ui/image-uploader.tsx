'use client'

import { useCallback, useState } from 'react'

import { Upload, Loader2, X, CheckCircle2 } from 'lucide-react'

import { uploadFile, deleteFile } from '@/shared/file/model/file-api'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import { Card } from '@/shared/ui/base/card'
import { Input } from '@/shared/ui/base/input'
import { Label } from '@/shared/ui/base/label'
import { Progress } from '@/shared/ui/base/progress'


import type { EntityType, FileUploadResponse } from '@/shared/file/model/file-types'

interface ImageUploaderProps {
  entityType: EntityType
  entityId?: number
  onUploadSuccess?: (file: FileUploadResponse) => void
  onUploadError?: (error: string) => void
  maxSize?: number // bytes
  accept?: string
  disabled?: boolean
  preview?: string // Current image URL to preview
  className?: string
}

export function ImageUploader({
  entityType,
  entityId = 0,
  onUploadSuccess,
  onUploadError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = 'image/*',
  disabled = false,
  preview,
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<FileUploadResponse | null>(null)

  const handleFile = useCallback(
    async (file: File) => {
      try {
        setError(null)
        setProgress(0)

        // Validate file size
        if (file.size > maxSize) {
          const sizeMB = (maxSize / (1024 * 1024)).toFixed(1)
          throw new Error(`File size must be less than ${sizeMB}MB`)
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are supported')
        }

        setIsLoading(true)
        setProgress(10)

        const result = await uploadFile(file, entityType, entityId)
        setProgress(100)
        setUploadedFile(result)
        onUploadSuccess?.(result)

        // Reset after success
        setTimeout(() => {
          setProgress(0)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        setError(message)
        onUploadError?.(message)
        setIsLoading(false)
      }
    },
    [entityType, entityId, maxSize, onUploadSuccess, onUploadError]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDelete = async () => {
    if (!uploadedFile) return

    try {
      setIsLoading(true)
      await deleteFile(uploadedFile.id)
      setUploadedFile(null)
      setProgress(0)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const displayImage = uploadedFile?.variants.medium || preview

  return (
    <div className={cn('space-y-4', className)}>
      {displayImage && (
        <div className="relative inline-block">
          <img
            src={displayImage}
            alt="Preview"
            className="h-32 w-32 rounded-lg object-cover"
          />
          {!isLoading && uploadedFile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="absolute -right-2 -top-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {!uploadedFile && !displayImage && (
        <div
          onDragOver={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">
            {isLoading ? 'Uploading...' : 'Drag and drop your image here'}
          </p>
          <p className="text-xs text-muted-foreground">
            or click to select (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)
          </p>

          <Input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            disabled={isLoading || disabled}
            className="hidden"
            id={`file-input-${entityType}-${entityId}`}
          />

          {!isLoading && (
            <Label
              htmlFor={`file-input-${entityType}-${entityId}`}
              className="mt-4 inline-block"
            >
              <Button asChild variant="outline" disabled={disabled}>
                <span>Select File</span>
              </Button>
            </Label>
          )}
        </div>
      )}

      {isLoading && <Progress value={progress} className="h-2" />}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {uploadedFile && (
        <Card className="bg-green-50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-green-700">
              {uploadedFile.metadata.originalFileName} uploaded successfully
            </span>
          </div>
        </Card>
      )}
    </div>
  )
}

'use client'

import * as React from 'react'

import { useFormContext } from 'react-hook-form'

import { FormItem, FormLabel, FormMessage } from '@/shared/ui/base/form'
import { ImageUpload } from '@/shared/ui/image-upload'

interface ProductFormImagesProps {
  imageFile: File | null
  setImageFile: (file: File | null) => void
  currentImageUrl?: string
  currentImageUrls?: {
    thumb?: string
    medium?: string
    large?: string
    original?: string
  }
}

export function ProductFormImages({
  imageFile,
  setImageFile,
  currentImageUrl,
  currentImageUrls,
}: ProductFormImagesProps) {
  return (
    <FormItem className="md:col-span-6">
      <FormLabel>Изображение продукта</FormLabel>
      <ImageUpload
        value={imageFile}
        onChange={setImageFile}
        currentImageUrl={currentImageUrl}
        currentImageUrls={currentImageUrls}
      />
      <FormMessage />
    </FormItem>
  )
}

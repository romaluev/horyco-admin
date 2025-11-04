/**
 * File Mutations
 * React Query mutations for file operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  requestPresignedUploadUrl,
  uploadToPresignedUrl,
  confirmUpload,
  deleteFile,
} from './api'
import { fileKeys } from './query-keys'

import type {
  IPresignedUploadUrlRequest,
  IConfirmUploadRequest,
  IDeleteFileParams,
} from './types'

/**
 * Hook to upload file using presigned URL flow
 * 1. Request presigned URL
 * 2. Upload file to storage
 * 3. Confirm upload
 */
export const useUploadFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      entityType,
      entityId,
      altText,
    }: {
      file: File
      entityType: IPresignedUploadUrlRequest['entityType']
      entityId: number
      altText?: string
    }) => {
      // Step 1: Request presigned URL
      const presignedData = await requestPresignedUploadUrl({
        entityType,
        entityId,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        altText,
      })

      // Step 2: Upload to storage
      await uploadToPresignedUrl(presignedData.data.uploadUrl, file)

      // Step 3: Confirm upload
      const fileResponse = await confirmUpload({
        fileId: presignedData.data.fileId,
        fileKey: presignedData.data.fileKey,
      })

      return fileResponse
    },
    onSuccess: (data) => {
      // Invalidate entity files cache
      queryClient.invalidateQueries({
        queryKey: fileKeys.byEntity(data.entityType, data.entityId),
      })
      toast.success('Файл успешно загружен')
    },
    onError: (error: Error) => {
      console.error('Upload error:', error)
      toast.error('Ошибка при загрузке файла')
    },
  })
}

/**
 * Hook to delete file
 */
export const useDeleteFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: (_, variables) => {
      // Invalidate entity files cache
      queryClient.invalidateQueries({
        queryKey: fileKeys.byEntity(variables.entityType, variables.entityId),
      })
      toast.success('Файл успешно удален')
    },
    onError: (error: Error) => {
      console.error('Delete error:', error)
      toast.error('Ошибка при удалении файла')
    },
  })
}

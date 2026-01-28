/**
 * File Mutations
 * React Query mutations for file operations
 *
 * Note: Admin Panel uses direct upload method via uploadFile() utility
 * See: src/shared/lib/file-upload.ts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteFile } from './api'
import { fileKeys } from './query-keys'

/**
 * Hook to delete file
 */
export const useDeleteFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: (_, variables) => {
      // Invalidate entity files cache if entityType is provided
      if (variables.entityType && variables.entityId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: fileKeys.byEntity(variables.entityType, variables.entityId),
        })
      }
      toast.success('Файл успешно удален')
    },
    onError: (error: Error) => {
      console.error('Delete error:', error)
      toast.error('Ошибка при удалении файла')
    },
  })
}

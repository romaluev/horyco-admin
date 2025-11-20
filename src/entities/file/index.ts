/**
 * File Entity Public API
 * Named exports only (FSD standard)
 *
 * Note: Admin Panel uses direct upload via uploadFile() utility
 * See: src/shared/lib/file-upload.ts for upload operations
 */

// Types
export type {
  EntityType,
  IFile,
  IFileVariants,
  IFileMetadata,
  IFileResponse,
  IDeleteFileParams,
} from './model/types'

// API
export {
  getFileById,
  getEntityFiles,
  deleteFile,
} from './model/api'

// Hooks
export { useDeleteFile } from './model/mutations'
export { useGetFile, useGetEntityFiles } from './model/queries'

// Query Keys
export { fileKeys } from './model/query-keys'

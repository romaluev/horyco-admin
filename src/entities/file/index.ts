/**
 * File Entity Public API
 * Named exports only (FSD standard)
 */

// Types
export type {
  EntityType,
  IFile,
  IFileVariants,
  IFileMetadata,
  IPresignedUploadUrlRequest,
  IPresignedUploadUrlResponse,
  IConfirmUploadRequest,
  IFileResponse,
  IDeleteFileParams
} from './model/types';

// API
export {
  requestPresignedUploadUrl,
  confirmUpload,
  uploadToPresignedUrl,
  getFileById,
  getEntityFiles,
  deleteFile
} from './model/api';

// Hooks
export { useUploadFile, useDeleteFile } from './model/mutations';
export { useGetFile, useGetEntityFiles } from './model/queries';

// Query Keys
export { fileKeys } from './model/query-keys';

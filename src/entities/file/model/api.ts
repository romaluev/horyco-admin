/**
 * File API Client
 * Handles presigned URL uploads and file management
 */

import api from '@/shared/lib/axios';

import type {
  IPresignedUploadUrlRequest,
  IPresignedUploadUrlResponse,
  IConfirmUploadRequest,
  IFileResponse,
  IDeleteFileParams,
  EntityType
} from './types';

/**
 * Request presigned upload URL for direct client upload
 */
export const requestPresignedUploadUrl = async (
  data: IPresignedUploadUrlRequest
): Promise<IPresignedUploadUrlResponse> => {
  const response = await api.post<IPresignedUploadUrlResponse>(
    '/admin/files/upload-url',
    data
  );
  return response.data;
};

/**
 * Confirm upload after successfully uploading to presigned URL
 */
export const confirmUpload = async (
  data: IConfirmUploadRequest
): Promise<IFileResponse> => {
  const response = await api.post<IFileResponse>('/admin/files/confirm', data);
  return response.data;
};

/**
 * Get file metadata with all variants
 */
export const getFileById = async (fileId: number): Promise<IFileResponse> => {
  const response = await api.get<IFileResponse>(`/admin/files/${fileId}`);
  return response.data;
};

/**
 * Get all files for an entity
 */
export const getEntityFiles = async (
  entityType: EntityType,
  entityId: number
): Promise<IFileResponse[]> => {
  const response = await api.get<IFileResponse[]>(
    `/admin/files/entity/${entityType}/${entityId}`
  );
  return response.data;
};

/**
 * Delete file from storage and database
 */
export const deleteFile = async (
  params: IDeleteFileParams
): Promise<{ id: number }> => {
  const { fileId, entityType, entityId } = params;
  const response = await api.delete<{ id: number }>(
    `/admin/files/${fileId}?entityType=${entityType}&entityId=${entityId}`
  );
  return response.data;
};

/**
 * Upload file directly to presigned URL
 * This bypasses the API server and uploads directly to storage
 */
export const uploadToPresignedUrl = async (
  uploadUrl: string,
  file: File
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
};

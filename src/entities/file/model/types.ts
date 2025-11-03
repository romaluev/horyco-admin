/**
 * File Entity Types
 * Based on ADMIN_FILE_MANAGEMENT.md specification
 */

export type EntityType =
  | 'PRODUCT'
  | 'CATEGORY'
  | 'MODIFIER'
  | 'ADDITION_ITEM'
  | 'EMPLOYEE'
  | 'TENANT'
  | 'BRANCH'
  | 'RECEIPT_TEMPLATE';

export interface IFileVariants {
  original?: string;
  large?: string;
  medium?: string;
  thumb?: string;
}

export interface IFileMetadata {
  width?: number;
  height?: number;
  altText?: string;
  confirmed?: boolean;
  confirmedAt?: string;
  processedAt?: string;
}

export interface IFile {
  id: number;
  entityType: EntityType;
  entityId: number;
  folder: string;
  originalName: string;
  mimeType: string;
  size: number;
  variants: IFileVariants;
  metadata: IFileMetadata;
  createdAt: string;
}

export interface IPresignedUploadUrlRequest {
  entityType: EntityType;
  entityId: number;
  fileName: string;
  mimeType: string;
  fileSize: number;
  altText?: string;
}

export interface IPresignedUploadUrlResponse {
  data: {
    uploadUrl: string;
    fileId: number;
    fileKey: string;
    expiresIn: number;
  }
}

export interface IConfirmUploadRequest {
  fileId: number;
  fileKey: string;
}

export interface IFileResponse extends IFile {}

export interface IDeleteFileParams {
  fileId: number;
  entityType: EntityType;
  entityId: number;
}

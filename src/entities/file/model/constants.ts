/**
 * File upload constants
 * Based on ADMIN_FILE_MANAGEMENT.md v4.0 specification
 */

import type { EntityType } from './types'

/**
 * @deprecated Use EntityType enum instead (v4.0 migration)
 * Legacy folder constants for backward compatibility
 */
export const FILE_FOLDERS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  MODIFIERS: 'modifiers',
  EMPLOYEES: 'employees',
  LOGOS: 'logos',
  BRANDING: 'branding',
  DOCUMENTS: 'documents',
  MISC: 'misc',
} as const

export type FileFolder = (typeof FILE_FOLDERS)[keyof typeof FILE_FOLDERS]

/**
 * Map legacy folder names to v4.0 EntityType enum
 * Use this for migrating old folder-based code
 */
export const FOLDER_TO_ENTITY_TYPE: Record<FileFolder, EntityType> = {
  products: 'PRODUCT',
  categories: 'CATEGORY',
  modifiers: 'MODIFIER',
  employees: 'EMPLOYEE',
  logos: 'TENANT',
  branding: 'TENANT',
  documents: 'TENANT',
  misc: 'TENANT',
} as const

/**
 * Maximum file size for uploads (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024

/**
 * Allowed image MIME types
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

/**
 * Maximum number of files per multi-upload request
 * Admin: 10 files, POS: 5 files (enforced by backend)
 */
export const MAX_FILES_PER_UPLOAD = 10

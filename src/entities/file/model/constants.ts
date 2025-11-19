/**
 * File upload folder constants
 * Based on ADMIN_FILE_MANAGEMENT.md specification
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
 */
export const MAX_FILES_PER_UPLOAD = 10

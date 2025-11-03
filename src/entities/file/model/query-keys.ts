/**
 * File Query Keys Factory
 * Centralized query key management for file operations
 */

import type { EntityType } from './types'

export const fileKeys = {
  all: ['files'] as const,
  byId: (fileId: number) => [...fileKeys.all, fileId] as const,
  byEntity: (entityType: EntityType, entityId: number) =>
    [...fileKeys.all, 'entity', entityType, entityId] as const,
}

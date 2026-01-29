import type { IGetMovementsParams } from './types'

export const movementKeys = {
  all: ['movements'] as const,
  lists: () => [...movementKeys.all, 'list'] as const,
  list: (params?: IGetMovementsParams) =>
    [...movementKeys.lists(), params] as const,
  details: () => [...movementKeys.all, 'detail'] as const,
  detail: (id: number) => [...movementKeys.details(), id] as const,
}

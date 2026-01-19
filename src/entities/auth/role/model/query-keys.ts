/**
 * React Query key factory for roles
 */

export const roleKeys = {
  all: () => ['roles'] as const,
  lists: () => [...roleKeys.all(), 'list'] as const,
  list: () => [...roleKeys.lists()] as const,
  byId: (id: number) => [...roleKeys.all(), id] as const,
  permissions: () => ['permissions'] as const,
  permissionsGrouped: () => [...roleKeys.permissions(), 'grouped'] as const,
} as const

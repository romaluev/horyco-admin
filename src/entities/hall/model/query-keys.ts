export const hallKeys = {
  all: ['halls'] as const,
  lists: () => [...hallKeys.all, 'list'] as const,
  list: (branchId: number) => [...hallKeys.lists(), branchId] as const,
  details: () => [...hallKeys.all, 'detail'] as const,
  detail: (id: number) => [...hallKeys.details(), id] as const,
  canDelete: (id: number) => [...hallKeys.all, 'can-delete', id] as const,
}

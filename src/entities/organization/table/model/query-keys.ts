export const tableKeys = {
  all: ['tables'] as const,
  lists: () => [...tableKeys.all, 'list'] as const,
  list: (hallId: number) => [...tableKeys.lists(), hallId] as const,
  details: () => [...tableKeys.all, 'detail'] as const,
  detail: (id: number) => [...tableKeys.details(), id] as const,
  session: (id: number) => [...tableKeys.all, 'session', id] as const,
}

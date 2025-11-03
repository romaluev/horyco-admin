export const tableKeys = {
  all: ['table'] as const,
  lists: () => [...tableKeys.all, 'list'] as const,
  list: (filters: string) => [...tableKeys.lists(), { filters }] as const,
  details: () => [...tableKeys.all, 'detail'] as const,
  detail: (id: number) => [...tableKeys.details(), id] as const,
}

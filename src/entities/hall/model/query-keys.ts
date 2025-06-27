export const hallKeys = {
  all: ['halls'] as const,
  lists: () => [...hallKeys.all, 'list'] as const,
  list: (filters: string) => [...hallKeys.lists(), { filters }] as const,
  details: () => [...hallKeys.all, 'detail'] as const,
  detail: (id: number) => [...hallKeys.details(), id] as const
};

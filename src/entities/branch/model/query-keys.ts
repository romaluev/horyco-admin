export const queryKeys = {
  all: () => ['branches'],
  byId: (id: number) => ['branches', id],
  canDelete: (id: number) => ['branches', id, 'can-delete'],
  statistics: (id: number, period: string) => [
    'branches',
    id,
    'statistics',
    period,
  ],
} as const

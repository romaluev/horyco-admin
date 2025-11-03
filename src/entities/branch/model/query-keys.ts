export const queryKeys = {
  all: () => ['branches'],
  byId: (id: number) => ['branches', id],
} as const

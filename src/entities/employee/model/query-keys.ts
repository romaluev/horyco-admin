export const queryKeys = {
  all: () => ['employee'],
  byId: (id: number) => ['employee', id]
} as const;

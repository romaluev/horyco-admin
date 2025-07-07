export const queryKeys = {
  all: () => ['employee'],
  byId: (id: number) => ['employee', id],
  profile: () => ['employee', 'profile']
} as const;

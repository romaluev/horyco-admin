/**
 * Query keys for PIN management
 * Used for React Query cache invalidation
 */

export const pinKeys = {
  all: ['pin'] as const,
  status: (employeeId: number) => ['pin', 'status', employeeId] as const,
}

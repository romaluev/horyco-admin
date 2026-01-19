import type { IEmployeeFilters } from './types'

export const employeeKeys = {
  all: () => ['employees'] as const,
  lists: () => [...employeeKeys.all(), 'list'] as const,
  list: (filters?: IEmployeeFilters) =>
    [...employeeKeys.lists(), { filters }] as const,
  details: () => [...employeeKeys.all(), 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  byBranch: (branchId: number) =>
    [...employeeKeys.all(), 'branch', branchId] as const,
} as const

import { useQuery } from '@tanstack/react-query';

import { employeeApi } from './api';
import { employeeKeys } from './query-keys';

import type { IEmployeeFilters } from './types';

/**
 * Get all employees with optional filters
 * @param filters - Optional filters (branchId, roleId, status, search)
 */
export const useGetEmployees = (filters?: IEmployeeFilters) => {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => employeeApi.getEmployees(filters),
  });
};

/**
 * Get employee by ID
 * @param id - Employee ID
 */
export const useGetEmployeeById = (id: number) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

/**
 * Get employees by branch
 * @param branchId - Branch ID
 */
export const useGetEmployeesByBranch = (branchId: number) => {
  return useQuery({
    queryKey: employeeKeys.byBranch(branchId),
    queryFn: () => employeeApi.getEmployeesByBranch(branchId),
    enabled: Number.isFinite(branchId) && branchId > 0,
  });
};

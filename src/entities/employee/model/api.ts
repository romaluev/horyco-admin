import api from '@/shared/lib/axios';
import { IEmployee, IEmployeeDto } from './types';
import { ApiParams, PaginatedResponse } from '@/shared/types';

/**
 * Employee API functions
 */

export const employeeAPi = {
  getEmployee: async (
    searchParams: ApiParams = {}
  ): Promise<PaginatedResponse<IEmployee>> => {
    const params = new URLSearchParams();

    params.append('page', String(searchParams.page) || '0');
    params.append('size', String(searchParams.size) || '100');
    if (searchParams.filters) {
      params.append('filters', searchParams.filters);
    }

    const response = await api.get<PaginatedResponse<IEmployee>>('/employee', {
      params
    });
    return response.data;
  },

  /**
   * Get an employer by ID
   * @param id - The employee ID
   * @returns Promise with the employee
   */
  getEmployerById: async (id: number): Promise<IEmployee> => {
    const response = await api.get<IEmployee>(`/employee/${id}`);
    return response.data;
  }
};

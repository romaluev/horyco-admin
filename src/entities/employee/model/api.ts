import api from '@/shared/lib/axios';
import { IEmployee, IEmployeeDto } from './types';
import { ApiParams, PaginatedResponse } from '@/shared/types';

/**
 * Employee API functions
 */

export const employeeAPi = {
  createEmployee: async (employeeData: IEmployeeDto): Promise<IEmployee> => {
    const response = await api.post<IEmployee>('/employee', employeeData);
    return response.data;
  },

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
  },

  /**
   * Update a employee
   * @param id - The employee ID
   * @param employeeData - The employee data to update
   * @returns Promise with the updated employee
   */
  updateEmployee: async (
    id: number,
    employeeData: IEmployeeDto
  ): Promise<IEmployee> => {
    const response = await api.patch<IEmployee>(
      `/employee/${id}`,
      employeeData
    );
    return response.data;
  },

  /**
   * Delete a employee
   * @param id - The employee ID
   * @returns Promise with the deleted employee
   */
  deleteEmployer: async (id: number): Promise<void> => {
    await api.delete(`/employee/${id}`);
  }
};

import api from '@/lib/axios';
import { IEmployee, IEmployeeDto } from './types';
import {
  FilteringParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams
} from '@/types';

/**
 * Employee API functions
 */

export const employeeAPi = {
  /**
   * Create a new employee
   * @param employeeData - The employee data to create
   * @returns Promise with the created employee
   */
  createEmployee: async (employeeData: IEmployeeDto): Promise<IEmployee> => {
    const response = await api.post<IEmployee>('/employee', employeeData);
    return response.data;
  },

  /**
   * Get all employee with pagination, sorting, and filtering
   * @param pagination - Pagination parameters
   * @param sorting - Sorting parameters
   * @param filtering - Filtering parameters
   * @returns Promise with paginated employee
   */
  getEmployee: async (
    pagination?: PaginationParams,
    sorting?: SortingParams,
    filtering?: FilteringParams[]
  ): Promise<PaginatedResponse<IEmployee>> => {
    const params = new URLSearchParams();

    params.append('page', '0');
    params.append('size', '100');

    if (pagination) {
      if (Number.isInteger(pagination.page))
        params.append('page', pagination.page + '');
      if (pagination.size) params.append('size', pagination.size.toString());
    }

    // Add sorting params
    // if (sorting) {
    //   params.append('sortBy', sorting.field);
    //   params.append('sortOrder', sorting.order);
    // }

    // Add filtering params
    if (filtering && filtering.length > 0) {
      filtering.forEach((filter, index) => {
        params.append(`filters[${index}][field]`, filter.field);
        params.append(`filters[${index}][value]`, filter.value.toString());
      });
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
    const response = await api.put<IEmployee>(`/employee/${id}`, employeeData);
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

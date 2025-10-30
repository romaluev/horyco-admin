import api from '@/shared/lib/axios';

import type { IEmployee, IEmployeeDto } from '@/entities/employee';

/**
 * Employee API functions
 */

export const employeeAPi = {
  createEmployee: async (employeeData: IEmployeeDto): Promise<IEmployee> => {
    const response = await api.post<IEmployee>('/employee', employeeData);
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

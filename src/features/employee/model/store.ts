import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IEmployee, IEmployeeRequest } from './types';
import { toast } from 'sonner';
import { FilteringParams, PaginationParams, SortingParams } from '@/types';
import { employeeAPi } from '@/features/employee/model/api';

interface EmployeeState {
  employee: IEmployee[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  fetchEmployee: (
    pagination?: PaginationParams,
    sorting?: SortingParams,
    filtering?: FilteringParams[]
  ) => Promise<IEmployee[]>;
  getEmployerById: (id: number) => Promise<IEmployee | null>;
  createEmployee: (data: IEmployeeRequest) => Promise<IEmployee | null>;
  updateEmployee: (
    id: number,
    data: IEmployeeRequest
  ) => Promise<IEmployee | null>;
  deleteEmployee: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      employee: [],
      totalItems: 0,
      isLoading: false,
      error: null,

      fetchEmployee: async (
        pagination,
        sorting,
        filtering
      ): Promise<IEmployee[]> => {
        try {
          set({ isLoading: true, error: null });
          const response = await employeeAPi.getEmployee(
            pagination,
            sorting,
            filtering
          );
          set({
            employee: response.items,
            totalItems: response.totalItems,
            isLoading: false
          });
          return response.items;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch employee'
          });
          toast.error('Failed to fetch employee');
          return [];
        }
      },

      getEmployerById: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          const employee = await employeeAPi.getEmployerById(id);
          set({ isLoading: false });
          return employee;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch employee'
          });
          toast.error('Failed to fetch employee');
          return null;
        }
      },

      createEmployee: async (data: IEmployeeRequest) => {
        try {
          set({ isLoading: true, error: null });
          const newEmployee = await employeeAPi.createEmployee(data);

          // Update local state with the new employee
          set((state) => ({
            employee: [...state.employee, newEmployee],
            totalItems: state.totalItems + 1,
            isLoading: false
          }));

          toast.success('Employee created successfully');
          return newEmployee;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to create employee'
          });
          toast.error('Failed to create employee');
          return null;
        }
      },

      updateEmployee: async (id: number, data: IEmployeeRequest) => {
        try {
          set({ isLoading: true, error: null });
          const updatedEmployee = await employeeAPi.updateEmployee(id, data);

          // Update local state with the updated employee
          set((state) => ({
            employee: state.employee.map((employer) =>
              employer.id === id ? updatedEmployee : employer
            ),
            isLoading: false
          }));

          toast.success('Employer updated successfully');
          return updatedEmployee;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update employee'
          });
          toast.error('Failed to update employee');
          return null;
        }
      },

      deleteEmployee: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          await employeeAPi.deleteEmployee(id);

          // Update local state by removing the deleted employee
          set((state) => ({
            employee: state.employee.filter((employer) => employer.id !== id),
            totalItems: state.totalItems - 1,
            isLoading: false
          }));

          toast.success('Employee deleted successfully');
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to delete employee'
          });
          toast.error('Failed to delete employee');
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'employee-storage', // name of the item in localStorage
      partialize: (state) => ({
        employee: state.employee,
        totalItems: state.totalItems
      })
    }
  )
);

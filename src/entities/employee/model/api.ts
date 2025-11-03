import api from '@/shared/lib/axios'

import type {
  IBulkImportResult,
  IChangePasswordDto,
  ICreateEmployeeDto,
  IEmployee,
  IEmployeeFilters,
  IPaginatedResponse,
  IUpdateEmployeeDto,
} from './types'

/**
 * API Response wrapper from backend
 */
interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

const BASE_URL = '/admin/staff/employees'

export const employeeApi = {
  /**
   * Get all employees with optional filters and pagination
   * @param filters - Optional filters (branchId, roleId, status, search, page, limit)
   * @returns Promise with array of employees or paginated response
   */
  getEmployees: async (
    filters?: IEmployeeFilters
  ): Promise<IEmployee[] | IPaginatedResponse<IEmployee>> => {
    const params = new URLSearchParams()

    if (filters?.branchId) {
      params.append('branchId', filters.branchId.toString())
    }
    if (filters?.roleId) {
      params.append('roleId', filters.roleId.toString())
    }
    if (filters?.status) {
      params.append('status', filters.status)
    }
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString())
    }

    const response = await api.get<
      ApiResponse<IEmployee[] | IPaginatedResponse<IEmployee>>
    >(BASE_URL, { params })
    return response.data.data
  },

  /**
   * Get employee by ID
   * @param id - Employee ID
   * @returns Promise with employee details
   */
  getEmployeeById: async (id: number): Promise<IEmployee> => {
    const response = await api.get<ApiResponse<IEmployee>>(`${BASE_URL}/${id}`)
    return response.data.data
  },

  /**
   * Get employees by branch
   * @param branchId - Branch ID
   * @returns Promise with array of employees
   */
  getEmployeesByBranch: async (branchId: number): Promise<IEmployee[]> => {
    const response = await api.get<ApiResponse<IEmployee[]>>(
      `${BASE_URL}/branch/${branchId}`
    )
    return response.data.data
  },

  /**
   * Create new employee
   * @param data - Employee creation data
   * @returns Promise with created employee
   */
  createEmployee: async (data: ICreateEmployeeDto): Promise<IEmployee> => {
    const response = await api.post<ApiResponse<IEmployee>>(BASE_URL, data)
    return response.data.data
  },

  /**
   * Bulk import employees from CSV file
   * @param file - CSV file containing employee data
   * @returns Promise with bulk import results
   */
  bulkImportEmployees: async (file: File): Promise<IBulkImportResult> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<ApiResponse<IBulkImportResult>>(
      `${BASE_URL}/bulk-import`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-_data' },
      }
    )
    return response.data.data
  },

  /**
   * Update employee
   * @param id - Employee ID
   * @param data - Employee update data
   * @returns Promise with updated employee
   */
  updateEmployee: async (
    id: number,
    data: IUpdateEmployeeDto
  ): Promise<IEmployee> => {
    const response = await api.patch<ApiResponse<IEmployee>>(
      `${BASE_URL}/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete employee (soft delete)
   * @param id - Employee ID
   * @returns Promise<void>
   */
  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`)
  },

  /**
   * Activate employee
   * @param id - Employee ID
   * @returns Promise with updated employee
   */
  activateEmployee: async (id: number): Promise<IEmployee> => {
    const response = await api.patch<ApiResponse<IEmployee>>(
      `${BASE_URL}/${id}/activate`
    )
    return response.data.data
  },

  /**
   * Deactivate employee
   * @param id - Employee ID
   * @returns Promise with updated employee
   */
  deactivateEmployee: async (id: number): Promise<IEmployee> => {
    const response = await api.patch<ApiResponse<IEmployee>>(
      `${BASE_URL}/${id}/deactivate`
    )
    return response.data.data
  },

  /**
   * Assign branches to employee
   * @param id - Employee ID
   * @param branchIds - Array of branch IDs
   * @returns Promise with updated employee
   */
  assignBranches: async (
    id: number,
    branchIds: number[]
  ): Promise<IEmployee> => {
    const response = await api.patch<ApiResponse<IEmployee>>(
      `${BASE_URL}/${id}/branches`,
      { branchIds }
    )
    return response.data.data
  },

  /**
   * Set active branch for employee
   * @param id - Employee ID
   * @param branchId - Branch ID to set as active
   * @returns Promise with updated employee
   */
  setActiveBranch: async (id: number, branchId: number): Promise<IEmployee> => {
    const response = await api.patch<ApiResponse<IEmployee>>(
      `${BASE_URL}/${id}/active-branch/${branchId}`
    )
    return response.data.data
  },

  /**
   * Change employee password
   * @param id - Employee ID
   * @param data - Current and new password
   * @returns Promise<void>
   */
  changePassword: async (
    id: number,
    data: IChangePasswordDto
  ): Promise<void> => {
    await api.patch(`${BASE_URL}/${id}/password`, data)
  },
}

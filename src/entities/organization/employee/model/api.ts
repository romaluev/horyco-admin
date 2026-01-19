import api from '@/shared/lib/axios'

import type {
  IBulkImportResult,
  IChangePasswordDto,
  ICreateEmployeeDto,
  IEmployee,
  IEmployeeFilters,
  IPaginatedResponse,
  IUpdateEmployeeDto,
  IAssignPermissionsDto,
  IAssignPermissionsFromRoleDto,
  ICopyPermissionsDto,
  IEmployeeBranchPermissions,
  IGenerateInviteLinkResponse,
  IInviteStatusResponse,
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
        headers: { 'Content-Type': 'multipart/form-data' },
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

  /**
   * Upload employee avatar
   * v4.0: Uses entityType=EMPLOYEE and entityId=0 for temporary uploads
   * @param file - Image file for avatar
   * @param altText - Alt text for the image
   * @returns Promise with uploaded file data
   */
  uploadEmployeeAvatar: async (
    file: File,
    altText?: string
  ): Promise<{
    id: number
    url: string
    filename: string
    size: number
    mimeType: string
    folder: string
    variants: {
      original: string
      large?: string
      medium?: string
      thumb?: string
    }
    metadata: {
      width?: number
      height?: number
      altText?: string
    }
  }> => {
    const formData = new FormData()
    formData.append('file', file)

    const params = new URLSearchParams()
    params.append('entityType', 'EMPLOYEE')
    params.append('entityId', '0')
    if (altText) {
      params.append('altText', altText)
    }

    const response = await api.post<
      ApiResponse<{
        id: number
        url: string
        filename: string
        size: number
        mimeType: string
        folder: string
        variants: {
          original: string
          large?: string
          medium?: string
          thumb?: string
        }
        metadata: {
          width?: number
          height?: number
          altText?: string
        }
      }>
    >(`/files/upload?${params.toString()}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  // ============================================
  // Permission Management Endpoints
  // ============================================

  /**
   * Get employee permissions at a specific branch
   * @param employeeId - Employee ID
   * @param branchId - Branch ID
   * @returns Promise with branch permissions
   */
  getEmployeeBranchPermissions: async (
    employeeId: number,
    branchId: number
  ): Promise<IEmployeeBranchPermissions> => {
    const response = await api.get<ApiResponse<IEmployeeBranchPermissions>>(
      `${BASE_URL}/${employeeId}/branches/${branchId}/permissions`
    )
    return response.data.data
  },

  /**
   * Assign permissions directly to an employee at a branch
   * @param employeeId - Employee ID
   * @param branchId - Branch ID
   * @param data - Permission IDs to assign
   * @returns Promise with assigned permissions
   */
  assignPermissions: async (
    employeeId: number,
    branchId: number,
    data: IAssignPermissionsDto
  ): Promise<IEmployeeBranchPermissions> => {
    const response = await api.post<ApiResponse<IEmployeeBranchPermissions>>(
      `${BASE_URL}/${employeeId}/branches/${branchId}/permissions`,
      data
    )
    return response.data.data
  },

  /**
   * Assign permissions from a role template to an employee at a branch
   * @param employeeId - Employee ID
   * @param branchId - Branch ID
   * @param data - Role ID and optional additional permissions
   * @returns Promise with assigned permissions
   */
  assignPermissionsFromRole: async (
    employeeId: number,
    branchId: number,
    data: IAssignPermissionsFromRoleDto
  ): Promise<IEmployeeBranchPermissions> => {
    const response = await api.post<ApiResponse<IEmployeeBranchPermissions>>(
      `${BASE_URL}/${employeeId}/branches/${branchId}/permissions/assign-from-role`,
      data
    )
    return response.data.data
  },

  /**
   * Replace all permissions for an employee at a branch
   * @param employeeId - Employee ID
   * @param branchId - Branch ID
   * @param data - New permission IDs
   * @returns Promise with updated permissions
   */
  updatePermissions: async (
    employeeId: number,
    branchId: number,
    data: IAssignPermissionsDto
  ): Promise<IEmployeeBranchPermissions> => {
    const response = await api.put<ApiResponse<IEmployeeBranchPermissions>>(
      `${BASE_URL}/${employeeId}/branches/${branchId}/permissions`,
      data
    )
    return response.data.data
  },

  /**
   * Revoke specific permissions from an employee at a branch
   * @param employeeId - Employee ID
   * @param branchId - Branch ID
   * @param permissionIds - Permission IDs to revoke
   * @returns Promise<void>
   */
  revokePermissions: async (
    employeeId: number,
    branchId: number,
    permissionIds: number[]
  ): Promise<void> => {
    await api.delete(
      `${BASE_URL}/${employeeId}/branches/${branchId}/permissions`,
      { data: { permissionIds } }
    )
  },

  /**
   * Remove all permissions from an employee at a branch
   * @param employeeId - Employee ID
   * @param branchId - Branch ID
   * @returns Promise<void>
   */
  removeFromBranch: async (
    employeeId: number,
    branchId: number
  ): Promise<void> => {
    await api.delete(
      `${BASE_URL}/${employeeId}/branches/${branchId}/permissions/all`
    )
  },

  /**
   * Copy permissions between branches for an employee
   * @param employeeId - Employee ID
   * @param data - Source and target branch IDs
   * @returns Promise<void>
   */
  copyPermissions: async (
    employeeId: number,
    data: ICopyPermissionsDto
  ): Promise<void> => {
    await api.post(
      `${BASE_URL}/${employeeId}/permissions/copy`,
      data
    )
  },

  // ============================================
  // Staff Invite Endpoints
  // ============================================

  /**
   * Generate magic link for employee to set password
   * @param employeeId - Employee ID
   * @returns Promise with magic link and instructions
   */
  generateInviteLink: async (
    employeeId: number
  ): Promise<IGenerateInviteLinkResponse> => {
    const response = await api.post<ApiResponse<IGenerateInviteLinkResponse>>(
      `${BASE_URL}/${employeeId}/invite-link`
    )
    return response.data.data
  },

  /**
   * Regenerate magic link (invalidates previous)
   * @param employeeId - Employee ID
   * @returns Promise with new magic link
   */
  regenerateInviteLink: async (
    employeeId: number
  ): Promise<IGenerateInviteLinkResponse> => {
    const response = await api.post<ApiResponse<IGenerateInviteLinkResponse>>(
      `${BASE_URL}/${employeeId}/invite-link/regenerate`
    )
    return response.data.data
  },

  /**
   * Get invitation status for employee
   * @param employeeId - Employee ID
   * @returns Promise with invitation status
   */
  getInviteStatus: async (
    employeeId: number
  ): Promise<IInviteStatusResponse> => {
    const response = await api.get<ApiResponse<IInviteStatusResponse>>(
      `${BASE_URL}/${employeeId}/invite-link/status`
    )
    return response.data.data
  },
}

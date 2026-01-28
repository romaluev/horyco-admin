export interface IBranch {
  id: number
  name: string
  address: string
}

export interface IPermission {
  id: number
  name: string
  category: string
}

export interface IRole {
  id: number
  name: string
  permissions: IPermission[]
}

export interface IEmployee {
  // Required fields
  id: number
  authUserId?: number // Global auth_users.id for multi-tenant identity
  fullName: string
  phone: string
  password?: string

  // Optional fields
  email?: string
  birthDate?: string
  hireDate?: string
  photoUrl?: string
  avatar?: {
    original?: string
    thumb?: string
  }
  notes?: string

  // System fields
  tenantId: number
  tenantName?: string
  activeBranchId: number
  isActive: boolean
  isOwner?: boolean // Whether this employee is the tenant owner
  status?: 'active' | 'inactive' | 'suspended' | 'terminated'
  lastLoginAt?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: number
  deletedAt?: string
  deletedBy?: number
  updatedBy?: number

  // POS-related fields
  pin?: string
  pinExpiresAt?: string
  pinEnabled?: boolean

  // Permission-related fields
  branchPermissions?: Record<string, string[]> // Map of branchId -> permissions[]

  // Relationships (may not always be populated)
  roles?: IRole[]
  branches?: IBranch[]
  activeBranch?: IBranch
}

/**
 * Branch-specific permissions for an employee
 * Used when creating/updating employee permissions per branch
 */
export interface IBranchPermissions {
  roleTemplateId?: number // Optional: role to use as template
  permissionIds: number[] // Required: actual permissions to assign
}

export interface ICreateEmployeeDto {
  fullName: string
  phone: string
  password: string
  email?: string
  birthDate?: string
  hireDate?: string
  photoUrl?: string
  notes?: string
  roleIds: number[] // Used to determine default permissions per branch
  branchIds: number[] // Branches to assign employee to
  activeBranchId: number
  pin?: string
  // Per-branch permissions (optional, can be derived from roleIds)
  branchPermissions?: Record<number, IBranchPermissions>
}

export interface IUpdateEmployeeDto {
  fullName?: string
  email?: string
  birthDate?: string
  hireDate?: string
  photoUrl?: string
  notes?: string
  roleIds?: number[]
  branchIds?: number[]
  activeBranchId?: number
  branchPermissions?: Record<number, IBranchPermissions>
}

/**
 * Permission assignment request for a specific branch
 */
export interface IAssignPermissionsDto {
  permissionIds: number[]
}

/**
 * Assign permissions from a role template for a branch
 */
export interface IAssignPermissionsFromRoleDto {
  roleId: number
  additionalPermissionIds?: number[]
}

/**
 * Copy permissions between branches
 */
export interface ICopyPermissionsDto {
  fromBranchId: number
  toBranchId: number
}

/**
 * Employee permission response (per branch)
 */
export interface IEmployeePermission {
  id: number
  permissionId: number
  permissionName: string // e.g., "orders:view"
  category: string // e.g., "orders"
  description?: string
  grantedAt: string
}

/**
 * Employee permissions at a specific branch
 */
export interface IEmployeeBranchPermissions {
  employeeId: number
  branchId: number
  branchName?: string
  permissions: IEmployeePermission[]
  totalPermissions: number
  groupedByCategory?: Record<string, string[]>
}

export interface IEmployeeFilters {
  branchId?: number
  roleId?: number
  status?: 'active' | 'inactive'
  search?: string
  page?: number
  limit?: number
}

export interface IChangePasswordDto {
  currentPassword: string
  newPassword: string
}

export interface IPaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface IPaginatedResponse<T> {
  data: T[]
  meta: IPaginationMeta
}

export interface IBulkImportResult {
  total: number
  success: number
  failed: number
  results: {
    row: number
    success: boolean
    employeeId?: number
    fullName?: string
    phone?: string
    error?: string
  }[]
}

// Staff Invite Types
export interface IGenerateInviteLinkResponse {
  magicLink: string
  expiresAt: string
  daysRemaining: number
  employee: {
    id: number
    fullName: string
    phone: string
  }
  instructions: string
}

export interface IInviteStatusResponse {
  hasActiveInvitation: boolean
  invitationId?: number
  expiresAt?: string
  daysRemaining?: number
  isCompleted: boolean
  accessCount?: number
  lastAccessedAt?: string
}

export interface IVerifyStaffInviteRequest {
  token: string
}

export interface IVerifyStaffInviteResponse {
  valid: boolean
  employeeId?: number
  employeeName?: string
  employeePhone?: string
  tenantId?: number
  requiresPassword: boolean
  expiresAt?: string
  daysRemaining?: number
  message?: string
}

export interface ICompleteStaffInviteRequest {
  token: string
  password: string
}

export interface ICompleteStaffInviteResponse {
  success: boolean
  accessToken: string
  refreshToken: string
  expiresIn: number
  employee: {
    id: number
    fullName: string
    phone: string
  }
  tenant: {
    id: number
    name: string
  }
  message: string
}

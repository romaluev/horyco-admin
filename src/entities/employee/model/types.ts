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
  fullName: string
  phone: string
  password: string

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
  activeBranchId: number
  isActive: boolean
  status?: 'active' | 'inactive' | 'suspended' | 'terminated'
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  createdBy?: number
  deletedAt?: string
  deletedBy?: number
  updatedBy?: number

  // POS-related fields
  pin?: string
  pinExpiresAt?: string
  pinEnabled?: boolean

  // Relationships (may not always be populated)
  roles?: IRole[]
  branches?: IBranch[]
  activeBranch?: IBranch
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
  roleIds: number[]
  branchIds: number[]
  activeBranchId: number
  pin?: string
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

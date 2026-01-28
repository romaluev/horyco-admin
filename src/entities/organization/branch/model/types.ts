import type { IEmployee } from '@/entities/organization/employee/model/types'

/**
 * Branch entity interface
 */
export interface IBranch {
  id: number
  name: string
  address: string
  phone?: string | null
  phoneNumber?: string
  email?: string
  workingHours?: string | null
  managerName?: string | null
  isActive: boolean
  settings?: Record<string, unknown> | null
  metadata?: Record<string, unknown>
  hallsCount?: number
  tablesCount?: number
  hallCount?: number
  tableCount?: number
  activeSessionCount?: number
  employeeCount?: number
  employees?: IEmployee[]
  owner?: IEmployee
  products?: unknown[]
  createdAt: Date | string
  createdBy?: number
  updatedAt?: Date | string
  deletedAt?: Date | string
  deletedBy?: number
}

/**
 * API request DTO - matches backend contract
 * Uses 'phone' field as expected by API
 */
export interface ICreateBranchDto {
  name: string
  address: string
  phone?: string
  email?: string
  metadata?: Record<string, unknown>
}

/**
 * API request DTO - matches backend contract
 * Uses 'phone' field as expected by API
 */
export interface IUpdateBranchDto {
  name?: string
  address?: string
  phone?: string
  email?: string
  metadata?: Record<string, unknown>
}

/**
 * Can delete branch response
 */
export interface ICanDeleteResponse {
  canDelete: boolean
  blockingReasons?: {
    halls?: string | null
    orders?: string | null
    employees?: string | null
  }
}

/**
 * Revenue statistics
 */
export interface IRevenueStats {
  total: number
  cash: number
  card: number
  digital: number
}

/**
 * Order statistics
 */
export interface IOrderStats {
  total: number
  completed: number
  cancelled: number
  averageValue: number
}

/**
 * Capacity statistics
 */
export interface ICapacityStats {
  totalSeats: number
  averageOccupancy: number
  peakHour: string
  peakOccupancy: number
}

/**
 * Top product item
 */
export interface ITopProduct {
  productId: number
  productName: string
  quantitySold: number
  revenue: number
}

/**
 * Branch statistics response
 */
export interface IBranchStatistics {
  branchId: number
  branchName: string
  period: 'today' | 'week' | 'month' | 'year'
  startDate: string
  endDate: string
  revenue: IRevenueStats
  orders: IOrderStats
  capacity: ICapacityStats
  topProducts: ITopProduct[]
}

/**
 * Bulk import branch item - API DTO
 * Uses 'phone' field as expected by API
 */
export interface IBulkBranchItem {
  name: string
  address: string
  phone?: string
  email?: string
}

/**
 * Bulk create request
 */
export interface IBulkCreateBranchDto {
  branches: IBulkBranchItem[]
}

/**
 * Bulk import result item
 */
export interface IBulkImportResultItem {
  index: number
  branchId?: number
  name: string
  error?: string
}

/**
 * Bulk import response
 */
export interface IBulkImportResponse {
  success: number
  failed: number
  results: IBulkImportResultItem[]
}

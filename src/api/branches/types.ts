// Branch types based on backend DTOs and entities

/**
 * Base entity interface with common fields
 */
export interface BaseEntity {
  id: number;
  createdAt: Date;
  createdBy: number;
  deletedAt?: Date;
  deletedBy?: number;
}

/**
 * Branch entity interface
 */
export interface Branch extends BaseEntity {
  name: string;
  address: string;
  employees?: Employee[];
  owner?: Employee;
  products?: any[]; // Replace with Product interface if needed
}

/**
 * Create branch request payload
 * Corresponds to CreateBranchDto in the backend
 */
export interface CreateBranchRequest {
  name: string;
  address: string;
}

/**
 * Update branch request payload
 * Corresponds to UpdateBranchDto in the backend
 * All fields are optional
 */
export interface UpdateBranchRequest {
  name?: string;
  address?: string;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page?: number;
  size?: number;
}

/**
 * Sorting parameters for list requests
 */
export interface SortingParams {
  field: string;
  order: 'ASC' | 'DESC';
}

/**
 * Filtering parameters for list requests
 */
export interface FilteringParams {
  field: string;
  value: string | number | boolean;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  size: number;
}

/**
 * Employee interface (simplified)
 * Create a separate employee.types.ts file if more detailed
 */
export interface Employee extends BaseEntity {
  firstName: string;
  lastName: string;
  // Add other employee properties as needed
}

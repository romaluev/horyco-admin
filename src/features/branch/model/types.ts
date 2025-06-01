import { IEmployee } from '@/features/employee/model/types';

/**
 * Branch entity interface
 */

export interface IBranch {
  name: string;
  address: string;
  employees?: IEmployee[];
  owner?: IEmployee;
  products?: any[];
  id: number;
  createdAt: Date;
  createdBy: number;
  deletedAt?: Date;
  deletedBy?: number;
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

import type { IEmployee } from '@/entities/employee/model/types';

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
 * Create branches request payload
 * Corresponds to CreateBranchDto in the backend
 */
export interface ICreateBranchDto {
  name: string;
  address: string;
}

/**
 * Update branches request payload
 * Corresponds to UpdateBranchDto in the backend
 * All fields are optional
 */
export interface IUpdateBranchDto {
  name?: string;
  address?: string;
}

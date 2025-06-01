import { IEmployee } from '@/features/employee/model/types';

/**
 * Product entity interface
 */
export interface IProduct {
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
 * Create product request payload
 * Corresponds to CreateProductDto in the backend
 */
export interface CreateProductRequest {
  name: string;
  address: string;
}

/**
 * Update branch request payload
 * Corresponds to UpdateProductRequest in the backend
 * All fields are optional
 */
export interface UpdateProductRequest {
  name?: string;
  address?: string;
}

import api from '@/shared/lib/axios';
import {
  FilteringParams,
  PaginationParams,
  SortingParams
} from '@/shared/types';

import type { IBranch, ICreateBranchDto, IUpdateBranchDto } from './types';
import type {
  ApiParams,
  PaginatedResponse} from '@/shared/types';

/**
 * Branch API functions
 */

export const branchApi = {
  /**
   * Create a new branches
   * @param branchData - The branches data to create
   * @returns Promise with the created branches
   */
  createBranch: async (branchData: ICreateBranchDto): Promise<IBranch> => {
    const response = await api.post<IBranch>('/branch', branchData);
    return response.data;
  },

  getBranches: async (
    searchParams: ApiParams = {}
  ): Promise<PaginatedResponse<IBranch>> => {
    const params = new URLSearchParams();

    params.append('page', String(searchParams.page || '0'));
    params.append('size', String(searchParams.size || '100'));
    if (searchParams.filters) {
      params.append('filters', searchParams.filters);
    }

    const response = await api.get<PaginatedResponse<IBranch>>('/branch', {
      params
    });
    return response.data;
  },

  /**
   * Get a branches by ID
   * @param id - The branches ID
   * @returns Promise with the branches
   */
  getBranchById: async (id: number): Promise<IBranch> => {
    const response = await api.get<IBranch>(`/branch/${id}`);
    return response.data;
  },

  /**
   * Update a branches
   * @param id - The branches ID
   * @param branchData - The branches data to update
   * @returns Promise with the updated branches
   */
  updateBranch: async (
    id: number,
    branchData: IUpdateBranchDto
  ): Promise<IBranch> => {
    const response = await api.put<IBranch>(`/branch/${id}`, branchData);
    return response.data;
  },

  /**
   * Delete a branches
   * @param id - The branches ID
   * @returns Promise with the deleted branches
   */
  deleteBranch: async (id: number): Promise<void> => {
    await api.delete(`/branch/${id}`);
  }
};

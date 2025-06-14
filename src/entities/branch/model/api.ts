import { IBranch, ICreateBranchDto, IUpdateBranchDto } from './types';
import api from '@/shared/lib/axios';
import {
  FilteringParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams
} from '@/shared/types';

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

  /**
   * Get all branches with pagination, sorting, and filtering
   * @param pagination - Pagination parameters
   * @param sorting - Sorting parameters
   * @param filtering - Filtering parameters
   * @returns Promise with paginated branches
   */
  getBranches: async (
    pagination?: PaginationParams,
    sorting?: SortingParams,
    filtering?: FilteringParams[]
  ): Promise<PaginatedResponse<IBranch>> => {
    // Build query parameters
    const params = new URLSearchParams();

    // Add pagination params
    if (pagination) {
      if (Number.isInteger(pagination.page))
        params.append('page', pagination.page + '');
      if (pagination.size) params.append('size', pagination.size.toString());
    }

    // Add sorting params
    // if (sorting) {
    //   params.append('sortBy', sorting.field);
    //   params.append('sortOrder', sorting.order);
    // }

    // Add filtering params
    if (filtering && filtering.length > 0) {
      filtering.forEach((filter, index) => {
        params.append(`filters[${index}][field]`, filter.field);
        params.append(`filters[${index}][value]`, filter.value.toString());
      });
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

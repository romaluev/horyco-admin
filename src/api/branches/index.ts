import api from '../index';
import {
  Branch,
  CreateBranchRequest,
  UpdateBranchRequest,
  PaginationParams,
  SortingParams,
  FilteringParams,
  PaginatedResponse
} from './types';

/**
 * Branch API functions
 */

/**
 * Create a new branch
 * @param branchData - The branch data to create
 * @returns Promise with the created branch
 */
export const createBranch = async (
  branchData: CreateBranchRequest
): Promise<Branch> => {
  const response = await api.post<Branch>('/branch', branchData);
  return response.data;
};

/**
 * Get all branches with pagination, sorting, and filtering
 * @param pagination - Pagination parameters
 * @param sorting - Sorting parameters
 * @param filtering - Filtering parameters
 * @returns Promise with paginated branches
 */
export const getBranches = async (
  pagination?: PaginationParams,
  sorting?: SortingParams,
  filtering?: FilteringParams[]
): Promise<PaginatedResponse<Branch>> => {
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

  const response = await api.get<PaginatedResponse<Branch>>('/branch', {
    params
  });
  return response.data;
};

/**
 * Get a branch by ID
 * @param id - The branch ID
 * @returns Promise with the branch
 */
export const getBranchById = async (id: number): Promise<Branch> => {
  const response = await api.get<Branch>(`/branch/${id}`);
  return response.data;
};

/**
 * Update a branch
 * @param id - The branch ID
 * @param branchData - The branch data to update
 * @returns Promise with the updated branch
 */
export const updateBranch = async (
  id: number,
  branchData: UpdateBranchRequest
): Promise<Branch> => {
  const response = await api.put<Branch>(`/branch/${id}`, branchData);
  return response.data;
};

/**
 * Delete a branch
 * @param id - The branch ID
 * @returns Promise with the deleted branch
 */
export const deleteBranch = async (id: number): Promise<void> => {
  await api.delete(`/branch/${id}`);
};

export default {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch
};

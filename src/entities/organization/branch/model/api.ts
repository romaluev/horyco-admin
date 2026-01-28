import api from '@/shared/lib/axios'

import type {
  IBranch,
  ICreateBranchDto,
  IUpdateBranchDto,
  ICanDeleteResponse,
  IBranchStatistics,
  IBulkCreateBranchDto,
  IBulkImportResponse,
} from './types'
import type { ApiParams, PaginatedResponse } from '@/shared/types'

const BASE_URL = '/admin/branches'

/**
 * Branch API functions
 */
export const branchApi = {
  /**
   * Get all branches with pagination
   */
  getBranches: async (
    searchParams: ApiParams = {}
  ): Promise<PaginatedResponse<IBranch>> => {
    const params = new URLSearchParams()
    params.append('page', String(searchParams.page || '0'))
    params.append('size', String(searchParams.size || '100'))
    if (searchParams.filters) {
      params.append('filters', searchParams.filters)
    }

    const response = await api.get<{ success: boolean; data: IBranch[] }>(
      BASE_URL,
      { params }
    )

    return {
      items: response.data.data || [],
      totalItems: response.data.data?.length || 0,
      page: searchParams.page || 0,
      size: searchParams.size || 100,
    }
  },

  /**
   * Get a branch by ID
   */
  getBranchById: async (id: number): Promise<IBranch> => {
    const response = await api.get<IBranch>(`${BASE_URL}/${id}`)
    return response.data
  },

  /**
   * Create a new branch
   */
  createBranch: async (branchData: ICreateBranchDto): Promise<IBranch> => {
    const response = await api.post<IBranch>(BASE_URL, branchData)
    return response.data
  },

  /**
   * Update a branch (partial update)
   */
  updateBranch: async (
    id: number,
    branchData: IUpdateBranchDto
  ): Promise<IBranch> => {
    const response = await api.patch<IBranch>(`${BASE_URL}/${id}`, branchData)
    return response.data
  },

  /**
   * Delete a branch
   */
  deleteBranch: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`)
  },

  /**
   * Check if a branch can be deleted
   */
  canDeleteBranch: async (id: number): Promise<ICanDeleteResponse> => {
    const response = await api.get<ICanDeleteResponse>(
      `${BASE_URL}/${id}/can-delete`
    )
    return response.data
  },

  /**
   * Get branch statistics
   */
  getBranchStatistics: async (
    id: number,
    period: 'today' | 'week' | 'month' | 'year' = 'week'
  ): Promise<IBranchStatistics> => {
    const response = await api.get<IBranchStatistics>(
      `${BASE_URL}/${id}/statistics`,
      { params: { period } }
    )
    return response.data
  },

  /**
   * Bulk create branches
   */
  bulkCreateBranches: async (
    data: IBulkCreateBranchDto
  ): Promise<IBulkImportResponse> => {
    const response = await api.post<IBulkImportResponse>(
      `${BASE_URL}/bulk`,
      data
    )
    return response.data
  },
}

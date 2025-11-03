/**
 * Addition API Client
 * Based on /admin/menu/additions endpoints from ADMIN_MENU_MANAGEMENT.md
 */

import api from '@/shared/lib/axios';

import type {
  IAddition,
  ICreateAdditionDto,
  IUpdateAdditionDto,
  IGetAdditionsParams,
  IAdditionItem,
  ICreateAdditionItemDto,
  IUpdateAdditionItemDto
} from './types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  requestId: string;
}

export const additionApi = {
  // ===== Additions =====

  /**
   * Get all additions with optional filters
   * GET /admin/menu/additions
   */
  async getAdditions(params?: IGetAdditionsParams): Promise<IAddition[]> {
    const response = await api.get<ApiResponse<IAddition[]>>(
      '/admin/menu/additions',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get addition by ID
   * GET /admin/menu/additions/:id
   */
  async getAdditionById(id: number): Promise<IAddition> {
    const response = await api.get<ApiResponse<IAddition>>(
      `/admin/menu/additions/${id}`
    );
    return response.data.data;
  },

  /**
   * Create new addition
   * POST /admin/menu/additions
   */
  async createAddition(data: ICreateAdditionDto): Promise<IAddition> {
    const response = await api.post<ApiResponse<IAddition>>(
      '/admin/menu/additions',
      data
    );
    return response.data.data;
  },

  /**
   * Update addition
   * PATCH /admin/menu/additions/:id
   */
  async updateAddition(
    id: number,
    data: IUpdateAdditionDto
  ): Promise<IAddition> {
    const response = await api.patch<ApiResponse<IAddition>>(
      `/admin/menu/additions/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete addition
   * DELETE /admin/menu/additions/:id
   */
  async deleteAddition(id: number): Promise<void> {
    await api.delete(`/admin/menu/additions/${id}`);
  },

  // ===== Addition Items =====

  /**
   * Get all addition items for a specific addition
   * GET /admin/menu/additions/:additionId/items
   */
  async getAdditionItems(additionId: number): Promise<IAdditionItem[]> {
    const response = await api.get<ApiResponse<IAdditionItem[]>>(
      `/admin/menu/additions/${additionId}/items`
    );
    return response.data.data;
  },

  /**
   * Create new addition item
   * POST /admin/menu/addition-items
   */
  async createAdditionItem(
    data: ICreateAdditionItemDto
  ): Promise<IAdditionItem> {
    const response = await api.post<ApiResponse<IAdditionItem>>(
      '/admin/menu/addition-items',
      data
    );
    return response.data.data;
  },

  /**
   * Update addition item
   * PATCH /admin/menu/addition-items/:id
   */
  async updateAdditionItem(
    id: number,
    data: IUpdateAdditionItemDto
  ): Promise<IAdditionItem> {
    const response = await api.patch<ApiResponse<IAdditionItem>>(
      `/admin/menu/addition-items/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete addition item
   * DELETE /admin/menu/addition-items/:id
   */
  async deleteAdditionItem(id: number): Promise<void> {
    await api.delete(`/admin/menu/addition-items/${id}`);
  }
};

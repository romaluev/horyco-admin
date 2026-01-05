/**
 * Warehouse API Client
 * Based on /api/admin/inventory/warehouses endpoints
 */

import api from '@/shared/lib/axios'

import type {
  IWarehouse,
  IWarehousesResponse,
  ICreateWarehouseDto,
  IUpdateWarehouseDto,
  IGetWarehousesParams,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

export const warehouseApi = {
  /**
   * Get all warehouses with filters
   * GET /admin/inventory/warehouses
   */
  async getWarehouses(params?: IGetWarehousesParams): Promise<IWarehousesResponse> {
    const response = await api.get<ApiResponse<IWarehousesResponse>>(
      '/admin/inventory/warehouses',
      { params }
    )
    return response.data.data
  },

  /**
   * Get warehouse by ID
   * GET /admin/inventory/warehouses/:id
   */
  async getWarehouseById(id: number): Promise<IWarehouse> {
    const response = await api.get<ApiResponse<IWarehouse>>(
      `/admin/inventory/warehouses/${id}`
    )
    return response.data.data
  },

  /**
   * Create new warehouse
   * POST /admin/inventory/warehouses
   */
  async createWarehouse(data: ICreateWarehouseDto): Promise<IWarehouse> {
    const response = await api.post<ApiResponse<IWarehouse>>(
      '/admin/inventory/warehouses',
      data
    )
    return response.data.data
  },

  /**
   * Update warehouse
   * PATCH /admin/inventory/warehouses/:id
   */
  async updateWarehouse(id: number, data: IUpdateWarehouseDto): Promise<IWarehouse> {
    const response = await api.patch<ApiResponse<IWarehouse>>(
      `/admin/inventory/warehouses/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete warehouse
   * DELETE /admin/inventory/warehouses/:id
   */
  async deleteWarehouse(id: number): Promise<void> {
    await api.delete(`/admin/inventory/warehouses/${id}`)
  },
}

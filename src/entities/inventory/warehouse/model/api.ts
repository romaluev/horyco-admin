import api from '@/shared/lib/axios'

import type {
  IWarehouse,
  IWarehouseStockSummary,
  ICreateWarehouseDto,
  IUpdateWarehouseDto,
  IGetWarehousesParams,
} from './types'

export const warehouseApi = {
  /**
   * GET /admin/inventory/warehouses
   * Get all warehouses
   */
  async getWarehouses(params?: IGetWarehousesParams): Promise<IWarehouse[]> {
    const response = await api.get<
      { success: boolean; data: IWarehouse[] } | IWarehouse[]
    >('/admin/inventory/warehouses', { params })
    // Handle both wrapped and unwrapped response formats
    const data = response.data
    if (Array.isArray(data)) {
      return data
    }
    return data.data || []
  },

  /**
   * GET /admin/inventory/warehouses/:id
   * Get warehouse by ID
   */
  async getWarehouseById(id: number): Promise<IWarehouse> {
    const response = await api.get<{ success: boolean; data: IWarehouse }>(
      `/admin/inventory/warehouses/${id}`
    )
    return response.data.data
  },

  /**
   * GET /admin/inventory/warehouses/:id/stock-summary
   * Get warehouse stock summary
   */
  async getWarehouseStockSummary(id: number): Promise<IWarehouseStockSummary> {
    const response = await api.get<{
      success: boolean
      data: IWarehouseStockSummary
    }>(`/admin/inventory/warehouses/${id}/stock-summary`)
    return response.data.data
  },

  /**
   * POST /admin/inventory/warehouses
   * Create a new warehouse
   */
  async createWarehouse(data: ICreateWarehouseDto): Promise<IWarehouse> {
    const response = await api.post<{ success: boolean; data: IWarehouse }>(
      '/admin/inventory/warehouses',
      data
    )
    return response.data.data
  },

  /**
   * PATCH /admin/inventory/warehouses/:id
   * Update a warehouse
   */
  async updateWarehouse(
    id: number,
    data: IUpdateWarehouseDto
  ): Promise<IWarehouse> {
    const response = await api.patch<{ success: boolean; data: IWarehouse }>(
      `/admin/inventory/warehouses/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * DELETE /admin/inventory/warehouses/:id
   * Delete a warehouse
   */
  async deleteWarehouse(id: number): Promise<void> {
    await api.delete(`/admin/inventory/warehouses/${id}`)
  },
}

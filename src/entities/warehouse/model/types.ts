/**
 * Warehouse Entity Types
 * Based on /api/admin/inventory/warehouses endpoints
 */

export interface IWarehouse {
  id: number
  branchId: number
  name: string
  address?: string
  description?: string
  notes?: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface ICreateWarehouseDto {
  branchId: number
  name: string
  address?: string
  description?: string
  isActive?: boolean
  isDefault?: boolean
}

export interface IUpdateWarehouseDto {
  name?: string
  address?: string
  description?: string
  isActive?: boolean
  isDefault?: boolean
}

export interface IGetWarehousesParams {
  branchId?: number
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface IWarehousesResponse {
  data: IWarehouse[]
  total: number
  page: number
  limit: number
  totalPages: number
}

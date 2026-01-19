export interface IWarehouse {
  id: number
  branchId: number
  branchName?: string
  name: string
  code?: string
  address?: string
  city?: string
  isActive: boolean
  isDefault?: boolean
  createdAt: string
  updatedAt: string
}

export interface IWarehouseStockSummary {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
}

export interface ICreateWarehouseDto {
  branchId: number
  name: string
  code?: string
  address?: string
  city?: string
  isActive?: boolean
}

export interface IUpdateWarehouseDto {
  name?: string
  code?: string
  address?: string
  city?: string
  isActive?: boolean
}

export interface IGetWarehousesParams {
  isActive?: boolean
}

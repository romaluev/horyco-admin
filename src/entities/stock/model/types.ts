/**
 * Stock Entity Types
 * Based on /api/admin/inventory/stock endpoints
 */

export interface IStock {
  id: number
  warehouseId: number
  warehouse?: {
    id: number
    name: string
  }
  itemId: number
  item?: {
    id: number
    name: string
    sku?: string
    unit: string
    minStockLevel: number
    maxStockLevel?: number
    isSemiFinished: boolean
  }
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  avgCost: number
  lastCost: number
  totalValue: number
  lastMovementAt?: string
  updatedAt: string
  // Convenience flat fields for list views
  inventoryItemName?: string
  inventoryItemSku?: string
  unit?: string
  minStock?: number
}

export interface IStockSummary {
  totalItems: number
  totalValue: number
  lowStockCount: number
  outOfStockCount: number
  warehouseId?: number
}

export interface IStockAdjustmentDto {
  warehouseId: number
  itemId: number
  newQuantity: number
  reason: string
}

export interface IGetStockParams {
  warehouseId: number
  category?: string
  search?: string
  lowStockOnly?: boolean
  outOfStockOnly?: boolean
  page?: number
  limit?: number
}

// API returns stock array directly, not wrapped in items/summary
export type IStockResponse = IStock[]

export interface ILowStockItem {
  id: number
  itemId: number
  item: {
    id: number
    name: string
    sku?: string
    unit: string
    minStockLevel: number
  }
  warehouseId: number
  warehouse: {
    id: number
    name: string
  }
  quantity: number
  minStockLevel: number
  percentageOfMin: number
  // Convenience flat fields for widgets
  inventoryItemId?: number
  inventoryItemName?: string
  minStock?: number
  unit?: string
}

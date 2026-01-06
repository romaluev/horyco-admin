/**
 * Stock Movement Entity Types
 * Based on /api/admin/inventory/movements endpoints
 */

import { MovementType } from '@/shared/types/inventory'

export interface IStockMovement {
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
  }
  movementType: MovementType
  quantity: number
  unitCost: number
  totalCost: number
  balanceAfter: number
  referenceType?: string
  referenceId?: number
  referenceNumber?: string
  notes?: string
  createdBy?: number
  createdByUser?: {
    id: number
    name: string
  }
  createdAt: string
  // Convenience flat fields for list views
  inventoryItemName?: string
  warehouseName?: string
  type?: MovementType
  unit?: string
  reference?: string
}

export interface IGetMovementsParams {
  warehouseId?: number
  itemId?: number
  movementType?: MovementType
  from?: string
  to?: string
  page?: number
  limit?: number
}

// API returns movements array directly
export type IMovementsResponse = IStockMovement[]

export interface IMovementsSummary {
  totalIn: number
  totalOut: number
  netChange: number
  valueIn: number
  valueOut: number
  netValueChange: number
  period: {
    from: string
    to: string
  }
}

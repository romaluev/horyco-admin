import type { MovementType } from '@/shared/types/inventory'

/**
 * Stock record for an item at a specific warehouse
 */
export interface IStock {
  id: number
  warehouseId: number
  itemId: number
  quantity: number
  reservedQuantity: number
  averageCost: number
  lastCost: number
  lastMovementAt: string | null
  createdAt: string
  updatedAt: string
  // Expanded relations
  warehouse?: {
    id: number
    name: string
    code?: string
  }
  item?: {
    id: number
    name: string
    sku: string
    unit: string
    category?: string
    minStockLevel?: number
    maxStockLevel?: number
    reorderPoint?: number
  }
}

/**
 * Stock summary for dashboard
 */
export interface IStockSummary {
  totalItems: number
  totalValue: number
  lowStockCount: number
  outOfStockCount: number
  overstockCount: number
}

/**
 * Stock alert
 */
export interface IStockAlert {
  id: number
  warehouseId: number
  itemId: number
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK' | 'EXPIRING_SOON'
  threshold: number
  currentValue: number
  isAcknowledged: boolean
  acknowledgedBy?: number
  acknowledgedAt?: string
  createdAt: string
  // Expanded relations
  warehouse?: {
    id: number
    name: string
  }
  item?: {
    id: number
    name: string
    sku: string
  }
}

/**
 * DTO for manual stock adjustment
 */
export interface IAdjustStockDto {
  warehouseId: number
  itemId: number
  quantityChange: number
  reason: MovementType
  notes?: string
  referenceNumber?: string
}

/**
 * Params for getting stock list
 */
export interface IGetStockParams {
  warehouseId?: number
  itemId?: number
  category?: string
  status?: 'all' | 'low' | 'out'
  search?: string
  page?: number
  size?: number
}

/**
 * Params for low/out of stock queries
 */
export interface IStockAlertParams {
  warehouseId?: number
  page?: number
  size?: number
}

/**
 * Paginated stock response
 */
export interface IStockListResponse {
  data: IStock[]
  meta: {
    total: number
    page: number
    size: number
    totalPages: number
  }
  summary?: {
    totalItems: number
    lowStockCount: number
    outOfStockCount: number
    totalValue: number
  }
}

/**
 * Params for stock alerts
 */
export interface IGetStockAlertsParams {
  warehouseId?: number
  alertType?: string
  isAcknowledged?: boolean
  page?: number
  size?: number
}

import type { MovementType } from '@/shared/types/inventory'

/**
 * Stock movement record (read-only, created by system)
 */
export interface IStockMovement {
  id: number
  warehouseId: number
  itemId: number
  type: MovementType
  quantity: number
  previousQuantity: number
  newQuantity: number
  unitCost: number
  totalCost: number
  referenceType?: string
  referenceId?: number
  referenceNumber?: string
  notes?: string
  createdBy?: number
  createdAt: string
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
  }
  creator?: {
    id: number
    name: string
  }
}

/**
 * Params for getting movement list
 */
export interface IGetMovementsParams {
  warehouseId?: number
  itemId?: number
  type?: MovementType
  referenceType?: string
  referenceId?: number
  dateFrom?: string
  dateTo?: string
  page?: number
  size?: number
}

/**
 * Paginated movement response
 */
export interface IMovementListResponse {
  data: IStockMovement[]
  meta: {
    total: number
    page: number
    size: number
    totalPages: number
  }
}

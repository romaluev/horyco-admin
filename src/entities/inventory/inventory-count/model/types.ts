/**
 * Inventory Count Entity Types
 * Based on Inventory Management System documentation
 */

export type CountType = 'full' | 'cycle' | 'spot'
export type CountStatus = 'in_progress' | 'pending_approval' | 'completed' | 'cancelled'

export interface IInventoryCount {
  id: number
  warehouseId: number
  warehouseName: string
  countNumber: string
  countType: CountType
  status: CountStatus
  countDate: string
  startedAt: string | null
  completedAt: string | null
  itemsCounted: number
  itemsWithVariance: number
  shortageValue: number
  surplusValue: number
  netAdjustmentValue: number
  approvedBy: number | null
  approvedAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  items?: ICountItem[]
}

export interface ICountItem {
  id: number
  countId: number
  itemId: number
  itemName: string
  itemUnit: string
  systemQuantity: number
  countedQuantity: number | null
  variance: number | null
  varianceValue: number | null
  unitCost: number
  isCounted: boolean
  notes: string | null
}

export interface ICountVarianceSummary {
  totalItemsCounted: number
  itemsWithVariance: number
  itemsWithoutVariance: number
  shortageValue: number
  surplusValue: number
  netAdjustmentValue: number
  accuracyPct: number
  shortageCount: number
  surplusCount: number
}

export interface ICreateInventoryCountDto {
  warehouseId: number
  countType: CountType
  countDate: string
  notes?: string
  items?: ICreateCountItemDto[]
}

export interface ICreateCountItemDto {
  itemId: number
  systemQuantity: number
  countedQuantity: number
  unitCost: number
  notes?: string
}

export interface IUpdateCountItemDto {
  countedQuantity?: number
  notes?: string
}

export interface IGetInventoryCountsParams {
  status?: CountStatus
  countType?: CountType
  warehouseId?: number
  from?: string
  to?: string
}

export const COUNT_TYPE_LABELS: Record<CountType, string> = {
  full: 'Полная',
  cycle: 'Циклическая',
  spot: 'Выборочная',
}

export const COUNT_STATUS_LABELS: Record<CountStatus, string> = {
  in_progress: 'В процессе',
  pending_approval: 'На согласовании',
  completed: 'Завершена',
  cancelled: 'Отменена',
}

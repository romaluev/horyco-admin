/**
 * Inventory Count Entity Types
 * Types for inventory counting (stocktaking) management
 */

import type { CountType, CountStatus } from '@/shared/types/inventory'

export interface ICountItem {
  id: number
  countId: number
  inventoryItemId: number
  inventoryItemName: string
  inventoryItemSku: string | null
  unit: string
  systemQuantity: number
  countedQuantity: number | null
  variance: number | null
  varianceCost: number | null
  notes: string | null
  countedAt: string | null
  countedById: number | null
  countedByName: string | null
  createdAt: string
  updatedAt: string
}

export interface IInventoryCount {
  id: number
  branchId: number
  warehouseId: number
  warehouseName: string
  type: CountType
  status: CountStatus
  name: string
  notes: string | null
  totalItems: number
  countedItems: number
  totalVariance: number
  totalVarianceCost: number
  createdById: number
  createdByName: string
  startedAt: string | null
  completedAt: string | null
  submittedAt: string | null
  approvedById: number | null
  approvedByName: string | null
  approvedAt: string | null
  rejectionReason: string | null
  items: ICountItem[]
  createdAt: string
  updatedAt: string
}

export interface IInventoryCountListItem {
  id: number
  branchId: number
  warehouseId: number
  warehouseName: string
  type: CountType
  status: CountStatus
  name: string
  notes: string | null
  totalItems: number
  countedItems: number
  totalVariance: number
  totalVarianceCost: number
  createdById: number
  createdByName: string
  startedAt: string | null
  completedAt: string | null
  approvedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ICountVarianceSummary {
  totalItems: number
  countedItems: number
  progressPercent: number
  positiveVariance: number
  negativeVariance: number
  netVariance: number
  netVarianceCost: number
}

// DTOs

export interface ICreateCountDto {
  warehouseId: number
  type: CountType
  name: string
  notes?: string
  itemIds?: number[] // For CYCLE/SPOT counts - specific items to count
  categoryFilter?: string // For CYCLE counts - filter by category
}

export interface IUpdateCountDto {
  name?: string
  notes?: string
}

export interface ICountItemDto {
  countedQuantity: number
  notes?: string
}

export interface IRejectCountDto {
  reason: string
}

// Query params

export interface ICountListParams {
  warehouseId?: number
  status?: CountStatus
  type?: CountType
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

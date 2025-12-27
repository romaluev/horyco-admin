/**
 * Inventory Item Entity Types
 * Based on /api/admin/inventory/items endpoints
 */

import type { ItemCategory, InventoryUnit } from '@/shared/types/inventory'

export interface IInventoryItem {
  id: number
  tenantId: number
  name: string
  sku?: string
  barcode?: string
  category: string
  unit: InventoryUnit
  minStockLevel: number
  maxStockLevel?: number
  reorderPoint?: number
  reorderQuantity?: number
  isActive: boolean
  isSemiFinished: boolean
  isTrackable: boolean
  taxRate?: number
  defaultSupplierId?: number
  defaultSupplier?: {
    id: number
    name: string
  }
  conversions?: IUnitConversion[]
  notes?: string
  createdAt: string
  updatedAt: string
  // Convenience aliases for pages
  minStock?: number
  maxStock?: number
}

export interface IUnitConversion {
  id: number
  itemId: number
  fromUnit: string
  toUnit: string
  conversionFactor: number
  createdAt: string
}

export interface ICreateInventoryItemDto {
  name: string
  sku?: string
  barcode?: string
  category?: string
  unit: InventoryUnit
  minStockLevel?: number
  maxStockLevel?: number
  reorderPoint?: number
  reorderQuantity?: number
  isActive?: boolean
  isSemiFinished?: boolean
  isTrackable?: boolean
  taxRate?: number
  defaultSupplierId?: number
}

export interface IUpdateInventoryItemDto {
  name?: string
  sku?: string
  barcode?: string
  category?: string
  unit?: InventoryUnit
  minStockLevel?: number
  maxStockLevel?: number
  reorderPoint?: number
  reorderQuantity?: number
  isActive?: boolean
  isSemiFinished?: boolean
  isTrackable?: boolean
  taxRate?: number
  defaultSupplierId?: number
}

export interface ICreateUnitConversionDto {
  fromUnit: string
  toUnit: string
  conversionFactor: number
}

export interface IGetInventoryItemsParams {
  search?: string
  category?: ItemCategory | string
  isActive?: boolean
  isSemiFinished?: boolean
  page?: number
  limit?: number
}

export interface IInventoryItemsResponse {
  data: IInventoryItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

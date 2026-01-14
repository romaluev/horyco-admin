/**
 * Inventory Item Entity Types
 * Based on Inventory Management System documentation
 */

export interface IInventoryItem {
  id: number
  name: string
  sku: string | null
  barcode: string | null
  category: string | null
  unit: string
  minStockLevel: number
  maxStockLevel: number | null
  reorderPoint: number | null
  reorderQuantity: number | null
  isActive: boolean
  isSemiFinished: boolean
  isTrackable: boolean
  shelfLifeDays: number | null
  defaultSupplierId: number | null
  taxRate: number
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface ICreateInventoryItemDto {
  name: string
  sku?: string
  barcode?: string
  category?: string
  unit: string
  minStockLevel?: number
  maxStockLevel?: number
  reorderPoint?: number
  reorderQuantity?: number
  isActive?: boolean
  isSemiFinished?: boolean
  isTrackable?: boolean
  shelfLifeDays?: number
  defaultSupplierId?: number
  taxRate?: number
  notes?: string
}

export interface IUpdateInventoryItemDto {
  name?: string
  sku?: string
  barcode?: string
  category?: string
  unit?: string
  minStockLevel?: number
  maxStockLevel?: number
  reorderPoint?: number
  reorderQuantity?: number
  isActive?: boolean
  isSemiFinished?: boolean
  isTrackable?: boolean
  shelfLifeDays?: number
  defaultSupplierId?: number
  taxRate?: number
  notes?: string
}

export interface IGetInventoryItemsParams {
  category?: string
  isActive?: boolean
  isSemiFinished?: boolean
  search?: string
}

export interface IUnitConversion {
  id: number
  itemId: number
  fromUnit: string
  toUnit: string
  conversionFactor: number
  notes: string | null
}

export interface ICreateUnitConversionDto {
  fromUnit: string
  toUnit: string
  conversionFactor: number
  notes?: string
}

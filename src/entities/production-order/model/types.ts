/**
 * Production Order Entity Types
 * Types for production order management
 */

import type { ProductionStatus } from '@/shared/types/inventory'

export interface IProductionOrderIngredient {
  id: number
  productionOrderId: number
  inventoryItemId: number
  inventoryItemName: string
  inventoryItemSku: string | null
  requiredQuantity: number
  usedQuantity: number | null
  unit: string
  unitCost: number
  totalCost: number
  createdAt: string
  updatedAt: string
}

export interface IProductionOrder {
  id: number
  branchId: number
  warehouseId: number
  warehouseName: string
  recipeId: number
  recipeName: string
  status: ProductionStatus
  quantity: number
  unit: string
  notes: string | null
  plannedDate: string | null
  startedAt: string | null
  completedAt: string | null
  cancelledAt: string | null
  createdById: number
  createdByName: string
  completedById: number | null
  completedByName: string | null
  estimatedCost: number
  actualCost: number | null
  outputItemId: number | null
  outputItemName: string | null
  ingredients: IProductionOrderIngredient[]
  createdAt: string
  updatedAt: string
}

export interface IProductionOrderListItem {
  id: number
  branchId: number
  warehouseId: number
  warehouseName: string
  recipeId: number
  recipeName: string
  status: ProductionStatus
  quantity: number
  unit: string
  notes: string | null
  plannedDate: string | null
  startedAt: string | null
  completedAt: string | null
  createdById: number
  createdByName: string
  estimatedCost: number
  actualCost: number | null
  outputItemName: string | null
  createdAt: string
  updatedAt: string
}

// DTOs

export interface ICreateProductionOrderDto {
  warehouseId: number
  recipeId: number
  quantity: number
  plannedDate?: string
  notes?: string
}

export interface IUpdateProductionOrderDto {
  quantity?: number
  plannedDate?: string
  notes?: string
}

export interface ICompleteProductionDto {
  usedIngredients?: Array<{
    ingredientId: number
    usedQuantity: number
  }>
  notes?: string
}

// Query params

export interface IProductionOrderListParams {
  warehouseId?: number
  recipeId?: number
  status?: ProductionStatus
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

// Production planning

export interface IProductionSuggestion {
  recipeId: number
  recipeName: string
  currentStock: number
  minStock: number
  suggestedQuantity: number
  estimatedCost: number
  canProduce: boolean
  missingIngredients: Array<{
    inventoryItemId: number
    inventoryItemName: string
    required: number
    available: number
    shortage: number
  }>
}

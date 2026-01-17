/**
 * Production Order Entity Types
 * Based on Inventory Management System documentation
 */

export type ProductionStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled'

export interface IProductionOrder {
  id: number
  warehouseId: number
  warehouseName: string
  recipeId: number
  recipeName: string
  outputItemId: number
  outputItemName: string
  productionNumber: string
  status: ProductionStatus
  plannedQuantity: number
  actualQuantity: number | null
  outputUnit: string
  plannedDate: string
  startedAt: string | null
  completedAt: string | null
  notes: string | null
  createdBy: number
  createdAt: string
  updatedAt: string
  ingredients?: IProductionIngredient[]
}

export interface IProductionIngredient {
  id: number
  productionOrderId: number
  itemId: number
  itemName: string
  itemUnit: string
  plannedQuantity: number
  actualQuantity: number | null
  unitCost: number
}

export interface ICreateProductionOrderDto {
  warehouseId: number
  recipeId: number
  quantityPlanned: number
  plannedDate?: string
  unit?: string
  notes?: string
}

export interface IUpdateProductionOrderDto {
  quantityPlanned?: number
  plannedDate?: string
  notes?: string
}

export interface IStartProductionDto {
  actualIngredients?: {
    itemId: number
    actualQuantity: number
  }[]
}

export interface ICompleteProductionDto {
  actualQuantity: number
  notes?: string
}

export interface IGetProductionOrdersParams {
  status?: ProductionStatus
  warehouseId?: number
  recipeId?: number
  outputItemId?: number
  from?: string
  to?: string
}

export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  planned: 'Запланировано',
  in_progress: 'В процессе',
  completed: 'Завершено',
  cancelled: 'Отменено',
}

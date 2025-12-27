/**
 * Recipe (Tech Card) Entity Types
 * Based on /api/admin/inventory/recipes endpoints
 */

import { RecipeLinkType } from '@/shared/types/inventory'

export interface IRecipe {
  id: number
  tenantId: number
  name: string
  linkType: RecipeLinkType
  productId?: number
  product?: {
    id: number
    name: string
    price: number
  }
  modifierId?: number
  modifier?: {
    id: number
    name: string
    price: number
  }
  itemId?: number
  item?: {
    id: number
    name: string
    isSemiFinished: boolean
  }
  outputQuantity: number
  outputUnit: string
  prepTimeMinutes?: number
  notes?: string
  isActive: boolean
  version: number
  calculatedCost: number
  costUpdatedAt?: string
  grossMargin?: number
  ingredients: IRecipeIngredient[]
  createdAt: string
  updatedAt: string
  // Convenience flat fields for list views
  ingredientCount?: number
  totalCost?: number
  linkedName?: string
}

export interface IRecipeIngredient {
  id: number
  recipeId: number
  itemId: number
  item?: {
    id: number
    name: string
    sku?: string
    unit: string
    isSemiFinished: boolean
  }
  quantity: number
  unit: string
  wasteFactor: number
  unitCost: number
  lineCost: number
  sortOrder: number
}

export interface ICreateRecipeDto {
  name: string
  linkType: RecipeLinkType
  productId?: number
  modifierId?: number
  itemId?: number
  outputQuantity: number
  outputUnit: string
  prepTimeMinutes?: number
  notes?: string
  isActive?: boolean
  ingredients?: ICreateRecipeIngredientDto[]
}

export interface IUpdateRecipeDto {
  name?: string
  outputQuantity?: number
  outputUnit?: string
  prepTimeMinutes?: number
  notes?: string
  isActive?: boolean
}

export interface ICreateRecipeIngredientDto {
  itemId: number
  quantity: number
  unit: string
  wasteFactor?: number
  sortOrder?: number
}

export interface IUpdateRecipeIngredientDto {
  quantity?: number
  unit?: string
  wasteFactor?: number
  sortOrder?: number
}

export interface IGetRecipesParams {
  search?: string
  productId?: number
  modifierId?: number
  itemId?: number
  linkType?: RecipeLinkType
  isActive?: boolean
  page?: number
  limit?: number
}

export interface IRecipesResponse {
  data: IRecipe[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IRecipeCostResult {
  calculatedCost: number
  ingredients: Array<{
    itemId: number
    itemName: string
    quantity: number
    unitCost: number
    lineCost: number
    wasteFactor: number
  }>
  costUpdatedAt: string
}

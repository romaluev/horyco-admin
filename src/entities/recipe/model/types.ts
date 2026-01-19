/**
 * Recipe Entity Types (Tech Cards)
 * Based on Inventory Management System documentation
 */

export interface IRecipe {
  id: number
  name: string
  productId: number | null
  productName?: string | null
  productPrice?: number | null
  modifierId: number | null
  modifierName?: string | null
  itemId: number | null
  itemName?: string | null
  outputQuantity: number
  outputUnit: string | null
  prepTimeMinutes: number | null
  isActive: boolean
  version: number
  calculatedCost: number
  costUpdatedAt: string | null
  marginPercent?: number | null
  marginAmount?: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
  autoUpdateCost?: boolean
  recipeType?: 'product' | 'modifier' | 'semi-finished' | 'unlinked'
  ingredients?: IRecipeIngredient[]
}

export interface IRecipeIngredient {
  id: number
  recipeId: number
  itemId: number
  itemName: string
  itemUnit: string
  quantity: number
  unit: string
  wasteFactor: number
  isOptional: boolean
  sortOrder: number
  unitCost: number
  lineCost: number
  notes: string | null
}

export interface ICreateRecipeDto {
  name: string
  productId?: number
  modifierId?: number
  itemId?: number
  outputQuantity?: number
  outputUnit?: string
  prepTimeMinutes?: number
  notes?: string
  isActive?: boolean
  ingredients?: ICreateRecipeIngredientDto[]
}

export interface IUpdateRecipeDto {
  name?: string
  productId?: number
  modifierId?: number
  itemId?: number
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
  isOptional?: boolean
  sortOrder?: number
  notes?: string
}

export interface IUpdateRecipeIngredientDto {
  quantity?: number
  unit?: string
  wasteFactor?: number
  isOptional?: boolean
  sortOrder?: number
  notes?: string
}

export type RecipeType = 'product' | 'modifier' | 'semi-finished' | 'unlinked'

export interface IGetRecipesParams {
  search?: string
  productId?: number
  modifierId?: number
  itemId?: number
  isActive?: boolean
  type?: RecipeType
}

export interface IDuplicateRecipeDto {
  name: string
}

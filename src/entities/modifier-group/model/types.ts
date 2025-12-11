/**
 * Modifier Group Entity Types
 * Based on ADMIN_MENU_MANAGEMENT.md specification
 */

export interface IModifierGroup {
  id: number
  name: string
  description?: string
  isRequired: boolean
  minSelection: number
  maxSelection: number
  sortOrder: number
  createdAt: string
  updatedAt: string
  modifiers?: IModifier[]
}

export interface IModifier {
  id: number
  name: string
  description?: string
  price: number
  modifierGroupId: number
  modifierGroupName?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ICreateModifierGroupDto {
  name: string
  description?: string
  isRequired: boolean
  minSelection: number
  maxSelection: number
  sortOrder?: number
}

export interface IUpdateModifierGroupDto {
  name?: string
  description?: string
  isRequired?: boolean
  minSelection?: number
  maxSelection?: number
  sortOrder?: number
}

export interface IGetModifierGroupsParams {
  search?: string
  isRequired?: boolean
}

export interface ICreateModifierDto {
  name: string
  description?: string
  price: number
  modifierGroupId: number
  sortOrder?: number
}

export interface IUpdateModifierDto {
  name?: string
  description?: string
  price?: number
  sortOrder?: number
}

export interface IGetModifiersParams {
  modifierGroupId?: number
}

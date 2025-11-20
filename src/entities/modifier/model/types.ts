/**
 * Modifier Entity Types
 * Based on ADMIN_MENU_MANAGEMENT.md specification
 */

/**
 * Modifier - Individual option within a modifier group
 */
export interface IModifier {
  id: number
  name: string
  description?: string
  image?: string
  imageUrls?: {
    original?: string
    medium?: string
    thumb?: string
  }
  price: number
  modifierGroupId: number
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ICreateModifierDto {
  name: string
  description?: string
  image?: string
  price: number
  modifierGroupId: number
  sortOrder?: number
  isActive?: boolean
}

export interface IUpdateModifierDto {
  name?: string
  description?: string
  image?: string
  price?: number
  sortOrder?: number
  isActive?: boolean
}

/**
 * Modifier Group - Group of related modifiers
 */
export interface IModifierGroup {
  id: number
  name: string
  productId: number
  minSelection: number
  maxSelection: number
  isRequired: boolean
  sortOrder: number
  modifiers: IModifier[]
  createdAt: string
  updatedAt: string
}

export interface ICreateModifierGroupDto {
  name: string
  productId: number
  minSelection?: number
  maxSelection?: number
  isRequired?: boolean
  sortOrder?: number
}

export interface IUpdateModifierGroupDto {
  name?: string
  minSelection?: number
  maxSelection?: number
  isRequired?: boolean
  sortOrder?: number
}

export interface IGetModifiersParams {
  modifierGroupId?: number
}

export interface IGetModifierGroupsParams {
  productId?: number
}

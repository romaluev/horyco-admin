/**
 * Addition Entity Types
 * Based on ADMIN_MENU_MANAGEMENT.md specification
 */

/**
 * Addition Item - Individual item within an addition group
 */
export interface IAdditionItem {
  id: number
  name: string
  price: number
  additionId: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ICreateAdditionItemDto {
  name: string
  price: number
  additionId: number
  sortOrder?: number
}

export interface IUpdateAdditionItemDto {
  name?: string
  price?: number
  sortOrder?: number
}

/**
 * Addition - Group of additional items that can be added to a product
 */
export interface IAddition {
  id: number
  name: string
  description?: string
  productId: number
  isRequired: boolean
  isMultiple: boolean
  isCountable: boolean
  minSelection: number
  maxSelection: number
  sortOrder: number
  isActive: boolean
  items: IAdditionItem[]
  createdAt: string
  updatedAt: string
}

export interface ICreateAdditionDto {
  name: string
  description?: string
  productId: number
  isRequired?: boolean
  isMultiple?: boolean
  isCountable?: boolean
  minSelection?: number
  maxSelection?: number
  sortOrder?: number
  isActive?: boolean
}

export interface IUpdateAdditionDto {
  name?: string
  description?: string
  isRequired?: boolean
  isMultiple?: boolean
  isCountable?: boolean
  minSelection?: number
  maxSelection?: number
  sortOrder?: number
  isActive?: boolean
}

export interface IGetAdditionsParams {
  productId?: number
}

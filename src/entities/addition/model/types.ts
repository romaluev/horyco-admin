/**
 * Addition Entity Types
 * Based on ADMIN_MENU_MANAGEMENT.md specification
 */

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
  itemsCount?: number
  image?: string
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
  image?: string
}

export interface IGetAdditionsParams {
  productId?: number
}

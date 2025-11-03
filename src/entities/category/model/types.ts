/**
 * Category Entity Types
 * Based on ADMIN_MENU_MANAGEMENT.md specification
 */

export interface ICategory {
  id: number
  name: string
  description?: string
  image?: string
  parentId: number | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  children?: ICategory[]
  productCount?: number
}

export interface ICreateCategoryDto {
  name: string
  description?: string
  parentId?: number | null
  image?: string
  sortOrder?: number
  isActive?: boolean
}

export interface IUpdateCategoryDto {
  name?: string
  description?: string
  parentId?: number | null
  image?: string
  sortOrder?: number
  isActive?: boolean
}

export interface IReorderCategoriesDto {
  categoryIds: string[]
}

export interface IGetCategoriesParams {
  parentId?: number
  includeProducts?: boolean
}

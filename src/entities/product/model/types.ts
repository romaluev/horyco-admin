/**
 * Product Entity Types
 * Based on ADMIN_MENU_MANAGEMENT.md specification
 */

/**
 * Product - Main menu item
 */
export interface IProduct {
  id: number
  name: string
  description?: string
  price: number
  categoryId: number
  categoryName?: string
  productTypeId: number
  image?: string
  imageUrls?: {
    original?: string
    large?: string
    medium?: string
    thumb?: string
  }
  isAvailable: boolean
  sortOrder: number
  preparationTime?: number // in minutes
  calories?: number
  allergens?: string[]
  modifierGroupsCount?: number
  additionsCount?: number
  createdAt: string
  updatedAt: string
}

export interface ICreateProductDto {
  name: string
  description?: string
  price: number
  categoryId: number
  productTypeId: number
  image?: string
  isAvailable?: boolean
  preparationTime?: number
  calories?: number
  allergens?: string[]
}

export interface IUpdateProductDto {
  name?: string
  description?: string
  price?: number
  categoryId?: number
  productTypeId?: number
  image?: string
  isAvailable?: boolean
  preparationTime?: number
  calories?: number
  allergens?: string[]
}

export interface IUpdateProductPriceDto {
  price: number
}

export interface IUpdateProductAvailabilityDto {
  isAvailable: boolean
}

/**
 * Bulk Operations Types (NEW - 2025-11-03)
 */
export interface IBulkCreateProductsDto {
  products: ICreateProductDto[]
}

export interface IBulkCreateProductsResult {
  total: number
  successful: number
  failed: number
  results: Array<{
    success: boolean
    data?: IProduct
    error?: string
  }>
}

export interface IBulkPriceUpdateDto {
  productIds: number[]
  priceChange: {
    type: 'percentage' | 'fixed'
    value: number
  }
}

export interface IBulkAvailabilityUpdateDto {
  productIds: number[]
  isAvailable: boolean
}

export interface IBulkDeleteDto {
  productIds: number[]
}

export interface IBulkDeleteResult {
  deleted: number
  failed: number
  errors?: Array<{
    productId: number
    reason: string
  }>
}

export interface IBulkUpdateDto {
  productIds: number[]
  updates: Partial<IUpdateProductDto>
}

export interface IReorderProductsDto {
  productIds: number[]
}

export interface IGetProductsParams {
  categoryId?: number
  available?: boolean
  q?: string
  page?: number
  limit?: number
}

export interface IProductsResponse {
  data: IProduct[]
  total: number
  page: number
  limit: number
  totalPages: number
}

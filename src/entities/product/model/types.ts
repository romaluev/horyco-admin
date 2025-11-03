/**
 * Product Entity Types
 * Based on ADMIN_MENU_MANAGEMENT.md specification
 */

/**
 * Product - Main menu item
 */
export interface IProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  productTypeId: number;
  image?: string;
  isAvailable: boolean;
  sortOrder: number;
  preparationTime?: number; // in minutes
  calories?: number;
  allergens?: string[];
  modifierGroupsCount?: number;
  additionsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProductDto {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  productTypeId: number;
  image?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  calories?: number;
  allergens?: string[];
}

export interface IUpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  productTypeId?: number;
  image?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  calories?: number;
  allergens?: string[];
}

export interface IUpdateProductPriceDto {
  price: number;
}

export interface IUpdateProductAvailabilityDto {
  isAvailable: boolean;
}

export interface IGetProductsParams {
  categoryId?: number;
  available?: boolean;
  q?: string;
  page?: number;
  limit?: number;
}

export interface IProductsResponse {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Product Type - Classification category
 */
export interface IProductType {
  id: number;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ICreateProductTypeDto {
  name: string;
  description?: string;
  image?: string;
}

export interface IUpdateProductTypeDto {
  name?: string;
  description?: string;
  image?: string;
}

export interface IProductTypeResponse {
  data: IProductType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Legacy types for backward compatibility
 * TODO: Remove after full migration
 */
export interface IProductTypeRequest {
  name: string;
  description?: string;
  image?: string;
}

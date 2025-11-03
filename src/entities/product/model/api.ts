/**
 * Product API Client
 * Based on /admin/menu/products endpoints from ADMIN_MENU_MANAGEMENT.md
 */

import api from '@/shared/lib/axios';

import type {
  IProduct,
  IProductsResponse,
  ICreateProductDto,
  IUpdateProductDto,
  IUpdateProductPriceDto,
  IUpdateProductAvailabilityDto,
  IGetProductsParams,
  IProductType,
  IProductTypeResponse,
  ICreateProductTypeDto,
  IUpdateProductTypeDto
} from './types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  requestId: string;
}

export const productApi = {
  /**
   * Get all products with filters and pagination
   * GET /admin/menu/products
   */
  async getProducts(params?: IGetProductsParams): Promise<IProductsResponse> {
    const response = await api.get<ApiResponse<IProductsResponse>>(
      '/admin/menu/products',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get product by ID
   * GET /admin/menu/products/:id
   */
  async getProductById(id: number): Promise<IProduct> {
    const response = await api.get<ApiResponse<IProduct>>(
      `/admin/menu/products/${id}`
    );
    return response.data.data;
  },

  /**
   * Create new product
   * POST /admin/menu/products
   */
  async createProduct(data: ICreateProductDto): Promise<IProduct> {
    const response = await api.post<ApiResponse<IProduct>>(
      '/admin/menu/products',
      data
    );
    return response.data.data;
  },

  /**
   * Update product
   * PATCH /admin/menu/products/:id
   */
  async updateProduct(id: number, data: IUpdateProductDto): Promise<IProduct> {
    const response = await api.patch<ApiResponse<IProduct>>(
      `/admin/menu/products/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Quick update product price
   * PATCH /admin/menu/products/:id/price
   */
  async updateProductPrice(
    id: number,
    data: IUpdateProductPriceDto
  ): Promise<IProduct> {
    const response = await api.patch<ApiResponse<IProduct>>(
      `/admin/menu/products/${id}/price`,
      data
    );
    return response.data.data;
  },

  /**
   * Quick update product availability
   * PATCH /admin/menu/products/:id/availability
   */
  async updateProductAvailability(
    id: number,
    data: IUpdateProductAvailabilityDto
  ): Promise<IProduct> {
    const response = await api.patch<ApiResponse<IProduct>>(
      `/admin/menu/products/${id}/availability`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete product (soft delete)
   * DELETE /admin/menu/products/:id
   */
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/admin/menu/products/${id}`);
  },

  // ===== Product Types =====

  /**
   * Get all product types
   * GET /admin/menu/product-types
   */
  async getProductTypes(params?: {
    page?: number;
    limit?: number;
  }): Promise<IProductTypeResponse> {
    const response = await api.get<ApiResponse<IProductTypeResponse>>(
      '/admin/menu/product-types',
      { params }
    );

    return response.data.data;
  },

  /**
   * Create product type
   * POST /admin/menu/product-types
   */
  async createProductType(data: ICreateProductTypeDto): Promise<IProductType> {
    const response = await api.post<ApiResponse<IProductType>>(
      '/admin/menu/product-types',
      data
    );
    return response.data.data;
  },

  /**
   * Update product type
   * PATCH /admin/menu/product-types/:id
   */
  async updateProductType(
    id: number,
    data: IUpdateProductTypeDto
  ): Promise<IProductType> {
    const response = await api.patch<ApiResponse<IProductType>>(
      `/admin/menu/product-types/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete product type
   * DELETE /admin/menu/product-types/:id
   */
  async deleteProductType(id: number): Promise<void> {
    await api.delete(`/admin/menu/product-types/${id}`);
  }
};

/**
 * Legacy export for backward compatibility
 * @deprecated Use productApi instead
 */
export const productAPi = productApi;

/**
 * Product API Client
 * Based on /admin/menu/products endpoints from ADMIN_MENU_MANAGEMENT.md
 */

import api from '@/shared/lib/axios'

import type {
  IProduct,
  IProductsResponse,
  ICreateProductDto,
  IUpdateProductDto,
  IUpdateProductAvailabilityDto,
  IGetProductsParams,
  IBulkCreateProductsDto,
  IBulkCreateProductsResult,
  IBulkPriceUpdateDto,
  IBulkAvailabilityUpdateDto,
  IBulkDeleteDto,
  IBulkDeleteResult,
  IBulkUpdateDto,
  IReorderProductsDto,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
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
    )
    return response.data.data
  },

  /**
   * Get product by ID
   * GET /admin/menu/products/:id
   */
  async getProductById(id: number): Promise<IProduct> {
    const response = await api.get<ApiResponse<IProduct>>(
      `/admin/menu/products/${id}`
    )
    return response.data.data
  },

  /**
   * Create new product
   * POST /admin/menu/products
   */
  async createProduct(data: ICreateProductDto): Promise<IProduct> {
    const response = await api.post<ApiResponse<IProduct>>(
      '/admin/menu/products',
      data
    )
    return response.data.data
  },

  /**
   * Create product with image (NEW - 2025-11-03)
   * POST /admin/menu/products/with-image
   * Content-Type: multipart/form-data
   * Single API call instead of 3 (create → upload → update)
   * Features: automatic WebP optimization, variant generation, tenant isolation
   */
  async createProductWithImage(
    data: ICreateProductDto,
    image: File
  ): Promise<IProduct> {
    const formData = new FormData()
    formData.append('image', image)

    // Append all product data fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await api.post<ApiResponse<IProduct>>(
      '/admin/menu/products/with-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },

  /**
   * Update product
   * PATCH /admin/menu/products/:id
   * Note: Use this for single product updates including price changes
   */
  async updateProduct(id: number, data: IUpdateProductDto): Promise<IProduct> {
    const response = await api.patch<ApiResponse<IProduct>>(
      `/admin/menu/products/${id}`,
      data
    )
    return response.data.data
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
    )
    return response.data.data
  },

  /**
   * Delete product (soft delete)
   * DELETE /admin/menu/products/:id
   */
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/admin/menu/products/${id}`)
  },

  // ===== Bulk Operations (NEW - 2025-11-03) =====

  /**
   * Bulk create products
   * POST /admin/menu/products/bulk
   */
  async bulkCreateProducts(
    data: IBulkCreateProductsDto
  ): Promise<IBulkCreateProductsResult> {
    const response = await api.post<ApiResponse<IBulkCreateProductsResult>>(
      '/admin/menu/products/bulk',
      data
    )
    return response.data.data
  },

  /**
   * Bulk price update
   * PATCH /admin/menu/products/bulk-price
   * Examples:
   * - Increase by 10%: { type: "percentage", value: 10 }
   * - Decrease by 5%: { type: "percentage", value: -5 }
   * - Add fixed amount: { type: "fixed", value: 5000 }
   */
  async bulkUpdatePrice(data: IBulkPriceUpdateDto): Promise<void> {
    await api.patch('/admin/menu/products/bulk-price', data)
  },

  /**
   * Bulk availability update
   * PATCH /admin/menu/products/bulk-availability
   */
  async bulkUpdateAvailability(
    data: IBulkAvailabilityUpdateDto
  ): Promise<void> {
    await api.patch('/admin/menu/products/bulk-availability', data)
  },

  /**
   * Category-level availability update
   * PATCH /admin/menu/categories/:categoryId/products/availability
   */
  async updateCategoryProductsAvailability(
    categoryId: number,
    isAvailable: boolean
  ): Promise<void> {
    await api.patch(
      `/admin/menu/categories/${categoryId}/products/availability`,
      { isAvailable }
    )
  },

  /**
   * Bulk delete products
   * DELETE /admin/menu/products/bulk-delete
   */
  async bulkDeleteProducts(data: IBulkDeleteDto): Promise<IBulkDeleteResult> {
    const response = await api.delete<ApiResponse<IBulkDeleteResult>>(
      '/admin/menu/products/bulk-delete',
      { data }
    )
    return response.data.data
  },

  /**
   * Bulk general update
   * PATCH /admin/menu/products/bulk-update
   */
  async bulkUpdateProducts(data: IBulkUpdateDto): Promise<void> {
    await api.patch('/admin/menu/products/bulk-update', data)
  },

  /**
   * Reorder products within category
   * PATCH /admin/menu/categories/:categoryId/products/reorder
   */
  async reorderCategoryProducts(
    categoryId: number,
    data: IReorderProductsDto
  ): Promise<void> {
    await api.patch(
      `/admin/menu/categories/${categoryId}/products/reorder`,
      data
    )
  },
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use productApi instead
 */
export const productAPi = productApi

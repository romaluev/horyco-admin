import api from '@/lib/axios';
import { IProduct, CreateProductRequest, UpdateProductRequest } from './types';
import {
  FilteringParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams
} from '@/types';

/**
 * Product API functions
 */

/**
 * Create a new branch
 * @param productData - The branch data to create
 * @returns Promise with the created branch
 */
export const createProduct = async (
  productData: CreateProductRequest
): Promise<IProduct> => {
  const response = await api.post<IProduct>('/product', productData);
  return response.data;
};

/**
 * Get all branch with pagination, sorting, and filtering
 * @param pagination - Pagination parameters
 * @param sorting - Sorting parameters
 * @param filtering - Filtering parameters
 * @returns Promise with paginated branch
 */
export const getProducts = async (
  pagination?: PaginationParams,
  sorting?: SortingParams,
  filtering?: FilteringParams[]
): Promise<PaginatedResponse<IProduct>> => {
  // Build query parameters
  const params = new URLSearchParams();

  // Add pagination params
  if (pagination) {
    if (Number.isInteger(pagination.page))
      params.append('page', pagination.page + '');
    if (pagination.size) params.append('size', pagination.size.toString());
  }

  // Add sorting params
  // if (sorting) {
  //   params.append('sortBy', sorting.field);
  //   params.append('sortOrder', sorting.order);
  // }

  // Add filtering params
  if (filtering && filtering.length > 0) {
    filtering.forEach((filter, index) => {
      params.append(`filters[${index}][field]`, filter.field);
      params.append(`filters[${index}][value]`, filter.value.toString());
    });
  }

  const response = await api.get<PaginatedResponse<IProduct>>('/product', {
    params
  });
  return response.data;
};

/**
 * Get a product by ID
 * @param id - The product ID
 * @returns Promise with the product
 */
export const getProductById = async (id: number): Promise<IProduct> => {
  const response = await api.get<IProduct>(`/product/${id}`);
  return response.data;
};

/**
 * Update a product
 * @param id - The product ID
 * @param productData - The product data to update
 * @returns Promise with the updated product
 */
export const updateProduct = async (
  id: number,
  productData: UpdateProductRequest
): Promise<IProduct> => {
  const response = await api.put<IProduct>(`/product/${id}`, productData);
  return response.data;
};

/**
 * Delete a product
 * @param id - The product ID
 * @returns Promise with the deleted product
 */
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/product/${id}`);
};

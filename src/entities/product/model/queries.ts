/**
 * Product Query Hooks
 * React Query hooks for fetching product data
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { productApi } from './api';
import { productKeys } from './query-keys';

import type {
  IProduct,
  IProductsResponse,
  IGetProductsParams,
  IProductTypeResponse
} from './types';

/**
 * Get all products with filters and pagination
 */
export const useGetProducts = (
  params?: IGetProductsParams,
  options?: Omit<
    UseQueryOptions<IProductsResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
    ...options
  });
};

/**
 * Get product by ID
 */
export const useGetProductById = (
  id: number,
  options?: Omit<UseQueryOptions<IProduct, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
    ...options
  });
};

/**
 * Get all product types
 */
export const useGetProductTypes = (
  params?: { page?: number; limit?: number },
  options?: Omit<
    UseQueryOptions<IProductTypeResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: productKeys.productTypes.list(params),
    queryFn: () => productApi.getProductTypes(params),
    ...options
  });
};

/**
 * Legacy exports for backward compatibility
 * @deprecated Use useGetProducts instead
 */
export const useGetAllProducts = useGetProducts;

/**
 * @deprecated Use useGetProductTypes instead
 */
export const useGetAllProductTypes = useGetProductTypes;

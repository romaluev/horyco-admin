/**
 * Category Query Hooks
 * React Query hooks for fetching category data
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import { categoryApi } from './api'
import { categoryKeys } from './query-keys'

import type { ICategory, IGetCategoriesParams } from './types'

/**
 * Get all categories with optional filters
 */
export const useGetCategories = (
  params?: IGetCategoriesParams,
  options?: Omit<UseQueryOptions<ICategory[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryApi.getCategories(params),
    ...options,
  })
}

/**
 * Get category by ID
 */
export const useGetCategoryById = (
  id: number,
  options?: Omit<UseQueryOptions<ICategory, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: !!id,
    ...options,
  })
}

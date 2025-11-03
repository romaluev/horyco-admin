/**
 * Addition Query Hooks
 * React Query hooks for fetching addition data
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { additionApi } from './api';
import { additionKeys } from './query-keys';

import type {
  IAddition,
  IGetAdditionsParams,
  IAdditionItem
} from './types';

/**
 * Get all additions with optional filters
 */
export const useGetAdditions = (
  params?: IGetAdditionsParams,
  options?: Omit<UseQueryOptions<IAddition[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: additionKeys.list(params),
    queryFn: () => additionApi.getAdditions(params),
    ...options
  });
};

/**
 * Get addition by ID
 */
export const useGetAdditionById = (
  id: number,
  options?: Omit<UseQueryOptions<IAddition, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: additionKeys.detail(id),
    queryFn: () => additionApi.getAdditionById(id),
    enabled: !!id,
    ...options
  });
};

/**
 * Get additions by product ID
 */
export const useGetAdditionsByProduct = (
  productId: number,
  options?: Omit<UseQueryOptions<IAddition[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: additionKeys.byProduct(productId),
    queryFn: () => additionApi.getAdditions({ productId }),
    enabled: !!productId,
    ...options
  });
};

/**
 * Get addition items for a specific addition
 */
export const useGetAdditionItems = (
  additionId: number,
  options?: Omit<UseQueryOptions<IAdditionItem[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: additionKeys.items.byAddition(additionId),
    queryFn: () => additionApi.getAdditionItems(additionId),
    enabled: !!additionId,
    ...options
  });
};

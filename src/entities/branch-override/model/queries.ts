/**
 * Branch Override Queries
 * React Query hooks for fetching branch overrides
 */

import { useQuery } from '@tanstack/react-query';

import { branchOverrideApi } from './api';
import { branchOverrideKeys } from './query-keys';

/**
 * Get all branch overrides for a specific product
 * GET /admin/menu/products/:id/branches
 */
export const useGetProductBranchOverrides = (productId: number) => {
  return useQuery({
    queryKey: branchOverrideKeys.product(productId),
    queryFn: () => branchOverrideApi.getProductBranchOverrides(productId),
    enabled: !!productId
  });
};

/**
 * Get all product overrides for a specific branch
 * GET /admin/menu/branches/:branchId/overrides
 */
export const useGetBranchOverrides = (branchId: number) => {
  return useQuery({
    queryKey: branchOverrideKeys.branch(branchId),
    queryFn: () => branchOverrideApi.getBranchOverrides(branchId),
    enabled: !!branchId
  });
};

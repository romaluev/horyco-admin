/**
 * Branch Override Query Keys
 * Query key factory for branch overrides
 */

/**
 * Query keys for branch overrides
 */
export const branchOverrideKeys = {
  all: ['branch-overrides'] as const,
  product: (productId: number) =>
    [...branchOverrideKeys.all, 'product', productId] as const,
  branch: (branchId: number) =>
    [...branchOverrideKeys.all, 'branch', branchId] as const,
}

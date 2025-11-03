/**
 * Branch Override Types
 * Types for branch-specific product overrides
 * Based on ADMIN_MENU_MANAGEMENT.md (lines 1111-1186)
 */

/**
 * Branch override for product settings
 * Response from GET /admin/menu/products/:id/branches
 * and GET /admin/menu/branches/:branchId/overrides
 */
export interface IBranchOverride {
  branchId: number;
  branchName: string;
  productId?: number;
  productName?: string;
  basePrice?: number;
  overridePrice: number | null;
  overrideAvailability: boolean | null;
  overrideImage: string | null;
  overrideName: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Upsert branch override DTO
 * For PATCH /admin/menu/products/:id/branches/:branchId
 * null values mean "use base product value"
 */
export interface IUpsertBranchOverrideDto {
  overridePrice?: number | null;
  overrideAvailability?: boolean | null;
  overrideImage?: string | null;
  overrideName?: string | null;
}

/**
 * Branch override with product details
 */
export interface IBranchOverrideWithProduct extends IBranchOverride {
  product: {
    id: number;
    name: string;
    basePrice: number;
    baseAvailability: boolean;
  };
}

/**
 * Branch override with branch details
 */
export interface IBranchOverrideWithBranch extends IBranchOverride {
  branch: {
    id: number;
    name: string;
  };
}

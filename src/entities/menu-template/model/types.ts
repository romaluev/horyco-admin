/**
 * Menu Template Types
 * Types for menu template management
 */

/**
 * Menu template
 */
export interface IMenuTemplate {
  id: number;
  name: string;
  description?: string;
  thumbnail?: string;
  businessType: string;
  categoryCount: number;
  productCount: number;
  isPremium: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Menu template with full details
 */
export interface IMenuTemplateDetail extends IMenuTemplate {
  categories: ITemplateCategory[];
  modifierGroups: ITemplateModifierGroup[];
  additions: ITemplateAddition[];
}

/**
 * Template category
 */
export interface ITemplateCategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  parentId: number | null;
  sortOrder: number;
  products: ITemplateProduct[];
}

/**
 * Template product
 */
export interface ITemplateProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  image?: string;
  preparationTime?: number;
  calories?: number;
  allergens?: string[];
}

/**
 * Template modifier group
 */
export interface ITemplateModifierGroup {
  id: number;
  name: string;
  productId: number;
  minSelection: number;
  maxSelection: number;
  isRequired: boolean;
  modifiers: ITemplateModifier[];
}

/**
 * Template modifier
 */
export interface ITemplateModifier {
  id: number;
  name: string;
  description?: string;
  price: number;
  modifierGroupId: number;
}

/**
 * Template addition
 */
export interface ITemplateAddition {
  id: number;
  name: string;
  description?: string;
  productId: number;
  isRequired: boolean;
  isMultiple: boolean;
  isCountable: boolean;
  minSelection: number;
  maxSelection: number;
  items: ITemplateAdditionItem[];
}

/**
 * Template addition item
 */
export interface ITemplateAdditionItem {
  id: number;
  name: string;
  price: number;
  additionId: number;
}

/**
 * Get templates params
 */
export interface IGetTemplatesParams {
  businessType?: string;
  isPremium?: boolean;
  isPopular?: boolean;
}

/**
 * Apply template DTO
 */
export interface IApplyTemplateDto {
  templateId: number;
  applyCategories?: boolean;
  applyProducts?: boolean;
  applyModifiers?: boolean;
  applyAdditions?: boolean;
  replaceExisting?: boolean;
}

/**
 * Apply template result
 */
export interface IApplyTemplateResult {
  success: boolean;
  categoriesCreated: number;
  productsCreated: number;
  modifiersCreated: number;
  additionsCreated: number;
  message: string;
}

/**
 * Business type
 */
export interface IBusinessType {
  type: string;
  name: string;
  count: number;
}

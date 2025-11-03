/**
 * Product Entity - Public API
 * Entry point for product entity exports
 */

// API
export { productApi, productAPi } from './model/api';

// Query Keys
export { productKeys } from './model/query-keys';

// Queries
export {
  useGetProducts,
  useGetProductById,
  useGetProductTypes,
  useGetAllProducts,
  useGetAllProductTypes
} from './model/queries';

// Mutations
export {
  useCreateProduct,
  useUpdateProduct,
  useUpdateProductPrice,
  useUpdateProductAvailability,
  useDeleteProduct,
  useCreateProductType,
  useUpdateProductType,
  useDeleteProductType
} from './model/mutations';

// Types
export type {
  IProduct,
  ICreateProductDto,
  IUpdateProductDto,
  IUpdateProductPriceDto,
  IUpdateProductAvailabilityDto,
  IGetProductsParams,
  IProductsResponse,
  IProductType,
  ICreateProductTypeDto,
  IUpdateProductTypeDto,
  IProductTypeResponse,
  IProductTypeRequest
} from './model/types';

// UI Components
export { ProductList } from './ui/product-list';

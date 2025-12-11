/**
 * Product Entity - Public API
 * Entry point for product entity exports
 */

// API
export { productApi, productAPi } from './model/api'

// Query Keys
export { productKeys } from './model/query-keys'

// Queries
export {
  useGetProducts,
  useGetProductById,
  useGetAllProducts,
} from './model/queries'

// Mutations
export {
  useCreateProduct,
  useUpdateProduct,
  useUpdateProductAvailability,
  useDeleteProduct,
} from './model/mutations'

// Types
export type {
  IProduct,
  ICreateProductDto,
  IUpdateProductDto,
  IUpdateProductAvailabilityDto,
  IGetProductsParams,
  IProductsResponse,
} from './model/types'

// UI Components
export { ProductList } from './ui/product-list'

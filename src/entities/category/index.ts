/**
 * Category Entity - Public API
 * Entry point for category entity exports
 */

export {
  categoryApi,
  categoryKeys,
  useGetCategories,
  useGetCategoryById,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
  type ICategory,
  type ICreateCategoryDto,
  type IUpdateCategoryDto,
  type IReorderCategoriesDto,
  type IGetCategoriesParams
} from './model';

export { CategoryCard } from './ui/category-card';
export { CategoryList } from './ui/category-list';
export { CategoryTree } from './ui/category-tree';
export { CategoryTreeItem } from './ui/category-tree-item';

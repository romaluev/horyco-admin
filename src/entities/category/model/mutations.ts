/**
 * Category Mutation Hooks
 * React Query mutations for category operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { categoryApi } from './api';
import { categoryKeys } from './query-keys';

import type {
  ICreateCategoryDto,
  IUpdateCategoryDto,
  IReorderCategoriesDto
} from './types';

/**
 * Create category mutation
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateCategoryDto) =>
      categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() });
      toast.success('Категория успешно создана');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании категории');
      console.error('Create category error:', error);
    }
  });
};

/**
 * Update category mutation
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateCategoryDto }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      toast.success('Категория успешно обновлена');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении категории');
      console.error('Update category error:', error);
    }
  });
};

/**
 * Delete category mutation
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() });
      toast.success('Категория успешно удалена');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении категории');
      console.error('Delete category error:', error);
    }
  });
};

/**
 * Reorder categories mutation
 */
export const useReorderCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IReorderCategoriesDto) =>
      categoryApi.reorderCategories(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() });
      toast.success('Порядок категорий обновлен');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при изменении порядка');
      console.error('Reorder categories error:', error);
    }
  });
};

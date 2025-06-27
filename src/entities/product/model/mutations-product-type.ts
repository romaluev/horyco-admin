import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPi } from './api';
import { productKeys } from './query-keys';
import { IProductTypeRequest } from './types';
import { toast } from 'sonner';

/**
 * Хук для создания новой категории продукта
 */
export const useCreateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IProductTypeRequest) =>
      productAPi.createProductTypes(data),
    onSuccess: () => {
      toast.success('Категория успешно создана');
      queryClient.invalidateQueries({ queryKey: productKeys.productTypes() });
    },
    onError: (error) => {
      toast.error('Ошибка при создании категории');
      console.error('Create product type error:', error);
    }
  });
};

/**
 * Хук для обновления категории продукта
 */
export const useUpdateProductType = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IProductTypeRequest) =>
      productAPi.updateProductTypes(id, data),
    onSuccess: () => {
      toast.success('Категория успешно обновлена');
      queryClient.invalidateQueries({ queryKey: productKeys.productTypes() });
    },
    onError: (error) => {
      toast.error('Ошибка при обновлении категории');
      console.error(`Update product type error (ID: ${id}):`, error);
    }
  });
};

/**
 * Хук для удаления категории продукта
 */
export const useDeleteProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productAPi.deleteProductTypes(id),
    onSuccess: () => {
      toast.success('Категория успешно удалена');
      queryClient.invalidateQueries({ queryKey: productKeys.productTypes() });
    },
    onError: (error) => {
      toast.error('Ошибка при удалении категории');
      console.error('Delete product type error:', error);
    }
  });
};

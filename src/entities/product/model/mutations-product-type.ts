import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { productAPi } from './api';
import { productKeys } from './query-keys';

import type { IProductTypeRequest } from './types';

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
    onError: () => {
      toast.error('Ошибка при создании категории');
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
    onError: () => {
      toast.error('Ошибка при обновлении категории');
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
    onError: () => {
      toast.error('Ошибка при удалении категории');
    }
  });
};

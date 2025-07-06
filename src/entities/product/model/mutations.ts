import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPi } from './api';
import { ICreateProductDto, IUpdateProductDto } from './types';
import { productKeys } from './query-keys';
import { toast } from 'sonner';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateProductDto) => productAPi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateProductDto }) =>
      productAPi.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Продукт успешно обновлен');
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
    },
    onError: () => {
      toast.error('При обновлении продукта произошла ошибка');
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productAPi.deleteProduct(id),
    onSuccess: () => {
      toast.success('Продукт успешно удален');
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
    },
    onError: () => {
      toast.error('При удалении продукта произошла ошибка');
    }
  });
};

// Image

export const useAttachProductImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, files }: { id: number; files: File[] }) =>
      productAPi.attachFiles(id, files),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
    }
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPi } from './api';
import { ICreateProductDto, IUpdateProductDto } from './types';
import { productKeys } from './query-keys';

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
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      queryClient.invalidateQueries({ queryKey: productKeys.byId(id) });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productAPi.deleteProduct(id),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
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
      queryClient.invalidateQueries({ queryKey: productKeys.byId(id) });
    }
  });
};

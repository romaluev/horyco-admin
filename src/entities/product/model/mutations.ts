/**
 * Product Mutation Hooks
 * React Query mutations for product operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { productApi } from './api';
import { productKeys } from './query-keys';

import type {
  ICreateProductDto,
  IUpdateProductDto,
  IUpdateProductPriceDto,
  IUpdateProductAvailabilityDto,
  ICreateProductTypeDto,
  IUpdateProductTypeDto
} from './types';

/**
 * Create product mutation
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateProductDto) => productApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      toast.success('Продукт успешно создан');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании продукта');
      console.error('Create product error:', error);
    }
  });
};

/**
 * Update product mutation
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateProductDto }) =>
      productApi.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      toast.success('Продукт успешно обновлен');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении продукта');
      console.error('Update product error:', error);
    }
  });
};

/**
 * Quick update product price mutation
 */
export const useUpdateProductPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateProductPriceDto }) =>
      productApi.updateProductPrice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      toast.success('Цена обновлена');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении цены');
      console.error('Update price error:', error);
    }
  });
};

/**
 * Quick update product availability mutation
 */
export const useUpdateProductAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number;
      data: IUpdateProductAvailabilityDto;
    }) => productApi.updateProductAvailability(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      toast.success('Доступность обновлена');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении доступности');
      console.error('Update availability error:', error);
    }
  });
};

/**
 * Delete product mutation
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      toast.success('Продукт успешно удален');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении продукта');
      console.error('Delete product error:', error);
    }
  });
};

// ===== Product Type Mutations =====

/**
 * Create product type mutation
 */
export const useCreateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateProductTypeDto) =>
      productApi.createProductType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.productTypes.all()
      });
      toast.success('Тип продукта успешно создан');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при создании типа продукта');
      console.error('Create product type error:', error);
    }
  });
};

/**
 * Update product type mutation
 */
export const useUpdateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateProductTypeDto }) =>
      productApi.updateProductType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.productTypes.all()
      });
      toast.success('Тип продукта успешно обновлен');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при обновлении типа продукта');
      console.error('Update product type error:', error);
    }
  });
};

/**
 * Delete product type mutation
 */
export const useDeleteProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.deleteProductType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.productTypes.all()
      });
      toast.success('Тип продукта успешно удален');
    },
    onError: (error: Error) => {
      toast.error('Ошибка при удалении типа продукта');
      console.error('Delete product type error:', error);
    }
  });
};


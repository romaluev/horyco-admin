import { useQuery } from '@tanstack/react-query';


import { productAPi } from './api';
import { productKeys } from './query-keys';

import type { ApiParams } from '@/shared/types';

export const useGetAllProducts = (params?: ApiParams) => {
  return useQuery({
    queryKey: [...productKeys.all(), JSON.stringify(params)],
    queryFn: () => productAPi.getProducts(params)
  });
};

export const useGetProductById = (id: number) => {
  return useQuery({
    queryKey: productKeys.byId(id),
    queryFn: () => productAPi.getProductById(id),
    enabled: Number.isFinite(id) && id > 0
  });
};

export const useGetAllProductTypes = () => {
  return useQuery({
    queryKey: productKeys.productTypes(),
    queryFn: () => productAPi.getAllProductTypes()
  });
};

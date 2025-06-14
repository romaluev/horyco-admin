import { useQuery } from '@tanstack/react-query';
import { productAPi } from './api';
import { productKeys } from './query-keys';

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: productKeys.all(),
    queryFn: () => productAPi.getProducts()
  });
};

export const useGetProductById = (id: number) => {
  return useQuery({
    queryKey: productKeys.byId(id),
    queryFn: () => productAPi.getProductById(id)
  });
};

export const useGetAllProductTypes = () => {
  return useQuery({
    queryKey: productKeys.productTypes(),
    queryFn: () => productAPi.getAllProductTypes()
  });
};

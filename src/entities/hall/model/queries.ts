import { useQuery } from '@tanstack/react-query';
import { hallApi } from './api';
import { hallKeys } from './query-keys';

/**
 * Хук для получения всех залов
 */
export const useGetAllHalls = () => {
  return useQuery({
    queryKey: hallKeys.lists(),
    queryFn: () => hallApi.getAllHalls()
  });
};

/**
 * Хук для получения зала по ID
 */
export const useGetHallById = (id: number) => {
  return useQuery({
    queryKey: hallKeys.detail(id),
    queryFn: () => hallApi.getHallById(id),
    enabled: !!id
  });
};

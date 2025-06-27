import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hallApi } from './api';
import { hallKeys } from './query-keys';
import { IHallRequest } from './types';
import { toast } from 'sonner';

/**
 * Хук для создания нового зала
 */
export const useCreateHall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IHallRequest) => hallApi.createHall(data),
    onSuccess: () => {
      toast.success('Зал успешно создан');
      queryClient.invalidateQueries({ queryKey: hallKeys.lists() });
    },
    onError: (error) => {
      toast.error('Ошибка при создании зала');
      console.error('Create hall error:', error);
    }
  });
};

/**
 * Хук для обновления зала
 */
export const useUpdateHall = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IHallRequest) => hallApi.updateHall(id, data),
    onSuccess: () => {
      toast.success('Зал успешно обновлен');
      queryClient.invalidateQueries({ queryKey: hallKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hallKeys.detail(Number(id)) });
    },
    onError: (error) => {
      toast.error('Ошибка при обновлении зала');
      console.error(`Update hall error (ID: ${id}):`, error);
    }
  });
};

/**
 * Хук для удаления зала
 */
export const useDeleteHall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hallApi.deleteHall(id),
    onSuccess: () => {
      toast.success('Зал успешно удален');
      queryClient.invalidateQueries({ queryKey: hallKeys.lists() });
    },
    onError: (error) => {
      toast.error('Ошибка при удалении зала');
      console.error('Delete hall error:', error);
    }
  });
};

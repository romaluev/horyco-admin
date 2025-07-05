import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeAPi } from './api';
import { IEmployeeDto } from './types';
import { queryKeys } from './query-keys';
import { toast } from 'sonner';

export const useCreateEmployer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IEmployeeDto) => employeeAPi.createEmployee(data),
    onSuccess: () => {
      toast.success('Сотрудник успешно создан');
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
    },
    onError: () => {
      toast.error('При создании сотрудника произошла ошибка');
    }
  });
};

export const useUpdateEmployer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IEmployeeDto }) =>
      employeeAPi.updateEmployee(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.byId(id) });
      toast.success('Сотрудник успешно обновлен');
    },
    onError: () => {
      toast.error('При обновлении сотрудника произошла ошибка');
    }
  });
};

export const useDeleteEmployer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => employeeAPi.deleteEmployer(id),
    onSuccess: (_) => {
      toast.success('Сотрудник успешно удален');
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
    },
    onError: () => {
      toast.error('При удалении сотрудника произошла ошибка');
    }
  });
};

// export const useAttachEmployerAvatar = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, files }: { id: number; files: File[] }) =>
//       employeeAPi.attachAvatar(id, files),
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.all() });
//       queryClient.invalidateQueries({ queryKey: queryKeys.byId(id) });
//     }
//   });
// };

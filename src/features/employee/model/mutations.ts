import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryKeys } from '@/entities/employee';

import { employeeAPi } from './api';

import type { IEmployeeDto} from '@/entities/employee';

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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeAPi } from './api';
import { IEmployeeDto } from './types';
import { queryKeys } from './query-keys';

export const useCreateEmployer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IEmployeeDto) => employeeAPi.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
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
    }
  });
};

export const useDeleteEmployer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => employeeAPi.deleteEmployer(id),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
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

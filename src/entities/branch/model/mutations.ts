import { useMutation, useQueryClient } from '@tanstack/react-query';
import { branchApi } from './api';
import { ICreateBranchDto, IUpdateBranchDto } from './types';
import { queryKeys } from './query-keys';

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateBranchDto) => branchApi.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
    }
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateBranchDto }) =>
      branchApi.updateBranch(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.byId(id) });
    }
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => branchApi.deleteBranch(id),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
    }
  });
};

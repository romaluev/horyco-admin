import { useQuery } from '@tanstack/react-query';
import { branchApi } from './api';
import { queryKeys } from './query-keys';

export const useGetAllBranches = () => {
  return useQuery({
    queryKey: queryKeys.all(),
    queryFn: () => branchApi.getBranches()
  });
};

export const useGetBranchById = (id: number) => {
  return useQuery({
    queryKey: queryKeys.byId(id),
    queryFn: () => branchApi.getBranchById(id),
    enabled: Number.isFinite(id) && id > 0
  });
};

import { useQuery } from '@tanstack/react-query';


import { employeeAPi } from './api';
import { queryKeys } from './query-keys';

import type { ApiParams } from '@/shared/types';

export const useGetAllEmployee = (params: ApiParams) => {
  return useQuery({
    queryKey: [...queryKeys.all(), params],
    queryFn: () => employeeAPi.getEmployee(params)
  });
};

export const useGetEmployerById = (id: number) => {
  return useQuery({
    queryKey: queryKeys.byId(id),
    queryFn: () => employeeAPi.getEmployerById(id),
    enabled: Number.isFinite(id) && id > 0
  });
};

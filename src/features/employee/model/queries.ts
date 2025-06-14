import { useQuery } from '@tanstack/react-query';
import { employeeAPi } from './api';
import { queryKeys } from './query-keys';

export const useGetAllEmployee = () => {
  return useQuery({
    queryKey: queryKeys.all(),
    queryFn: () => employeeAPi.getEmployee()
  });
};

export const useGetEmployerById = (id: number) => {
  return useQuery({
    queryKey: queryKeys.byId(id),
    queryFn: () => employeeAPi.getEmployerById(id)
  });
};

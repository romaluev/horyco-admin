'use client';

import { EmployeeTable } from './employee-tables';
import { columns } from './employee-tables/columns';
import { useEffect } from 'react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEmployeeStore } from '../model';

export default function EmployeeList() {
  const { employee, totalItems, fetchEmployee } = useEmployeeStore();

  const [page] = useQueryState('page', parseAsInteger.withDefault(0));
  const [search] = useQueryState('name', parseAsString);
  const [pageLimit] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [address] = useQueryState('address', parseAsString);

  useEffect(() => {
    const loadEmployee = async () => {
      const filters = {
        page: page || 0,
        size: pageLimit || 10
      };

      const filteringParams = [];
      if (search) {
        filteringParams.push({ field: 'name', value: search });
      }
      if (address) {
        filteringParams.push({ field: 'address', value: address });
      }

      const sortingParams = {
        field: 'createdAt',
        order: 'DESC' as const
      };

      await fetchEmployee(
        filters,
        sortingParams,
        filteringParams.length > 0 ? filteringParams : undefined
      );
    };

    loadEmployee();
  }, [page, search, pageLimit, address, fetchEmployee]);

  return (
    <EmployeeTable data={employee} totalItems={totalItems} columns={columns} />
  );
}

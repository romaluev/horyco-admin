'use client';

import { BranchTable } from './branch-tables';
import { columns } from './branch-tables/columns';
import { useEffect } from 'react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useBranchStore } from '@/features/branch/model';

export default function BranchListingPage() {
  const { branches, totalItems, fetchBranches } = useBranchStore();

  const [page] = useQueryState('page', parseAsInteger.withDefault(0));
  const [search] = useQueryState('name', parseAsString);
  const [pageLimit] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [address] = useQueryState('address', parseAsString);

  useEffect(() => {
    const loadBranches = async () => {
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

      await fetchBranches(
        filters,
        sortingParams,
        filteringParams.length > 0 ? filteringParams : undefined
      );
    };

    loadBranches();
  }, [page, search, pageLimit, address, fetchBranches]);

  return (
    <BranchTable data={branches} totalItems={totalItems} columns={columns} />
  );
}

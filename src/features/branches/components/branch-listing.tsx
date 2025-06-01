'use client';

import { Branch } from '@/api/branches/types';
import { BranchTable } from './branch-tables';
import { columns } from './branch-tables/columns';
import { useEffect } from 'react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useBranchesStore } from '../store/branches-store';

export default function BranchListingPage() {
  // Get state and actions from the branches store
  const { branches, totalItems, isLoading, fetchBranches } = useBranchesStore();

  // Use query state hooks for pagination and filtering
  const [page] = useQueryState('page', parseAsInteger.withDefault(0));
  const [search] = useQueryState('name', parseAsString);
  const [pageLimit] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [address] = useQueryState('address', parseAsString);

  // Fetch branches from the store
  useEffect(() => {
    const loadBranches = async () => {
      // Prepare pagination params
      const filters = {
        page: page || 0,
        size: pageLimit || 10
      };

      // Add filtering params
      const filteringParams = [];
      if (search) {
        filteringParams.push({ field: 'name', value: search });
      }
      if (address) {
        filteringParams.push({ field: 'address', value: address });
      }

      // Add sorting params
      const sortingParams = {
        field: 'createdAt',
        order: 'DESC' as const
      };

      // Fetch branches using the store action
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

'use client';

import { BranchTable } from './branch-tables';
import { columns } from './branch-tables/columns';
import { useGetAllBranches } from '../model';

export default function BranchListingPage() {
  const { data: branches } = useGetAllBranches();

  return (
    <BranchTable
      data={branches?.items || []}
      totalItems={branches?.totalItems || 0}
      columns={columns}
    />
  );
}

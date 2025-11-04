'use client'

import { parseAsInteger, useQueryState } from 'nuqs'

import { BranchTable } from './branch-tables'
import { useGetAllBranches } from '../model'
import { columns } from './branch-tables/columns'

export default function BranchListingPage() {
  const [size] = useQueryState('perPage', parseAsInteger.withDefault(10))
  const [page] = useQueryState('page', parseAsInteger.withDefault(0))

  const { data: branches } = useGetAllBranches({ size, page })

  return (
    <BranchTable
      data={branches?.items || []}
      totalItems={branches?.totalItems || 0}
      columns={columns}
    />
  )
}

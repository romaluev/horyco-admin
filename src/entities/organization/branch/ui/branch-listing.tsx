'use client'

import { useSearch } from '@tanstack/react-router'

import BaseLoading from '@/shared/ui/base-loading'

import { BranchTable } from './branch-tables'
import { useGetAllBranches } from '../model'
import { columns } from './branch-tables/columns'

export default function BranchListingPage() {
  const search = useSearch({ strict: false }) as { perPage?: number; page?: number }
  const size = search.perPage ?? 10
  const page = search.page ?? 1

  // API uses 0-indexed pages
  const { data: branches, isLoading, error } = useGetAllBranches({ size, page: page - 1 })

  if (isLoading) {
    return <BaseLoading />
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Ошибка загрузки: {error.message}
      </div>
    )
  }

  if (!branches || !branches.items || branches.items.length === 0) {
    return (
      <div className="p-4 text-muted-foreground">
        Филиалы не найдены. Создайте первый филиал.
      </div>
    )
  }

  return (
    <BranchTable
      data={branches.items}
      totalItems={branches.totalItems}
      columns={columns}
    />
  )
}

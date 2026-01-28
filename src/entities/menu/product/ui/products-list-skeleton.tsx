/**
 * Products List Skeleton Loader
 * Shows loading skeleton for both table and grid views
 */

import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

interface ProductsListSkeletonProps {
  viewMode: 'table' | 'grid'
}

export const ProductsListSkeleton = ({ viewMode }: ProductsListSkeletonProps) => {
  if (viewMode === 'table') {
    return (
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-2">Фото</TableHead>
              <TableHead className="px-2">Название</TableHead>
              <TableHead className="px-2">Категория</TableHead>
              <TableHead className="px-2">Цена</TableHead>
              <TableHead className="px-2">Доступность</TableHead>
              <TableHead className="px-2">Время</TableHead>
              <TableHead className="px-2">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="px-2">
                  <Skeleton className="h-10 w-10 rounded" />
                </TableCell>
                <TableCell className="px-2">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="px-2">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="px-2">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="px-2">
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell className="px-2">
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell className="px-2">
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Grid skeleton
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1 h-3 w-24" />
            </div>
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-1 h-3 w-20" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-lg border px-4 py-3">
        <Skeleton className="h-4 w-12" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}

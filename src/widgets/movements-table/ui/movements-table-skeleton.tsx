'use client'

import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

export const MovementsTableSkeleton = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата/Время</TableHead>
            <TableHead>Товар</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead className="text-right">Кол-во</TableHead>
            <TableHead className="text-right">Себест.</TableHead>
            <TableHead className="text-right">Остаток</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

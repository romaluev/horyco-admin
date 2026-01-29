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

export const StockTableSkeleton = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Товар</TableHead>
            <TableHead className="text-right">Доступно</TableHead>
            <TableHead className="text-right">Резерв</TableHead>
            <TableHead className="text-right">Ср. себест.</TableHead>
            <TableHead className="text-right">Общая стоим.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

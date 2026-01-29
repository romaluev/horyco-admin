'use client'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import { EmptyMovementsState } from './empty-movements-state'
import { MovementRow } from './movement-row'
import { MovementsTableSkeleton } from './movements-table-skeleton'

import type { IStockMovement } from '@/entities/inventory/stock-movement'

interface IMovementsTableProps {
  isLoading: boolean
  warehouseId: number | undefined
  movements: IStockMovement[]
  expandedId: number | null
  onToggleExpanded: (id: number | null) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export const MovementsTable = ({
  isLoading,
  warehouseId,
  movements,
  expandedId,
  onToggleExpanded,
  hasActiveFilters,
  onClearFilters,
}: IMovementsTableProps) => {
  if (isLoading) return <MovementsTableSkeleton />

  if (!warehouseId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <p className="text-muted-foreground">
          Выберите склад для просмотра движений
        </p>
      </div>
    )
  }

  if (movements.length === 0) {
    return (
      <EmptyMovementsState
        onClearFilters={hasActiveFilters ? onClearFilters : undefined}
      />
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]" />
            <TableHead>Дата/Время</TableHead>
            <TableHead>Товар</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead className="text-right">Кол-во</TableHead>
            <TableHead className="text-right">Стоимость</TableHead>
            <TableHead className="text-right">Остаток</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <MovementRow
              key={movement.id}
              movement={movement}
              isExpanded={expandedId === movement.id}
              onToggle={() =>
                onToggleExpanded(
                  expandedId === movement.id ? null : movement.id
                )
              }
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

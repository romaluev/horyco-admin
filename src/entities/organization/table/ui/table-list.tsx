import { TableCard } from './table-card'
import { useTableList } from '../model/queries'

import type { ITable } from '../model/types'

interface ITableListProps {
  hallId: number
  onEdit?: (table: ITable) => void
  onViewSession?: (table: ITable) => void
  onShowQR?: (table: ITable) => void
}

export const TableList = ({
  hallId,
  onEdit,
  onViewSession,
  onShowQR,
}: ITableListProps) => {
  const { data: tables, isLoading } = useTableList(hallId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading tables...</p>
      </div>
    )
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">
          No tables found. Create your first table.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onEdit={onEdit}
          onViewSession={onViewSession}
          onShowQR={onShowQR}
        />
      ))}
    </div>
  )
}

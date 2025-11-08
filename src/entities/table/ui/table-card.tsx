import { IconUsers, IconQrcode } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import { TableStatusBadge } from './table-status-badge'

import type { ITable } from '../model/types'

interface ITableCardProps {
  table: ITable
  onEdit?: (table: ITable) => void
  onDelete?: (table: ITable) => void
  onViewSession?: (table: ITable) => void
  onShowQR?: (table: ITable) => void
}

export const TableCard = ({
  table,
  onEdit,
  onDelete,
  onViewSession,
  onShowQR,
}: ITableCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>Table {table.number}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <IconUsers className="h-4 w-4" />
              <span>{table.capacity} seats</span>
            </div>
          </div>
          <TableStatusBadge status={table.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {table.hallName && (
          <p className="text-sm text-muted-foreground">Hall: {table.hallName}</p>
        )}
        {table.hasActiveSession && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onViewSession?.(table)}
          >
            View Session
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {onShowQR && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowQR(table)}
          >
            <IconQrcode className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(table)}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(table)}
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

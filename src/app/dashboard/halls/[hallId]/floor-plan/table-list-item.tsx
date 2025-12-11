'use client'

import { IconEdit, IconTrash } from '@tabler/icons-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'

import type { ITable } from '@/entities/table'

interface ITableListItemProps {
  table: ITable
  isSelected: boolean
  onSelect: (table: ITable) => void
  onEdit: (table: ITable) => void
  onDelete: (table: ITable) => void
}

export const TableListItem = ({
  table,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: ITableListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'OCCUPIED':
        return 'bg-red-100 text-red-800'
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const hasPosition = table.xPosition !== null && table.yPosition !== null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(table)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(table)}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer rounded-lg border p-3 transition-all hover:border-blue-300 hover:shadow-sm',
        isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'bg-white'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">Стол {table.number}</h4>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                getStatusColor(table.status)
              )}
            >
              {table.status.toLowerCase()}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span>Вместимость: {table.capacity}</span>
            <span>Форма: {table.shape}</span>
          </div>
          {!hasPosition && (
            <div className="mt-1 text-xs text-yellow-600">
              ⚠️ Позиция не установлена
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(table)
            }}
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(table)
            }}
          >
            <IconTrash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'


import { MOVEMENT_TYPE_LABELS, type MovementType } from '@/shared/types/inventory'
import { DateRangePicker } from '@/shared/ui/base/date-range-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { ItemSelector } from '@/entities/inventory-item'

import type { DateRange } from 'react-day-picker'

interface IMovementsFiltersProps {
  warehouseId: number | undefined
  onWarehouseChange: (id: number | undefined) => void
  warehouses: { id: number; name: string }[]
  itemId: number | undefined
  onItemChange: (id: number | undefined) => void
  movementType: MovementType | ''
  onMovementTypeChange: (type: MovementType | '') => void
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
}

export const MovementsFilters = ({
  warehouseId,
  onWarehouseChange,
  warehouses,
  itemId,
  onItemChange,
  movementType,
  onMovementTypeChange,
  dateRange,
  onDateRangeChange,
}: IMovementsFiltersProps) => (
  <div className="flex flex-wrap items-center gap-4">
    <Select
      value={warehouseId ? String(warehouseId) : 'all'}
      onValueChange={(v) => onWarehouseChange(v === 'all' ? undefined : Number(v))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Все склады" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все склады</SelectItem>
        {warehouses.map((w) => (
          <SelectItem key={w.id} value={String(w.id)}>
            {w.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <div className="w-[220px]">
      <ItemSelector value={itemId} onChange={onItemChange} placeholder="Все товары" />
    </div>

    <Select
      value={movementType || 'all'}
      onValueChange={(v) => onMovementTypeChange(v === 'all' ? '' : (v as MovementType))}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Все типы операций" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все типы операций</SelectItem>
        {Object.entries(MOVEMENT_TYPE_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <DateRangePicker value={dateRange} onChange={onDateRangeChange} placeholder="Период" />
  </div>
)

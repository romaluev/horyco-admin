/**
 * Warehouse Selector Component
 * Dropdown for selecting a warehouse
 */

'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useGetWarehouses } from '../model/queries'

interface WarehouseSelectorProps {
  value?: number
  onChange: (value: number | undefined) => void
  placeholder?: string
  disabled?: boolean
  showAll?: boolean
}

export const WarehouseSelector = ({
  value,
  onChange,
  placeholder = 'Выберите склад',
  disabled = false,
  showAll = false,
}: WarehouseSelectorProps) => {
  const { data: warehouses = [], isLoading } = useGetWarehouses({
    isActive: true,
  })

  const handleChange = (val: string) => {
    if (val === 'all') {
      onChange(undefined)
    } else {
      onChange(Number(val))
    }
  }

  return (
    <Select
      value={value?.toString() ?? (showAll ? 'all' : '')}
      onValueChange={handleChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && <SelectItem value="all">Все склады</SelectItem>}
        {warehouses.map((warehouse) => (
          <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
            {warehouse.name}
            {warehouse.code && (
              <span className="text-muted-foreground ml-2">
                ({warehouse.code})
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

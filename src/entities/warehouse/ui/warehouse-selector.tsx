'use client'

import { useMemo } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useGetWarehouses } from '../model/queries'

interface WarehouseSelectorProps {
  value?: number | null
  onValueChange?: (value: number) => void
  onChange?: (value: number | null) => void
  branchId?: number
  placeholder?: string
  disabled?: boolean
  showAll?: boolean
  allowClear?: boolean
  className?: string
}

export function WarehouseSelector({
  value,
  onValueChange,
  onChange,
  branchId,
  placeholder = 'Выберите склад',
  disabled = false,
  showAll = false,
  allowClear = false,
  className,
}: WarehouseSelectorProps) {
  const { data, isLoading } = useGetWarehouses(
    { branchId, isActive: true },
    { enabled: !!branchId }
  )

  // Filter warehouses by branchId client-side (backend may not filter properly)
  const warehouses = useMemo(() => {
    if (!data) return []
    if (!branchId) return data
    return data.filter(w => w.branchId === branchId)
  }, [data, branchId])

  const handleChange = (val: string) => {
    const numValue = val === '' || val === '0' ? null : Number(val)
    if (onValueChange && numValue !== null) {
      onValueChange(numValue)
    }
    if (onChange) {
      onChange(numValue)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-9 w-full" />
  }

  return (
    <Select
      value={value?.toString() || ''}
      onValueChange={handleChange}
      disabled={disabled || warehouses.length === 0}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {(showAll || allowClear) && (
          <SelectItem value="0">Все склады</SelectItem>
        )}
        {warehouses.map((warehouse) => (
          <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
            {warehouse.name}
            {warehouse.isDefault && ' (основной)'}
          </SelectItem>
        ))}
        {warehouses.length === 0 && (
          <SelectItem value="__no_warehouses__" disabled>
            Нет доступных складов
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}

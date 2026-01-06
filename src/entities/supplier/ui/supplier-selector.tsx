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

import { useGetSuppliers } from '../model/queries'
import type { ISupplier } from '../model/types'

interface SupplierSelectorProps {
  value?: number
  onValueChange: (value: number, supplier?: ISupplier) => void
  placeholder?: string
  disabled?: boolean
  onlyActive?: boolean
  className?: string
}

export function SupplierSelector({
  value,
  onValueChange,
  placeholder = 'Выберите поставщика',
  disabled = false,
  onlyActive = true,
  className,
}: SupplierSelectorProps) {
  const { data, isLoading } = useGetSuppliers({
    isActive: onlyActive ? true : undefined,
    limit: 100,
  })

  const suppliers = useMemo(() => data ?? [], [data])

  const selectedSupplier = useMemo(
    () => suppliers.find((s: ISupplier) => s.id === value),
    [suppliers, value]
  )

  if (isLoading) {
    return <Skeleton className="h-9 w-full" />
  }

  return (
    <Select
      value={value?.toString()}
      onValueChange={(val) => {
        const id = Number(val)
        const supplier = suppliers.find((s: ISupplier) => s.id === id)
        onValueChange(id, supplier)
      }}
      disabled={disabled || suppliers.length === 0}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedSupplier?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {suppliers.map((supplier: ISupplier) => (
          <SelectItem key={supplier.id} value={supplier.id.toString()}>
            {supplier.name}
            {supplier.code && (
              <span className="ml-2 text-muted-foreground">
                ({supplier.code})
              </span>
            )}
          </SelectItem>
        ))}
        {suppliers.length === 0 && (
          <SelectItem value="__no_suppliers__" disabled>
            Нет доступных поставщиков
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}

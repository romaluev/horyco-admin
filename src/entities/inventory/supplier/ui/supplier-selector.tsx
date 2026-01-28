'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useGetSuppliers } from '../model/queries'

interface ISupplierSelectorProps {
  value?: number
  onChange: (value: number | undefined) => void
  placeholder?: string
  disabled?: boolean
  showAll?: boolean
}

export function SupplierSelector({
  value,
  onChange,
  placeholder = 'Выберите поставщика',
  disabled = false,
  showAll = false,
}: ISupplierSelectorProps) {
  const { data: suppliers, isLoading } = useGetSuppliers({ isActive: true })

  return (
    <Select
      value={value ? String(value) : showAll ? 'all' : undefined}
      onValueChange={(val) => onChange(val === 'all' ? undefined : Number(val))}
      disabled={disabled || isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? 'Загрузка...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && <SelectItem value="all">Все поставщики</SelectItem>}
        {suppliers?.map((supplier) => (
          <SelectItem key={supplier.id} value={String(supplier.id)}>
            {supplier.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

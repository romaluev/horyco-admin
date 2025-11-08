'use client'

import * as React from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useGetAllBranches, type IBranch } from '@/entities/branch'
import { IconHierarchy } from '@tabler/icons-react'

interface BranchSelectorProps {
  value?: number
  onChange?: (branchId: number | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export const BranchSelector = ({
  value,
  onChange,
  placeholder = 'Выберите филиал',
  disabled = false,
}: BranchSelectorProps) => {
  const { data: branchesData, isLoading } = useGetAllBranches()
  const branches = branchesData?.items || []

  const handleValueChange = (val: string) => {
    if (val === 'all') {
      onChange?.(undefined)
    } else {
      onChange?.(Number(val))
    }
  }

  const selectedValue = value === undefined ? 'all' : String(value)

  return (
    <div className='flex items-center gap-1.5'>
      <IconHierarchy />
      <Select
        value={selectedValue}
        onValueChange={handleValueChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch: IBranch) => (
            <SelectItem key={branch.id} value={String(branch.id)}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

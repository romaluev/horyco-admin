'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useGetAllBranches } from '@/entities/organization/branch'

interface IDashboardBranchSelectorProps {
  selectedBranchId: number | undefined
  onBranchChange: (branchId: number | undefined) => void
}

export function DashboardBranchSelector({
  selectedBranchId,
  onBranchChange,
}: IDashboardBranchSelectorProps) {
  const { data: branchesData, isLoading } = useGetAllBranches({
    page: 0,
    size: 200,
  })
  const branches = branchesData?.items ?? []

  const value = selectedBranchId !== undefined ? String(selectedBranchId) : 'all'

  const handleValueChange = (val: string) => {
    if (val === 'all') {
      onBranchChange(undefined)
      return
    }

    const branchId = Number(val)
    if (Number.isFinite(branchId)) {
      onBranchChange(branchId)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Филиал:</span>
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger className="min-w-[200px]" size="sm">
          <SelectValue placeholder="Все филиалы" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все филиалы</SelectItem>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={String(branch.id)}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

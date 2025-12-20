'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useGetAllBranches } from '@/entities/branch'

import type { AnalyticsScopeType } from '@/entities/analytics'

interface IBranchSelectorProps {
  scope: AnalyticsScopeType
  onScopeChange: (scope: AnalyticsScopeType) => void
  currentBranchId: number | null
  selectedBranchId: number | null | undefined
  onSelectedBranchIdChange: (branchId: number | null | undefined) => void
}

export const BranchSelector = ({
  scope,
  onScopeChange,
  currentBranchId,
  selectedBranchId,
  onSelectedBranchIdChange,
}: IBranchSelectorProps) => {
  const { data: branchesData, isLoading } = useGetAllBranches({
    page: 0,
    size: 200,
  })
  const branches = branchesData?.items ?? []

  const isAllBranches = scope === 'all_branches'

  const value = isAllBranches
    ? 'all'
    : selectedBranchId !== undefined && selectedBranchId !== null
      ? String(selectedBranchId)
      : currentBranchId
        ? String(currentBranchId)
        : undefined

  const handleValueChange = (val: string) => {
    if (val === 'all') {
      onScopeChange('all_branches')
      onSelectedBranchIdChange(null)
      return
    }

    const branchId = Number(val)
    if (!Number.isFinite(branchId)) return
    onScopeChange('branch')
    onSelectedBranchIdChange(branchId)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">Филиал:</span>
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger size="sm" className="min-w-[240px]">
          <SelectValue placeholder="Текущий филиал" />
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

/**
 * Branch Selector Component
 * Allows switching between single branch and all branches view
 */

'use client'

import { useGetAllBranches } from '@/entities/branch'
import { Button } from '@/shared/ui/base/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import type { AnalyticsScopeType } from '@/entities/analytics'

interface IBranchSelectorProps {
  scope: AnalyticsScopeType
  onScopeChange: (scope: AnalyticsScopeType) => void
  currentBranchId?: number
}

export const BranchSelector = ({
  scope,
  onScopeChange,
  currentBranchId,
}: IBranchSelectorProps) => {
  const { data: branchesData, isLoading } = useGetAllBranches()

  const branches = branchesData?.items || []
  const currentBranch = branches.find((b: { id: number }) => b.id === currentBranchId)

  const handleToggleAllBranches = () => {
    onScopeChange(scope === 'branch' ? 'all_branches' : 'branch')
  }

  if (isLoading) {
    return (
      <div className="h-9 w-48 animate-pulse rounded-md bg-muted"></div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {scope === 'branch' && currentBranch && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Branch:</span>
          <span className="text-sm font-medium">{currentBranch.name}</span>
        </div>
      )}

      {scope === 'all_branches' && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">All Branches</span>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleAllBranches}
        className="ml-2"
      >
        {scope === 'branch' ? '📊 View All Branches' : '🏢 Single Branch'}
      </Button>
    </div>
  )
}

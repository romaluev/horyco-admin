'use client'

import { Button } from '@/shared/ui/base/button'

import type { AnalyticsScopeType } from '@/entities/analytics'

interface IBranchSelectorProps {
  scope: AnalyticsScopeType
  onScopeChange: (scope: AnalyticsScopeType) => void
  currentBranchName: string | null
}

export const BranchSelector = ({
  scope,
  onScopeChange,
  currentBranchName,
}: IBranchSelectorProps) => {
  const isAllBranches = scope === 'all_branches'

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">Филиал:</span>
      <Button
        variant={isAllBranches ? 'default' : 'outline'}
        size="sm"
        onClick={() => onScopeChange(isAllBranches ? 'branch' : 'all_branches')}
        className="min-w-[200px]"
      >
        {isAllBranches ? 'Все филиалы' : currentBranchName || 'Текущий филиал'}
      </Button>
    </div>
  )
}

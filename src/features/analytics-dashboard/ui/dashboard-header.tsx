/**
 * Dashboard Header Component
 * Title, period selector, branch selector, and refresh button
 */

'use client'

import { IconRefresh } from '@tabler/icons-react'
import { Button } from '@/shared/ui/base/button'
import { PeriodSelector } from './period-selector'
import { BranchSelector } from './branch-selector'
import type {
  AnalyticsPeriodType,
  AnalyticsScopeType,
} from '@/entities/analytics'

interface IDashboardHeaderProps {
  period: AnalyticsPeriodType
  scope: AnalyticsScopeType
  startDate?: string
  endDate?: string
  currentBranchId?: number
  isRefreshing?: boolean
  onPeriodChange: (period: AnalyticsPeriodType) => void
  onCustomRangeChange: (startDate: string, endDate: string) => void
  onScopeChange: (scope: AnalyticsScopeType) => void
  onRefresh: () => void
}

export const DashboardHeader = ({
  period,
  scope,
  startDate,
  endDate,
  currentBranchId,
  isRefreshing = false,
  onPeriodChange,
  onCustomRangeChange,
  onScopeChange,
  onRefresh,
}: IDashboardHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          📊 Analytics Dashboard
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <IconRefresh
            className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <PeriodSelector
          value={period}
          onChange={onPeriodChange}
          onCustomRangeChange={onCustomRangeChange}
          startDate={startDate}
          endDate={endDate}
        />

        <div className="h-8 w-px bg-border" />

        <BranchSelector
          scope={scope}
          onScopeChange={onScopeChange}
          currentBranchId={currentBranchId}
        />
      </div>
    </div>
  )
}

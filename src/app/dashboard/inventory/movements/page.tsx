'use client'

import { useState, useMemo } from 'react'


import { format, subDays } from 'date-fns'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'


import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetMovements } from '@/entities/inventory/stock-movement'
import { useGetWarehouses } from '@/entities/inventory/warehouse'
import {
  MovementsFilters,
  MovementsSummary,
  MovementsTable,
} from '@/widgets/movements-table'

import type { MovementType } from '@/shared/types/inventory'
import type { DateRange } from 'react-day-picker'

const DEFAULT_DAYS_BACK = 30

export default function MovementsPage() {
  const { t } = useTranslation('inventory')
  const [warehouseId, setWarehouseId] = useState<number | undefined>()
  const [itemId, setItemId] = useState<number | undefined>()
  const [movementType, setMovementType] = useState<MovementType | ''>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), DEFAULT_DAYS_BACK),
    to: new Date(),
  })
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const { data: warehouses } = useGetWarehouses()
  const { data: movementsData, isLoading } = useGetMovements({
    warehouseId,
    itemId,
    type: movementType || undefined,
    dateFrom: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    dateTo: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
  })

  const movements = movementsData?.data ?? []

  const summary = useMemo(() => {
    const result = { purchases: 0, sales: 0, writeoffs: 0, adjustments: 0 }
    movements.forEach((m) => {
      const cost = Math.abs(m.totalCost)
      if (m.type === 'PURCHASE_RECEIVE') result.purchases += cost
      else if (m.type === 'SALE_DEDUCTION') result.sales += cost
      else if (m.type === 'WRITEOFF') result.writeoffs += cost
      else if (m.type === 'MANUAL_ADJUSTMENT' || m.type === 'COUNT_ADJUSTMENT') {
        result.adjustments += cost
      }
    })
    return result
  }, [movements])

  const handleClearFilters = () => {
    setItemId(undefined)
    setMovementType('')
    setDateRange({ from: subDays(new Date(), DEFAULT_DAYS_BACK), to: new Date() })
  }

  const hasActiveFilters = Boolean(itemId || movementType)

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={t('pages.movements.title')} description={t('pages.movements.description')} />
          <Button variant="outline" size="sm" disabled>
            <Download className="mr-2 h-4 w-4" />
            {t('pages.movements.export')}
          </Button>
        </div>
        <Separator />

        <MovementsFilters
          warehouseId={warehouseId}
          onWarehouseChange={setWarehouseId}
          warehouses={warehouses ?? []}
          itemId={itemId}
          onItemChange={setItemId}
          movementType={movementType}
          onMovementTypeChange={setMovementType}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {warehouseId && movements.length > 0 && (
          <MovementsSummary
            totalPurchases={summary.purchases}
            totalSales={summary.sales}
            totalWriteoffs={summary.writeoffs}
            totalAdjustments={summary.adjustments}
          />
        )}

        <MovementsTable
          isLoading={isLoading}
          warehouseId={warehouseId}
          movements={movements}
          expandedId={expandedId}
          onToggleExpanded={setExpandedId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {warehouseId && movements.length > 0 && movementsData?.meta && (
          <div className="text-right text-sm text-muted-foreground">
            {t('pages.movements.page')} {movementsData.meta.page} {t('pages.movements.of')} {movementsData.meta.totalPages} (всего{' '}
            {movementsData.meta.total} {t('pages.movements.records')})
          </div>
        )}
      </div>
    </PageContainer>
  )
}

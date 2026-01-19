'use client'

import { useState } from 'react'

import Link from 'next/link'

import { IconSearch, IconClipboardCheck } from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Separator } from '@/shared/ui/base/separator'
import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetInventoryCounts,
  CountStatusBadge,
  CountTypeBadge,
  COUNT_STATUS_LABELS,
  COUNT_TYPE_LABELS,
  type CountStatus,
  type CountType,
} from '@/entities/inventory-count'
import { WarehouseSelector } from '@/entities/warehouse'
import { CreateCountDialog } from '@/features/inventory-count-form'

export default function InventoryCountsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<CountStatus | ''>('')
  const [countType, setCountType] = useState<CountType | ''>('')
  const [warehouseId, setWarehouseId] = useState<number | undefined>()

  const { data: counts, isLoading } = useGetInventoryCounts({
    status: status || undefined,
    countType: countType || undefined,
    warehouseId,
  })

  // Filter by search
  const filteredCounts = counts?.filter((count) =>
    count.countNumber.toLowerCase().includes(search.toLowerCase())
  )

  const hasFilters = Boolean(search || status || countType || warehouseId)

  // Calculate variance percentage
  const getVariancePercent = (shortageValue: number, surplusValue: number, netValue: number) => {
    if (!netValue) return null
    // Use a simple calculation based on total variance values
    const totalExpected = Math.abs(shortageValue) + Math.abs(surplusValue) + Math.abs(netValue)
    if (totalExpected === 0) return 0
    return (netValue / totalExpected) * 100
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Инвентаризации"
            description="Учёт и сверка фактических остатков"
          />
          <CreateCountDialog />
        </div>
        <Separator />

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по номеру..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={status || 'all'}
            onValueChange={(val) => setStatus(val === 'all' ? '' : (val as CountStatus))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.entries(COUNT_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={countType || 'all'}
            onValueChange={(val) => setCountType(val === 'all' ? '' : (val as CountType))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все типы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              {Object.entries(COUNT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-[180px]">
            <WarehouseSelector
              value={warehouseId}
              onChange={setWarehouseId}
              showAll
              placeholder="Все склады"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !filteredCounts?.length ? (
          <EmptyCountsState hasFilters={hasFilters} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead className="text-right">Позиций</TableHead>
                  <TableHead className="text-right">Расхождение</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCounts.map((count) => {
                  const variancePercent = getVariancePercent(count.shortageValue, count.surplusValue, count.netAdjustmentValue)

                  return (
                    <TableRow key={count.id}>
                      <TableCell className="font-medium">{count.countNumber}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(count.countDate), 'd MMM', { locale: ru })}
                      </TableCell>
                      <TableCell>
                        <CountTypeBadge type={count.countType} />
                      </TableCell>
                      <TableCell className="text-right">
                        {count.itemsCounted}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-medium',
                          count.netAdjustmentValue < 0 && 'text-destructive',
                          count.netAdjustmentValue > 0 && 'text-emerald-600 dark:text-emerald-500',
                          count.netAdjustmentValue === 0 && 'text-muted-foreground'
                        )}
                      >
                        {variancePercent !== null
                          ? `${variancePercent >= 0 ? '+' : ''}${variancePercent.toFixed(1)}%`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <CountStatusBadge status={count.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/inventory/counts/${count.id}`}>
                            Открыть
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

const EmptyCountsState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
    <IconClipboardCheck className="h-12 w-12 text-muted-foreground/50" />
    <h3 className="mt-4 text-lg font-semibold">
      {hasFilters ? 'Инвентаризации не найдены' : 'Нет инвентаризаций'}
    </h3>
    <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
      {hasFilters
        ? 'Попробуйте изменить параметры поиска или фильтры.'
        : 'Проведите инвентаризацию для сверки фактических остатков.'}
    </p>
    {!hasFilters && (
      <div className="mt-6">
        <CreateCountDialog />
      </div>
    )}
  </div>
)

'use client'

import { useState, useMemo } from 'react'

import { Link } from '@tanstack/react-router'

import { IconSearch, IconTrash } from '@tabler/icons-react'
import { format, subDays } from 'date-fns'
import { ru } from 'date-fns/locale'

import { formatCurrency } from '@/shared/lib/format'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent } from '@/shared/ui/base/card'
import { DateRangePicker } from '@/shared/ui/base/date-range-picker'
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
  useGetWriteoffs,
  WriteoffStatusBadge,
  WriteoffReasonBadge,
  WRITEOFF_STATUS_LABELS,
  WRITEOFF_REASON_LABELS,
  type WriteoffStatus,
  type WriteoffReason,
} from '@/entities/inventory/writeoff'
import { CreateWriteoffDialog } from '@/features/inventory/writeoff-form'

import type { DateRange } from 'react-day-picker'

const DEFAULT_DAYS_BACK = 30

export default function WriteoffsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<WriteoffStatus | ''>('')
  const [reason, setReason] = useState<WriteoffReason | ''>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), DEFAULT_DAYS_BACK),
    to: new Date(),
  })

  const { data: writeoffs, isLoading } = useGetWriteoffs({
    status: status || undefined,
    reason: reason || undefined,
    from: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    to: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
  })

  // Filter by search
  const filteredWriteoffs = writeoffs?.filter((writeoff) =>
    writeoff.writeoffNumber.toLowerCase().includes(search.toLowerCase())
  )

  // Calculate summary
  const summary = useMemo(() => {
    if (!filteredWriteoffs) return { total: 0, pending: 0 }
    return filteredWriteoffs.reduce(
      (acc, wo) => {
        acc.total += wo.totalValue
        if (wo.status === 'pending') acc.pending += wo.totalValue
        return acc
      },
      { total: 0, pending: 0 }
    )
  }, [filteredWriteoffs])

  const hasFilters = Boolean(search || status || reason)

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Списания"
            description="Акты списания товаров со склада"
          />
          <CreateWriteoffDialog />
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
            onValueChange={(val) => setStatus(val === 'all' ? '' : (val as WriteoffStatus))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.entries(WRITEOFF_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={reason || 'all'}
            onValueChange={(val) => setReason(val === 'all' ? '' : (val as WriteoffReason))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все причины" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все причины</SelectItem>
              {Object.entries(WRITEOFF_REASON_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {/* Summary */}
        {filteredWriteoffs && filteredWriteoffs.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Всего списано</p>
                  <p className="text-xl font-bold">{formatCurrency(summary.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ожидают согласования</p>
                  <p className="text-xl font-bold text-yellow-600">{formatCurrency(summary.pending)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !filteredWriteoffs?.length ? (
          <EmptyWriteoffsState hasFilters={hasFilters} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Причина</TableHead>
                  <TableHead className="text-right">Позиций</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWriteoffs.map((writeoff) => (
                  <TableRow key={writeoff.id}>
                    <TableCell className="font-medium">{writeoff.writeoffNumber}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(writeoff.createdAt), 'd MMM', { locale: ru })}
                    </TableCell>
                    <TableCell>
                      <WriteoffReasonBadge reason={writeoff.reason} />
                    </TableCell>
                    <TableCell className="text-right">
                      {writeoff.itemCount ?? writeoff.items?.length ?? 0}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(writeoff.totalValue)}
                    </TableCell>
                    <TableCell>
                      <WriteoffStatusBadge status={writeoff.status} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dashboard/inventory/writeoffs/${writeoff.id}` as any}>
                          Открыть
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

const EmptyWriteoffsState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
    <IconTrash className="h-12 w-12 text-muted-foreground/50" />
    <h3 className="mt-4 text-lg font-semibold">
      {hasFilters ? 'Списания не найдены' : 'Нет списаний'}
    </h3>
    <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
      {hasFilters
        ? 'Попробуйте изменить параметры поиска или фильтры.'
        : 'Создайте акт списания для учёта убытков и потерь.'}
    </p>
    {!hasFilters && (
      <div className="mt-6">
        <CreateWriteoffDialog />
      </div>
    )}
  </div>
)

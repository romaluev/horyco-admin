'use client'

import { useState } from 'react'
import Link from 'next/link'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { formatCurrency } from '@/shared/lib/format'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import { Button } from '@/shared/ui/base/button'
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
import { CreateCountDialog } from '@/features/inventory-count-form'

export default function InventoryCountsPage() {
  const [status, setStatus] = useState<CountStatus | ''>('')
  const [countType, setCountType] = useState<CountType | ''>('')

  const { data: counts, isLoading } = useGetInventoryCounts({
    status: status || undefined,
    countType: countType || undefined,
  })

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

        <div className="flex flex-wrap gap-4">
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
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Склад</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Расхождение</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!counts?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Инвентаризации не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  counts.map((count) => (
                    <TableRow key={count.id}>
                      <TableCell className="font-medium">{count.countNumber}</TableCell>
                      <TableCell>{count.warehouseName}</TableCell>
                      <TableCell>
                        <CountTypeBadge type={count.countType} />
                      </TableCell>
                      <TableCell>
                        <CountStatusBadge status={count.status} />
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          count.netAdjustmentValue < 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-500'
                        }`}
                      >
                        {count.netAdjustmentValue >= 0 ? '+' : ''}
                        {formatCurrency(count.netAdjustmentValue)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(count.countDate), 'dd MMM yyyy', { locale: ru })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/inventory/counts/${count.id}`}>
                            Открыть
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

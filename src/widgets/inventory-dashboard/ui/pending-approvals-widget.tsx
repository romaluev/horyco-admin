'use client'

import { Link } from '@tanstack/react-router'

import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ClipboardCheck, FileWarning, Clock } from 'lucide-react'

import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'

import {
  useGetInventoryCounts,
  COUNT_TYPE_LABELS,
} from '@/entities/inventory/inventory-count'
import {
  useGetWriteoffs,
  WRITEOFF_REASON_LABELS,
} from '@/entities/inventory/writeoff'

interface IPendingApprovalsWidgetProps {
  warehouseId?: number
  size?: number
}

export function PendingApprovalsWidget({
  warehouseId,
  size = 5,
}: IPendingApprovalsWidgetProps) {
  const { data: pendingWriteoffs, isLoading: writeoffsLoading } =
    useGetWriteoffs({
      status: 'pending',
      warehouseId,
    })

  const { data: pendingCounts, isLoading: countsLoading } =
    useGetInventoryCounts({
      status: 'pending_approval',
      warehouseId,
    })

  const isLoading = writeoffsLoading || countsLoading

  const allPending = [
    ...(pendingWriteoffs?.slice(0, size) || []).map((w) => ({
      id: w.id,
      type: 'writeoff' as const,
      title: `Списание: ${WRITEOFF_REASON_LABELS[w.reason]}`,
      number: w.writeoffNumber,
      warehouse: w.warehouseName,
      value: w.totalValue,
      date: w.submittedAt || w.createdAt,
      href: `/dashboard/inventory/writeoffs/${w.id}`,
    })),
    ...(pendingCounts?.slice(0, size) || []).map((c) => ({
      id: c.id,
      type: 'count' as const,
      title: `Инвентаризация: ${COUNT_TYPE_LABELS[c.countType]}`,
      number: c.countNumber,
      warehouse: c.warehouseName,
      value: c.netAdjustmentValue,
      date: c.completedAt || c.countDate,
      href: `/dashboard/inventory/counts/${c.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, size)

  const totalPending =
    (pendingWriteoffs?.length || 0) + (pendingCounts?.length || 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-orange-600" />
            Ожидают согласования
            {totalPending > 0 && (
              <Badge variant="secondary" className="ml-1">
                {totalPending}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Списания и инвентаризации</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="max-h-[320px] overflow-auto">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : allPending.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            Нет документов на согласовании
          </p>
        ) : (
          <div className="space-y-3">
            {allPending.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                to={item.href}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {item.type === 'writeoff' ? (
                      <FileWarning className="h-4 w-4 text-red-500" />
                    ) : (
                      <ClipboardCheck className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="leading-none font-medium">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {item.number} • {item.warehouse}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={(item.value ?? 0) >= 0 ? 'outline' : 'destructive'}
                    className="mb-1"
                  >
                    {(item.value ?? 0).toLocaleString('ru-RU')} сум
                  </Badge>
                  <p className="text-muted-foreground flex items-center justify-end gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(item.date), {
                      addSuffix: true,
                      locale: ru,
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {totalPending > size && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link to={'/dashboard/inventory/writeoffs?status=pending' as any}>
                Показать все ({totalPending})
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

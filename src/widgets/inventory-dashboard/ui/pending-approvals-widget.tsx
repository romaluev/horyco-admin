'use client'

import Link from 'next/link'

import { IconClipboardCheck } from '@tabler/icons-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { Button } from '@/shared/ui/base/button'
import { Badge } from '@/shared/ui/base/badge'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { ScrollArea } from '@/shared/ui/base/scroll-area'

import { useGetPendingWriteoffs } from '@/entities/writeoff'
import { useGetPendingCounts } from '@/entities/inventory-count'

interface IPendingApprovalsWidgetProps {
  branchId: number
}

export const PendingApprovalsWidget = ({
  branchId,
}: IPendingApprovalsWidgetProps) => {
  const { data: pendingWriteoffs, isLoading: writeoffsLoading } =
    useGetPendingWriteoffs(branchId)
  const { data: pendingCounts, isLoading: countsLoading } =
    useGetPendingCounts(branchId)

  const isLoading = writeoffsLoading || countsLoading

  const writeoffCount = pendingWriteoffs?.length || 0
  const countCount = pendingCounts?.length || 0
  const totalPending = writeoffCount + countCount

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconClipboardCheck className="h-5 w-5 text-purple-500" />
          Ожидают утверждения
          {totalPending > 0 && (
            <Badge variant="secondary">{totalPending}</Badge>
          )}
        </CardTitle>
        <CardDescription>Списания и инвентаризации на рассмотрении</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : totalPending === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Нет документов на рассмотрении
          </p>
        ) : (
          <ScrollArea className="h-[150px]">
            <div className="space-y-3">
              {writeoffCount > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Списания</p>
                    <p className="text-xs text-muted-foreground">
                      {writeoffCount} документ(ов)
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/inventory/writeoffs?status=PENDING">
                      Просмотр
                    </Link>
                  </Button>
                </div>
              )}
              {countCount > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Инвентаризации</p>
                    <p className="text-xs text-muted-foreground">
                      {countCount} документ(ов)
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/inventory/counts?status=PENDING_APPROVAL">
                      Просмотр
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

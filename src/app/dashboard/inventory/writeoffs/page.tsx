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
  useGetWriteoffs,
  WriteoffStatusBadge,
  WriteoffReasonBadge,
  WRITEOFF_STATUS_LABELS,
  WRITEOFF_REASON_LABELS,
  type WriteoffStatus,
  type WriteoffReason,
} from '@/entities/writeoff'
import { CreateWriteoffDialog } from '@/features/writeoff-form'

export default function WriteoffsPage() {
  const [status, setStatus] = useState<WriteoffStatus | ''>('')
  const [reason, setReason] = useState<WriteoffReason | ''>('')

  const { data: writeoffs, isLoading } = useGetWriteoffs({
    status: status || undefined,
    reason: reason || undefined,
  })

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

        <div className="flex flex-wrap gap-4">
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
            <SelectTrigger className="w-[200px]">
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
                  <TableHead>Причина</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!writeoffs?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Списания не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  writeoffs.map((writeoff) => (
                    <TableRow key={writeoff.id}>
                      <TableCell className="font-medium">{writeoff.writeoffNumber}</TableCell>
                      <TableCell>{writeoff.warehouseName}</TableCell>
                      <TableCell>
                        <WriteoffReasonBadge reason={writeoff.reason} />
                      </TableCell>
                      <TableCell>
                        <WriteoffStatusBadge status={writeoff.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(writeoff.totalValue)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(writeoff.createdAt), 'dd MMM yyyy', { locale: ru })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/inventory/writeoffs/${writeoff.id}`}>
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

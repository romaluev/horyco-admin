'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ArrowLeft, CheckCircle, XCircle, Loader2, Plus } from 'lucide-react'

import {
  useInventoryCountById,
  useCountVarianceSummary,
  CountStatusBadge,
  CountTypeBadge,
} from '@/entities/inventory-count'
import {
  useUpdateCountItem,
  useCancelCount,
} from '@/entities/inventory-count/model/mutations'

import { formatCurrency } from '@/shared/lib/format'
import { Button } from '@/shared/ui/base/button'
import { Separator } from '@/shared/ui/base/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Input } from '@/shared/ui/base/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/base/alert-dialog'
import { Progress } from '@/shared/ui/base/progress'
import PageContainer from '@/shared/ui/layout/page-container'
import BaseLoading from '@/shared/ui/base-loading'

import {
  CompleteCountDialog,
  ApproveCountDialog,
  RejectCountDialog,
  AddCountItemDialog,
} from '@/features/inventory-count-workflow'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function InventoryCountDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const id = parseInt(resolvedParams.id)

  const { data: count, isLoading, error } = useInventoryCountById(id)
  const { data: variance } = useCountVarianceSummary(id)
  const updateItemMutation = useUpdateCountItem()
  const cancelMutation = useCancelCount()

  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  // Local state for editing counted quantities
  const [editingQuantities, setEditingQuantities] = useState<Record<number, number>>({})

  const handleQuantityChange = (itemId: number, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setEditingQuantities((prev) => ({ ...prev, [itemId]: numValue }))
    }
  }

  const handleSaveQuantity = (countItemId: number) => {
    const newQuantity = editingQuantities[countItemId]
    if (newQuantity !== undefined) {
      updateItemMutation.mutate({
        countId: id,
        countItemId,
        data: { countedQuantity: newQuantity },
      })
    }
  }

  const handleCancel = () => {
    cancelMutation.mutate(id, {
      onSuccess: () => router.push('/dashboard/inventory/counts'),
    })
  }

  if (isLoading) {
    return (
      <PageContainer>
        <BaseLoading />
      </PageContainer>
    )
  }

  if (error || !count) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">
            {error?.message || 'Инвентаризация не найдена'}
          </p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
        </div>
      </PageContainer>
    )
  }

  const isInProgress = count.status === 'in_progress'
  const isPendingApproval = count.status === 'pending_approval'
  const _isFinalized = count.status === 'completed' || count.status === 'cancelled'

  const countedItems = count.items?.filter((i) => i.isCounted).length || 0
  const totalItems = count.items?.length || 0
  const progress = totalItems > 0 ? (countedItems / totalItems) * 100 : 0

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{count.countNumber}</h1>
                <CountStatusBadge status={count.status} />
                <CountTypeBadge type={count.countType} />
              </div>
              <p className="text-muted-foreground text-sm">
                {count.warehouseName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isInProgress && (
              <>
                <Button variant="outline" onClick={() => setIsAddItemDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить товар
                </Button>
                <Button onClick={() => setIsCompleteDialogOpen(true)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Завершить подсчёт
                </Button>
                <Button variant="destructive" onClick={() => setIsCancelDialogOpen(true)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Отменить
                </Button>
              </>
            )}
            {isPendingApproval && (
              <>
                <Button onClick={() => setIsApproveDialogOpen(true)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Одобрить
                </Button>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(true)}>
                  Отклонить
                </Button>
                <Button variant="destructive" onClick={() => setIsCancelDialogOpen(true)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Отменить
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Progress and Variance Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Прогресс</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Подсчитано товаров</span>
                <span className="font-medium">
                  {countedItems} / {totalItems}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Расхождения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Недостача:</span>
                <span className="text-destructive">
                  {formatCurrency(variance?.shortageValue || count.shortageValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Излишек:</span>
                <span className="text-emerald-600 dark:text-emerald-500">
                  {formatCurrency(variance?.surplusValue || count.surplusValue)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Итого:</span>
                <span
                  className={
                    count.netAdjustmentValue < 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-500'
                  }
                >
                  {count.netAdjustmentValue >= 0 ? '+' : ''}
                  {formatCurrency(count.netAdjustmentValue)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата:</span>
                <span>
                  {format(new Date(count.countDate), 'dd MMM yyyy', { locale: ru })}
                </span>
              </div>
              {count.startedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Начата:</span>
                  <span>
                    {format(new Date(count.startedAt), 'dd MMM HH:mm', { locale: ru })}
                  </span>
                </div>
              )}
              {count.completedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Завершена:</span>
                  <span>
                    {format(new Date(count.completedAt), 'dd MMM HH:mm', { locale: ru })}
                  </span>
                </div>
              )}
              {variance && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Точность:</span>
                  <span>{variance.accuracyPct.toFixed(1)}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Товары ({totalItems})
              {variance && (
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  С расхождениями: {variance.itemsWithVariance}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead className="text-right">В системе</TableHead>
                    <TableHead className="text-right">Подсчитано</TableHead>
                    <TableHead className="text-right">Расхождение</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    {isInProgress && <TableHead className="w-[100px]" />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!count.items?.length ? (
                    <TableRow>
                      <TableCell
                        colSpan={isInProgress ? 6 : 5}
                        className="py-8 text-center"
                      >
                        Нет товаров для подсчёта
                      </TableCell>
                    </TableRow>
                  ) : (
                    count.items.map((item) => {
                      const editValue =
                        editingQuantities[item.id] ?? item.countedQuantity ?? 0
                      const variance =
                        item.countedQuantity !== null
                          ? item.countedQuantity - item.systemQuantity
                          : null
                      const hasVariance = variance !== null && variance !== 0

                      return (
                        <TableRow
                          key={item.id}
                          className={!item.isCounted ? 'bg-muted/30' : ''}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.itemName}</p>
                              <p className="text-muted-foreground text-xs">
                                {item.itemUnit}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.systemQuantity} {item.itemUnit}
                          </TableCell>
                          <TableCell className="text-right">
                            {isInProgress ? (
                              <Input
                                type="number"
                                min={0}
                                step="any"
                                value={editValue}
                                onChange={(e) =>
                                  handleQuantityChange(item.id, e.target.value)
                                }
                                className="h-8 w-24 text-right"
                              />
                            ) : (
                              <span>
                                {item.countedQuantity !== null
                                  ? `${item.countedQuantity} ${item.itemUnit}`
                                  : '—'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              hasVariance
                                ? variance! < 0
                                  ? 'text-destructive'
                                  : 'text-emerald-600 dark:text-emerald-500'
                                : ''
                            }`}
                          >
                            {variance !== null ? (
                              <>
                                {variance >= 0 ? '+' : ''}
                                {variance.toFixed(2)} {item.itemUnit}
                              </>
                            ) : (
                              '—'
                            )}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              item.varianceValue && item.varianceValue < 0
                                ? 'text-destructive'
                                : item.varianceValue && item.varianceValue > 0
                                  ? 'text-emerald-600 dark:text-emerald-500'
                                  : ''
                            }`}
                          >
                            {item.varianceValue !== null
                              ? formatCurrency(item.varianceValue)
                              : '—'}
                          </TableCell>
                          {isInProgress && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveQuantity(item.id)}
                                disabled={
                                  updateItemMutation.isPending ||
                                  editingQuantities[item.id] === undefined
                                }
                              >
                                {updateItemMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Сохранить'
                                )}
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {count.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Примечание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{count.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <CompleteCountDialog
        count={count}
        variance={variance}
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      />

      <ApproveCountDialog
        count={count}
        variance={variance}
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      />

      <RejectCountDialog
        countId={count.id}
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      />

      <AddCountItemDialog
        countId={count.id}
        warehouseId={count.warehouseId}
        open={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
      />

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить инвентаризацию?</AlertDialogTitle>
            <AlertDialogDescription>
              Инвентаризация {count.countNumber} будет отменена. Все внесённые данные
              будут сохранены, но корректировки остатков не будут применены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Назад</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Отменить инвентаризацию
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  )
}

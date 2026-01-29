'use client'

import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import {
  IconArrowLeft,
  IconPlus,
  IconSend,
  IconCheck,
  IconX,
  IconTrash,
} from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import { formatCurrency } from '@/shared/lib/format'
import { useRouter } from '@/shared/lib/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/base/alert-dialog'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import BaseLoading from '@/shared/ui/base-loading'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useWriteoffById,
  WriteoffStatusBadge,
  WriteoffReasonBadge,
  WRITEOFF_REASON_LABELS,
  useDeleteWriteoff,
  useRemoveWriteoffItem,
} from '@/entities/inventory/writeoff'
import {
  SubmitWriteoffDialog,
  ApproveWriteoffDialog,
  RejectWriteoffDialog,
  AddWriteoffItemDialog,
} from '@/features/inventory/writeoff-workflow'

interface PageProps {
  id: string
}

export default function WriteoffDetailPage({ id: paramId }: PageProps) {
  const { t } = useTranslation('inventory')
  const router = useRouter()
  const writeoffId = Number(paramId)

  const { data: writeoff, isLoading } = useWriteoffById(writeoffId)
  const deleteMutation = useDeleteWriteoff()
  const removeItemMutation = useRemoveWriteoffItem()

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)

  const handleDelete = () => {
    deleteMutation.mutate(writeoffId, {
      onSuccess: () => {
        router.push('/dashboard/inventory/writeoffs')
      },
    })
  }

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate({ writeoffId, itemId })
  }

  if (isLoading) {
    return (
      <PageContainer>
        <BaseLoading />
      </PageContainer>
    )
  }

  if (!writeoff) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Списание не найдено</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard/inventory/writeoffs">Назад к списку</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  const canEdit = writeoff.status === 'draft'
  const canSubmit =
    writeoff.status === 'draft' && (writeoff.items?.length ?? 0) > 0
  const canApprove = writeoff.status === 'pending'
  const canDelete = writeoff.status === 'draft'

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard/inventory/writeoffs">
                <IconArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <Heading
                  title={`Списание ${writeoff.writeoffNumber}`}
                  description={writeoff.warehouseName}
                />
                <WriteoffStatusBadge status={writeoff.status} />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {canSubmit && (
              <Button onClick={() => setSubmitDialogOpen(true)}>
                <IconSend className="mr-2 h-4 w-4" />
                На согласование
              </Button>
            )}
            {canApprove && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setRejectDialogOpen(true)}
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Отклонить
                </Button>
                <Button onClick={() => setApproveDialogOpen(true)}>
                  <IconCheck className="mr-2 h-4 w-4" />
                  Одобрить
                </Button>
              </>
            )}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <IconTrash className="mr-2 h-4 w-4" />
                    Удалить
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить списание?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Списание будет удалено
                      навсегда.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <Separator />

        {/* Writeoff Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Номер</span>
                <span className="font-medium">{writeoff.writeoffNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Склад</span>
                <span className="font-medium">{writeoff.warehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Причина</span>
                <WriteoffReasonBadge reason={writeoff.reason} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус</span>
                <WriteoffStatusBadge status={writeoff.status} />
              </div>
              {writeoff.notes && (
                <div className="border-t pt-2">
                  <span className="text-muted-foreground text-sm">
                    Примечания:
                  </span>
                  <p className="mt-1 text-sm">{writeoff.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Даты и статусы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Создано</span>
                <span>
                  {format(new Date(writeoff.createdAt), 'dd MMM yyyy, HH:mm', {
                    locale: ru,
                  })}
                </span>
              </div>
              {writeoff.submittedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Отправлено</span>
                  <span>
                    {format(
                      new Date(writeoff.submittedAt),
                      'dd MMM yyyy, HH:mm',
                      {
                        locale: ru,
                      }
                    )}
                  </span>
                </div>
              )}
              {writeoff.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Одобрено</span>
                  <span>
                    {format(
                      new Date(writeoff.approvedAt),
                      'dd MMM yyyy, HH:mm',
                      {
                        locale: ru,
                      }
                    )}
                  </span>
                </div>
              )}
              {writeoff.rejectedAt && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Отклонено</span>
                    <span>
                      {format(
                        new Date(writeoff.rejectedAt),
                        'dd MMM yyyy, HH:mm',
                        {
                          locale: ru,
                        }
                      )}
                    </span>
                  </div>
                  {writeoff.rejectReason && (
                    <div className="border-t pt-2">
                      <span className="text-muted-foreground text-sm">
                        Причина отклонения:
                      </span>
                      <p className="text-destructive mt-1 text-sm">
                        {writeoff.rejectReason}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Итого</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  Позиций: {writeoff.items?.length ?? 0}
                </p>
                <p className="text-muted-foreground text-sm">
                  Причина: {WRITEOFF_REASON_LABELS[writeoff.reason]}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm">
                  Общая сумма списания
                </p>
                <p className="text-destructive text-2xl font-bold">
                  {formatCurrency(writeoff.totalValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Товары для списания</h3>
            {canEdit && (
              <Button onClick={() => setAddItemDialogOpen(true)}>
                <IconPlus className="mr-2 h-4 w-4" />
                Добавить товар
              </Button>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead className="text-right">Количество</TableHead>
                  <TableHead className="text-right">Цена за ед.</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Примечание</TableHead>
                  {canEdit && <TableHead className="w-[80px]" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!writeoff.items?.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={canEdit ? 6 : 5}
                      className="py-8 text-center"
                    >
                      Нет товаров для списания
                    </TableCell>
                  </TableRow>
                ) : (
                  writeoff.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.itemName}</p>
                          <p className="text-muted-foreground text-sm">
                            {item.itemUnit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unitCost)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.totalCost)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.notes || '-'}
                      </TableCell>
                      {canEdit && (
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Удалить товар?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Товар &quot;{item.itemName}&quot; будет удалён
                                  из списания.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Удалить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SubmitWriteoffDialog
        writeoff={writeoff}
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
      />
      <ApproveWriteoffDialog
        writeoff={writeoff}
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
      />
      <RejectWriteoffDialog
        writeoffId={writeoffId}
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
      />
      <AddWriteoffItemDialog
        writeoffId={writeoffId}
        warehouseId={writeoff.warehouseId}
        open={addItemDialogOpen}
        onOpenChange={setAddItemDialogOpen}
      />
    </PageContainer>
  )
}

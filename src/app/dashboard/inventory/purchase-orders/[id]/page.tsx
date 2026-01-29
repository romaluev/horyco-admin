import { useState } from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  ArrowLeft,
  Send,
  Package,
  XCircle,
  Trash2,
  Loader2,
  Plus,
} from 'lucide-react'

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
} from '@/shared/ui/base/alert-dialog'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
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
  usePurchaseOrderById,
  POStatusBadge,
} from '@/entities/inventory/purchase-order'
import {
  useSendPurchaseOrder,
  useDeletePurchaseOrder,
} from '@/entities/inventory/purchase-order/model/mutations'
import {
  SendPODialog,
  ReceivePODialog,
  CancelPODialog,
  AddPOItemDialog,
} from '@/features/inventory/purchase-order-workflow'

interface PageProps {
  id: string
}

export default function PurchaseOrderDetailPage({ id: paramId }: PageProps) {
  const router = useRouter()
  const id = parseInt(paramId)

  const { data: order, isLoading, error } = usePurchaseOrderById(id)
  const deleteMutation = useDeletePurchaseOrder()

  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => router.push('/dashboard/inventory/purchase-orders'),
    })
  }

  if (isLoading) {
    return (
      <PageContainer>
        <BaseLoading />
      </PageContainer>
    )
  }

  if (error || !order) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">
            {error?.message || 'Заказ не найден'}
          </p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
        </div>
      </PageContainer>
    )
  }

  const isDraft = order.status === 'draft'
  const hasItems = (order.items?.length || 0) > 0
  const canSend = isDraft && hasItems
  const canReceive = order.status === 'sent' || order.status === 'partial'
  const canCancel =
    order.status !== 'received' &&
    order.status !== 'partial' &&
    order.status !== 'cancelled'
  const _isFinalized =
    order.status === 'received' || order.status === 'cancelled'

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
                <h1 className="text-2xl font-bold">{order.poNumber}</h1>
                <POStatusBadge status={order.status} />
              </div>
              <p className="text-muted-foreground text-sm">
                {order.supplierName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isDraft && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setAddItemDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить товар
                </Button>
                {canSend && (
                  <Button onClick={() => setSendDialogOpen(true)}>
                    <Send className="mr-2 h-4 w-4" />
                    Отправить
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Удалить
                </Button>
              </>
            )}
            {canReceive && (
              <Button onClick={() => setReceiveDialogOpen(true)}>
                <Package className="mr-2 h-4 w-4" />
                Принять товары
              </Button>
            )}
            {canCancel && !isDraft && (
              <Button
                variant="destructive"
                onClick={() => setCancelDialogOpen(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Отменить
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Даты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата заказа:</span>
                <span>
                  {format(new Date(order.orderDate), 'dd MMM yyyy', {
                    locale: ru,
                  })}
                </span>
              </div>
              {order.expectedDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ожидается:</span>
                  <span>
                    {format(new Date(order.expectedDate), 'dd MMM yyyy', {
                      locale: ru,
                    })}
                  </span>
                </div>
              )}
              {order.receivedDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Получен:</span>
                  <span>
                    {format(new Date(order.receivedDate), 'dd MMM yyyy', {
                      locale: ru,
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Суммы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Подытог:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Скидка:</span>
                  <span className="text-destructive">
                    -{formatCurrency(order.discountAmount)}
                  </span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Налог:</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Итого:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Склад:</span>
                <span>{order.warehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Валюта:</span>
                <span>{order.currency}</span>
              </div>
              {order.notes && (
                <div className="pt-2">
                  <span className="text-muted-foreground">Примечание:</span>
                  <p className="mt-1">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Товары ({order.items?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead className="text-right">Заказано</TableHead>
                    <TableHead className="text-right">Получено</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!order.items?.length ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        Нет товаров
                      </TableCell>
                    </TableRow>
                  ) : (
                    order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.itemName}</p>
                            {item.notes && (
                              <p className="text-muted-foreground text-xs">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantityOrdered} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              item.quantityReceived < item.quantityOrdered
                                ? 'text-destructive'
                                : ''
                            }
                          >
                            {item.quantityReceived} {item.unit}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.lineTotal)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Receives History */}
        {order.receives && order.receives.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>История приёмок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.receives.map((receive) => (
                  <div key={receive.id} className="rounded-md border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">
                        {receive.receiveNumber}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {format(new Date(receive.receiveDate), 'dd MMM yyyy', {
                          locale: ru,
                        })}
                      </span>
                    </div>
                    {receive.notes && (
                      <p className="text-muted-foreground text-sm">
                        {receive.notes}
                      </p>
                    )}
                    {receive.items && receive.items.length > 0 && (
                      <div className="mt-2 text-sm">
                        {receive.items.map((rItem) => (
                          <div
                            key={rItem.id}
                            className="flex justify-between py-1"
                          >
                            <span>Позиция #{rItem.poItemId}</span>
                            <span>+{rItem.quantityReceived}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cancellation Info */}
        {order.status === 'cancelled' && order.cancelReason && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Причина отмены</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.cancelReason}</p>
              {order.cancelledAt && (
                <p className="text-muted-foreground mt-2 text-sm">
                  Отменён:{' '}
                  {format(new Date(order.cancelledAt), 'dd MMM yyyy HH:mm', {
                    locale: ru,
                  })}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <SendPODialog
        order={order}
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
      />

      <ReceivePODialog
        order={order}
        open={receiveDialogOpen}
        onOpenChange={setReceiveDialogOpen}
      />

      <CancelPODialog
        orderId={order.id}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
      />

      <AddPOItemDialog
        orderId={order.id}
        open={addItemDialogOpen}
        onOpenChange={setAddItemDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить заказ?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо. Заказ {order.poNumber} будет удалён.
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
    </PageContainer>
  )
}

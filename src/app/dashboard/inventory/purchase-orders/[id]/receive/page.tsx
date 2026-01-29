import { useState } from 'react'


import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ArrowLeft, Loader2, Check, AlertTriangle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/base/card'
import { DatePicker } from '@/shared/ui/base/date-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import { Separator } from '@/shared/ui/base/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import { Textarea } from '@/shared/ui/base/textarea'
import BaseLoading from '@/shared/ui/base-loading'
import PageContainer from '@/shared/ui/layout/page-container'

import { usePurchaseOrderById, POStatusBadge } from '@/entities/inventory/purchase-order'
import { useReceivePurchaseOrder } from '@/entities/inventory/purchase-order/model/mutations'

const receiveSchema = z.object({
  receiveDate: z.date({ required_error: 'Укажите дату приёмки' }),
  notes: z.string().optional(),
})

type ReceiveFormValues = z.infer<typeof receiveSchema>

interface PageProps {
  id: string
}

export default function ReceivePage({ id: paramId }: PageProps) {
  const router = useRouter()
  const id = parseInt(paramId)

  const { data: order, isLoading, error } = usePurchaseOrderById(id)
  const receiveMutation = useReceivePurchaseOrder()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [prices, setPrices] = useState<Record<number, number>>({})

  const form = useForm<ReceiveFormValues>({
    resolver: zodResolver(receiveSchema),
    defaultValues: {
      receiveDate: new Date(),
      notes: '',
    },
  })

  // Initialize quantities when order loads
  if (order && Object.keys(quantities).length === 0) {
    const initialQty: Record<number, number> = {}
    const initialPrices: Record<number, number> = {}
    order.items?.forEach((item) => {
      const remaining = item.quantityOrdered - item.quantityReceived
      initialQty[item.id] = remaining > 0 ? remaining : 0
      initialPrices[item.id] = item.unitPrice
    })
    setQuantities(initialQty)
    setPrices(initialPrices)
  }

  const handleQuantityChange = (itemId: number, value: string) => {
    const numValue = parseFloat(value) || 0
    setQuantities((prev) => ({ ...prev, [itemId]: numValue }))
  }

  const handlePriceChange = (itemId: number, value: string) => {
    const numValue = parseFloat(value) || 0
    setPrices((prev) => ({ ...prev, [itemId]: numValue }))
  }

  const handleSubmit = (values: ReceiveFormValues) => {
    setConfirmDialogOpen(true)
  }

  const confirmReceive = () => {
    const values = form.getValues()
    const itemsToReceive = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => ({
        poItemId: parseInt(itemId),
        quantityReceived: qty,
        unitPrice: prices[parseInt(itemId)],
      }))

    if (itemsToReceive.length === 0) {
      return
    }

    receiveMutation.mutate(
      {
        id: order!.id,
        data: {
          receiveDate: format(values.receiveDate, 'yyyy-MM-dd'),
          notes: values.notes || undefined,
          items: itemsToReceive,
        },
      },
      {
        onSuccess: () => {
          router.push(`/dashboard/inventory/purchase-orders/${order!.id}`)
        },
      }
    )
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

  const canReceive = order.status === 'sent' || order.status === 'partial'

  if (!canReceive) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Check className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium">Заказ полностью получен</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Все товары по этому заказу уже были приняты.
          </p>
          <Button variant="outline" onClick={() => router.push(`/dashboard/inventory/purchase-orders/${order.id}`)}>
            Просмотреть заказ
          </Button>
        </div>
      </PageContainer>
    )
  }

  // Calculate totals
  const totalReceiving = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  const totalValue = Object.entries(quantities).reduce((sum, [itemId, qty]) => {
    const price = prices[parseInt(itemId)] || 0
    return sum + qty * price
  }, 0)

  // Check for price variance
  const priceVariances = order.items
    ?.map((item) => {
      const newPrice = prices[item.id] || item.unitPrice
      const variance = ((newPrice - item.unitPrice) / item.unitPrice) * 100
      return { item, newPrice, variance }
    })
    .filter((v) => Math.abs(v.variance) > 5) || []

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/inventory/purchase-orders/${order.id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Приёмка товаров</h1>
              <POStatusBadge status={order.status} />
            </div>
            <p className="text-muted-foreground text-sm">
              {order.poNumber} • {order.supplierName}
            </p>
          </div>
        </div>

        <Separator />

        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Информация о заказе</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Поставщик</p>
              <p className="font-medium">{order.supplierName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Склад</p>
              <p className="font-medium">{order.warehouseName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Дата заказа</p>
              <p className="font-medium">
                {format(new Date(order.orderDate), 'dd MMM yyyy', { locale: ru })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ожидаемая дата</p>
              <p className="font-medium">
                {order.expectedDate
                  ? format(new Date(order.expectedDate), 'dd MMM yyyy', { locale: ru })
                  : '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Receive Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Дата приёмки</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="receiveDate"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel>Дата</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={(dateStr) =>
                            field.onChange(dateStr ? new Date(dateStr) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Previous Receives */}
            {order.receives && order.receives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Предыдущие приёмки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Номер</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead className="text-right">Позиций</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.receives.map((receive) => (
                          <TableRow key={receive.id}>
                            <TableCell className="font-medium">
                              {receive.receiveNumber}
                            </TableCell>
                            <TableCell>
                              {format(new Date(receive.receiveDate), 'dd MMM yyyy', {
                                locale: ru,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {receive.items?.length || 0}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Items to Receive */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Товары к приёмке</CardTitle>
                <CardDescription>
                  Укажите фактическое количество и цену для каждого товара
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Товар</TableHead>
                        <TableHead className="text-right">Заказано</TableHead>
                        <TableHead className="text-right">Получено</TableHead>
                        <TableHead className="text-right">Осталось</TableHead>
                        <TableHead className="w-[120px] text-right">Принять</TableHead>
                        <TableHead className="w-[140px] text-right">Цена</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items?.map((item) => {
                        const remaining = item.quantityOrdered - item.quantityReceived
                        const isFullyReceived = remaining <= 0
                        const currentPrice = prices[item.id] || item.unitPrice
                        const priceVariance = ((currentPrice - item.unitPrice) / item.unitPrice) * 100

                        return (
                          <TableRow
                            key={item.id}
                            className={isFullyReceived ? 'opacity-50' : ''}
                          >
                            <TableCell>
                              <div>
                                <span className="font-medium">{item.itemName}</span>
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
                              {item.quantityReceived} {item.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              {remaining > 0 ? remaining : 0} {item.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                min={0}
                                max={remaining > 0 ? remaining : 0}
                                step="any"
                                value={quantities[item.id] ?? 0}
                                onChange={(e) =>
                                  handleQuantityChange(item.id, e.target.value)
                                }
                                disabled={isFullyReceived}
                                className="h-8 w-full text-right"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="space-y-1">
                                <Input
                                  type="number"
                                  min={0}
                                  step="any"
                                  value={currentPrice}
                                  onChange={(e) =>
                                    handlePriceChange(item.id, e.target.value)
                                  }
                                  disabled={isFullyReceived}
                                  className="h-8 w-full text-right"
                                />
                                {Math.abs(priceVariance) > 5 && !isFullyReceived && (
                                  <p
                                    className={`text-xs ${
                                      priceVariance > 0
                                        ? 'text-destructive'
                                        : 'text-green-600'
                                    }`}
                                  >
                                    {priceVariance > 0 ? '+' : ''}
                                    {priceVariance.toFixed(1)}%
                                  </p>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Price Variance Warnings */}
            {priceVariances.length > 0 && (
              <Card className="border-yellow-500/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    Отклонение цен
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {priceVariances.map(({ item, newPrice, variance }) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span>{item.itemName}</span>
                        <span
                          className={
                            variance > 0 ? 'text-destructive' : 'text-green-600'
                          }
                        >
                          {formatCurrency(item.unitPrice)} → {formatCurrency(newPrice)} (
                          {variance > 0 ? '+' : ''}
                          {variance.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Примечание</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Комментарий к приёмке..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Итого</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Позиций к приёмке</p>
                    <p className="text-2xl font-bold">
                      {Object.values(quantities).filter((q) => q > 0).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Общее количество</p>
                    <p className="text-2xl font-bold">{totalReceiving.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Сумма</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/inventory/purchase-orders/${order.id}`)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={totalReceiving === 0}>
                Подтвердить приёмку
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Confirmation Dialog */}
      {order && (
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Подтвердить приёмку?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>Вы собираетесь принять товары:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(order.items ?? [])
                    .filter((item) => (quantities[item.id] ?? 0) > 0)
                    .map((item) => (
                      <li key={item.id}>
                        {item.itemName}: {quantities[item.id] ?? 0} {item.unit} @{' '}
                        {formatCurrency(prices[item.id] ?? item.unitPrice)}
                      </li>
                    ))}
                </ul>
                <p className="font-medium pt-2">
                  Итого: {formatCurrency(totalValue)}
                </p>
                <p className="text-sm pt-2">
                  Это действие обновит остатки на складе и пересчитает среднюю стоимость.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmReceive}
                disabled={receiveMutation.isPending}
              >
                {receiveMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Подтвердить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </PageContainer>
  )
}

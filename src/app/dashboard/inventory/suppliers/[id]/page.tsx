'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import {
  IconArrowLeft,
  IconPlus,
  IconEdit,
  IconTrash,
  IconStar,
  IconStarFilled,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBuilding,
} from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { formatCurrency } from '@/shared/lib/format'
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
import { Badge } from '@/shared/ui/base/badge'
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/base/tabs'
import BaseLoading from '@/shared/ui/base-loading'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useSupplierById,
  useSupplierItems,
  useSupplierPriceHistory,
  useDeleteSupplier,
  useRemoveSupplierItem,
  useActivateSupplier,
  useDeactivateSupplier,
} from '@/entities/inventory/supplier'
import {
  EditSupplierDialog,
  AddSupplierItemDialog,
  EditSupplierItemDialog,
} from '@/features/inventory/supplier-workflow'

export default function SupplierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supplierId = Number(params.id)

  const { data: supplier, isLoading } = useSupplierById(supplierId)
  const { data: items } = useSupplierItems(supplierId)
  const { data: priceHistory } = useSupplierPriceHistory(supplierId)

  const deleteMutation = useDeleteSupplier()
  const removeItemMutation = useRemoveSupplierItem()
  const activateMutation = useActivateSupplier()
  const deactivateMutation = useDeactivateSupplier()

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<number | null>(null)

  const handleDelete = () => {
    deleteMutation.mutate(supplierId, {
      onSuccess: () => {
        router.push('/dashboard/inventory/suppliers')
      },
    })
  }

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate({ supplierId, itemId })
  }

  const handleToggleActive = () => {
    if (supplier?.isActive) {
      deactivateMutation.mutate(supplierId)
    } else {
      activateMutation.mutate(supplierId)
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <BaseLoading />
      </PageContainer>
    )
  }

  if (!supplier) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Поставщик не найден</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/inventory/suppliers">Назад к списку</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  // Get the item being edited
  const itemToEdit = items?.find((item) => item.id === editingItem)

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/inventory/suppliers">
                <IconArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <Heading title={supplier.name} description={supplier.code || 'Поставщик'} />
                <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
                  {supplier.isActive ? 'Активен' : 'Неактивен'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleToggleActive}>
              {supplier.isActive ? 'Деактивировать' : 'Активировать'}
            </Button>
            <Button onClick={() => setEditDialogOpen(true)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <IconTrash className="mr-2 h-4 w-4" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить поставщика?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Поставщик и все связанные
                    данные будут удалены.
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
          </div>
        </div>

        <Separator />

        {/* Supplier Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBuilding className="h-4 w-4" />
                Основная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Наименование</span>
                <span className="font-medium">{supplier.name}</span>
              </div>
              {supplier.legalName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Юр. название</span>
                  <span className="font-medium">{supplier.legalName}</span>
                </div>
              )}
              {supplier.taxId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ИНН</span>
                  <span className="font-medium">{supplier.taxId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Срок доставки</span>
                <span className="font-medium">{supplier.leadTimeDays} дней</span>
              </div>
              {supplier.minimumOrder && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Мин. заказ</span>
                  <span className="font-medium">{formatCurrency(supplier.minimumOrder)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPhone className="h-4 w-4" />
                Контакты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {supplier.contactName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Контактное лицо</span>
                  <span className="font-medium">{supplier.contactName}</span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <IconPhone className="h-3 w-3" />
                    Телефон
                  </span>
                  <a
                    href={`tel:${supplier.phone}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {supplier.phone}
                  </a>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <IconMail className="h-3 w-3" />
                    Email
                  </span>
                  <a
                    href={`mailto:${supplier.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {supplier.email}
                  </a>
                </div>
              )}
              {supplier.address && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    <IconMapPin className="h-3 w-3" />
                    Адрес
                  </span>
                  <p className="mt-1 text-sm">{supplier.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Всего заказов</span>
                <span className="font-medium">{supplier.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Общая сумма</span>
                <span className="font-medium">{formatCurrency(supplier.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Средний чек</span>
                <span className="font-medium">
                  {formatCurrency(supplier.averageOrderValue)}
                </span>
              </div>
              {supplier.lastOrderAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Последний заказ</span>
                  <span>
                    {format(new Date(supplier.lastOrderAt), 'dd MMM yyyy', {
                      locale: ru,
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Items and Price History */}
        <Tabs defaultValue="items" className="w-full">
          <TabsList>
            <TabsTrigger value="items">
              Каталог товаров ({items?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="prices">
              История цен ({priceHistory?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Товары поставщика</h3>
              <Button onClick={() => setAddItemDialogOpen(true)}>
                <IconPlus className="mr-2 h-4 w-4" />
                Добавить товар
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead>Артикул</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                    <TableHead className="text-right">Мин. заказ</TableHead>
                    <TableHead className="text-center">Предпочит.</TableHead>
                    <TableHead className="w-[100px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!items?.length ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Нет товаров в каталоге
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.itemName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.itemUnit}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.supplierSku || '—'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.minOrderQuantity}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.isPreferred ? (
                            <IconStarFilled className="h-4 w-4 text-amber-500 mx-auto" />
                          ) : (
                            <IconStar className="h-4 w-4 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem(item.id)}
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
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
                                    Удалить товар из каталога?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Товар &quot;{item.itemName}&quot; будет удалён из
                                    каталога поставщика.
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="prices" className="space-y-4">
            <h3 className="text-lg font-semibold">История изменения цен</h3>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead className="text-right">Старая цена</TableHead>
                    <TableHead className="text-right">Новая цена</TableHead>
                    <TableHead className="text-right">Изменение</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Источник</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!priceHistory?.length ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        История цен пуста
                      </TableCell>
                    </TableRow>
                  ) : (
                    priceHistory.map((history) => (
                      <TableRow key={history.id}>
                        <TableCell className="font-medium">
                          {history.itemName}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(history.oldPrice)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(history.newPrice)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            (history.priceChange ?? 0) > 0
                              ? 'text-destructive'
                              : 'text-emerald-600 dark:text-emerald-500'
                          }`}
                        >
                          {(history.priceChange ?? 0) > 0 ? '+' : ''}
                          {(history.priceChangePct ?? 0).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(
                            new Date(history.effectiveDate),
                            'dd MMM yyyy',
                            { locale: ru }
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {history.source}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <EditSupplierDialog
        supplier={supplier}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <AddSupplierItemDialog
        supplierId={supplierId}
        open={addItemDialogOpen}
        onOpenChange={setAddItemDialogOpen}
      />
      {itemToEdit && (
        <EditSupplierItemDialog
          supplierId={supplierId}
          item={itemToEdit}
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null)
          }}
        />
      )}
    </PageContainer>
  )
}

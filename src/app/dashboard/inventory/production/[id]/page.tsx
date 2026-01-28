'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from '@tanstack/react-router'
import { useRouter } from '@/shared/lib/navigation'

import {
  IconArrowLeft,
  IconPlayerPlay,
  IconCheck,
  IconX,
  IconTrash,
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
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Heading } from '@/shared/ui/base/heading'
import { Progress } from '@/shared/ui/base/progress'
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
  useProductionOrderById,
  ProductionStatusBadge,
  useDeleteProductionOrder,
} from '@/entities/inventory/production-order'
import {
  StartProductionDialog,
  CompleteProductionDialog,
  CancelProductionDialog,
} from '@/features/inventory/production-workflow'

interface PageProps {
  id: string
}

export default function ProductionDetailPage({ id: paramId }: PageProps) {
  const { t } = useTranslation('inventory')
  const router = useRouter()
  const productionId = Number(paramId)

  const { data: order, isLoading } = useProductionOrderById(productionId)
  const deleteMutation = useDeleteProductionOrder()

  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const handleDelete = () => {
    deleteMutation.mutate(productionId, {
      onSuccess: () => {
        router.push('/dashboard/inventory/production')
      },
    })
  }

  if (isLoading) {
    return (
      <PageContainer>
        <BaseLoading />
      </PageContainer>
    )
  }

  if (!order) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">{t('pages.production.notFound')}</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard/inventory/production">{t('common.back')}</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  const canStart = order.status === 'planned'
  const canComplete = order.status === 'in_progress'
  const canCancel = order.status === 'planned' || order.status === 'in_progress'
  const canDelete = order.status === 'planned'

  // Calculate progress
  const progressPercent = order.status === 'completed'
    ? 100
    : order.status === 'in_progress'
    ? 50
    : 0

  // Calculate total ingredient cost
  const totalIngredientCost = order.ingredients?.reduce(
    (sum, ing) => sum + ing.unitCost * (ing.actualQuantity ?? ing.plannedQuantity),
    0
  ) ?? 0

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard/inventory/production">
                <IconArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <Heading
                  title={`Производство ${order.productionNumber}`}
                  description={order.recipeName}
                />
                <ProductionStatusBadge status={order.status} />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {canStart && (
              <Button onClick={() => setIsStartDialogOpen(true)}>
                <IconPlayerPlay className="mr-2 h-4 w-4" />
                {t('components.productionWorkflow.start.title')}
              </Button>
            )}
            {canComplete && (
              <Button onClick={() => setIsCompleteDialogOpen(true)}>
                <IconCheck className="mr-2 h-4 w-4" />
                {t('components.productionWorkflow.complete.title')}
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                <IconX className="mr-2 h-4 w-4" />
                {t('common.cancel')}
              </Button>
            )}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <IconTrash className="mr-2 h-4 w-4" />
                    {t('pages.production.delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('components.productionWorkflow.cancel.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Заказ на производство будет
                      удалён навсегда.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('pages.production.delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <Separator />

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>{t('pages.production.columnQuantity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progressPercent} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className={order.status !== 'planned' ? 'text-primary font-medium' : 'text-muted-foreground'}>
                  Запланировано
                </span>
                <span className={order.status === 'in_progress' || order.status === 'completed' ? 'text-primary font-medium' : 'text-muted-foreground'}>
                  В процессе
                </span>
                <span className={order.status === 'completed' ? 'text-primary font-medium' : 'text-muted-foreground'}>
                  Завершено
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Информация о заказе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Номер</span>
                <span className="font-medium">{order.productionNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Склад</span>
                <span className="font-medium">{order.warehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Рецепт</span>
                <span className="font-medium">{order.recipeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Продукт</span>
                <span className="font-medium">{order.outputItemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус</span>
                <ProductionStatusBadge status={order.status} />
              </div>
              {order.notes && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground text-sm">Примечания:</span>
                  <p className="mt-1 text-sm">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Количество и даты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">План. количество</span>
                <span className="font-medium">
                  {order.plannedQuantity} {order.outputUnit}
                </span>
              </div>
              {order.actualQuantity !== null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Факт. количество</span>
                  <span className="font-medium">
                    {order.actualQuantity} {order.outputUnit}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">План. дата</span>
                <span>
                  {format(new Date(order.plannedDate), 'dd MMM yyyy', {
                    locale: ru,
                  })}
                </span>
              </div>
              {order.startedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Начато</span>
                  <span>
                    {format(new Date(order.startedAt), 'dd MMM yyyy, HH:mm', {
                      locale: ru,
                    })}
                  </span>
                </div>
              )}
              {order.completedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Завершено</span>
                  <span>
                    {format(new Date(order.completedAt), 'dd MMM yyyy, HH:mm', {
                      locale: ru,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Создано</span>
                <span>
                  {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm', {
                    locale: ru,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Себестоимость</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Ингредиентов: {order.ingredients?.length ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Выход: {order.actualQuantity ?? order.plannedQuantity} {order.outputUnit}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Общая себестоимость</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalIngredientCost)}
                </p>
                {order.actualQuantity && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(totalIngredientCost / order.actualQuantity)} за единицу
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('components.recipeWorkflow.addIngredient.title')}</h3>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>товар</TableHead>
                  <TableHead className="text-right">план. кол-во</TableHead>
                  <TableHead className="text-right">факт. кол-во</TableHead>
                  <TableHead className="text-right">цена за ед.</TableHead>
                  <TableHead className="text-right">сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!order.ingredients?.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      нет ингредиентов
                    </TableCell>
                  </TableRow>
                ) : (
                  order.ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ingredient.itemName}</p>
                          <p className="text-sm text-muted-foreground">
                            {ingredient.itemUnit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {ingredient.plannedQuantity}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {ingredient.actualQuantity ?? '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(ingredient.unitCost)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          ingredient.unitCost *
                            (ingredient.actualQuantity ?? ingredient.plannedQuantity)
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <StartProductionDialog
        order={order}
        open={isStartDialogOpen}
        onOpenChange={setIsStartDialogOpen}
      />
      <CompleteProductionDialog
        order={order}
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      />
      <CancelProductionDialog
        orderId={productionId}
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      />
    </PageContainer>
  )
}

'use client'

import { useState } from 'react'


import { Link } from '@tanstack/react-router'


import {
  IconArrowLeft,
  IconPlus,
  IconEdit,
  IconTrash,
  IconArrowsExchange,
} from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

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
import BaseLoading from '@/shared/ui/base-loading'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetInventoryItemById,
  useGetItemConversions,
  useDeleteInventoryItem,
  useRemoveUnitConversion,
} from '@/entities/inventory/inventory-item'
import {
  EditItemDialog,
  AddUnitConversionDialog,
} from '@/features/inventory/inventory-item-workflow'

interface PageProps {
  id: string
}

export default function InventoryItemDetailPage({ id: paramId }: PageProps) {
  const { t } = useTranslation('inventory')
  const router = useRouter()
  const itemId = Number(paramId)

  const { data: item, isLoading } = useGetInventoryItemById(itemId)
  const { data: conversions } = useGetItemConversions(itemId)

  const deleteMutation = useDeleteInventoryItem()
  const removeConversionMutation = useRemoveUnitConversion()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddConversionDialogOpen, setIsAddConversionDialogOpen] = useState(false)

  const handleDelete = () => {
    deleteMutation.mutate(itemId, {
      onSuccess: () => {
        router.push('/dashboard/inventory/items')
      },
    })
  }

  const handleRemoveConversion = (conversionId: number) => {
    removeConversionMutation.mutate({ id: itemId, conversionId })
  }

  if (isLoading) {
    return (
      <PageContainer>
        <BaseLoading />
      </PageContainer>
    )
  }

  if (!item) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">{t('pages.itemDetail.backToList')}</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard/inventory/items">{t('pages.itemDetail.backToList')}</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard/inventory/items">
                <IconArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <Heading title={item.name} description={item.sku || 'Товар'} />
                <Badge variant={item.isActive ? 'default' : 'secondary'}>
                  {item.isActive ? t('pages.itemDetail.active') : t('pages.itemDetail.inactive')}
                </Badge>
                {item.isSemiFinished && (
                  <Badge variant="outline">{t('pages.itemDetail.semiFinished')}</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <IconEdit className="mr-2 h-4 w-4" />
              {t('pages.itemDetail.edit')}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <IconTrash className="mr-2 h-4 w-4" />
                  {t('pages.itemDetail.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('pages.itemDetail.deleteConfirm')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('pages.itemDetail.deleteDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t('pages.itemDetail.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Separator />

        {/* Item Details */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.itemDetail.basicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Название</span>
                <span className="font-medium">{item.name}</span>
              </div>
              {item.sku && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium">{item.sku}</span>
                </div>
              )}
              {item.barcode && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Штрихкод</span>
                  <span className="font-medium">{item.barcode}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Категория</span>
                <span className="font-medium">{item.category || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Единица измерения</span>
                <span className="font-medium">{item.unit}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('pages.itemDetail.stockLevels')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('pages.itemDetail.minLevel')}</span>
                <span className="font-medium">
                  {item.minStockLevel} {item.unit}
                </span>
              </div>
              {item.maxStockLevel && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('pages.itemDetail.maxLevel')}</span>
                  <span className="font-medium">
                    {item.maxStockLevel} {item.unit}
                  </span>
                </div>
              )}
              {item.reorderPoint && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('pages.itemDetail.reorderPoint')}</span>
                  <span className="font-medium">
                    {item.reorderPoint} {item.unit}
                  </span>
                </div>
              )}
              {item.reorderQuantity && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('pages.itemDetail.reorderQuantity')}</span>
                  <span className="font-medium">
                    {item.reorderQuantity} {item.unit}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('pages.itemDetail.additional')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.shelfLifeDays && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('pages.itemDetail.shelfLife')}</span>
                  <span className="font-medium">{item.shelfLifeDays} {t('pages.itemDetail.days')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('pages.itemDetail.taxRate')}</span>
                <span className="font-medium">{item.taxRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('pages.itemDetail.trackable')}</span>
                <span className="font-medium">
                  {item.isTrackable ? t('pages.itemDetail.yes') : t('pages.itemDetail.no')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('pages.itemDetail.created')}</span>
                <span>
                  {format(new Date(item.createdAt), 'dd MMM yyyy', {
                    locale: ru,
                  })}
                </span>
              </div>
              {item.notes && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground text-sm">{t('pages.itemDetail.notes')}:</span>
                  <p className="mt-1 text-sm">{item.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Unit Conversions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconArrowsExchange className="h-5 w-5" />
              <h3 className="text-lg font-semibold">{t('pages.itemDetail.conversions')}</h3>
            </div>
            <Button onClick={() => setIsAddConversionDialogOpen(true)}>
              <IconPlus className="mr-2 h-4 w-4" />
              {t('pages.itemDetail.addConversion')}
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              {!conversions?.length ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {t('pages.itemDetail.noConversions')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('pages.itemDetail.addConversionsInfo')}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('pages.itemDetail.fromUnit')}</TableHead>
                      <TableHead>{t('pages.itemDetail.toUnit')}</TableHead>
                      <TableHead className="text-right">{t('pages.itemDetail.factor')}</TableHead>
                      <TableHead>{t('pages.itemDetail.note')}</TableHead>
                      <TableHead className="w-[80px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversions.map((conversion) => (
                      <TableRow key={conversion.id}>
                        <TableCell className="font-medium">
                          {conversion.fromUnit}
                        </TableCell>
                        <TableCell className="font-medium">
                          {conversion.toUnit}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-mono">
                            1 {conversion.fromUnit} = {conversion.conversionFactor}{' '}
                            {conversion.toUnit}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {conversion.notes || '—'}
                        </TableCell>
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
                                  {t('pages.itemDetail.deleteConversion')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('pages.itemDetail.conversionDescription')} {conversion.fromUnit} → {conversion.toUnit}{' '}
                                  будет удалена.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleRemoveConversion(conversion.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {t('pages.itemDetail.delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <EditItemDialog
        item={item}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <AddUnitConversionDialog
        itemId={itemId}
        baseUnit={item.unit}
        open={isAddConversionDialogOpen}
        onOpenChange={setIsAddConversionDialogOpen}
      />
    </PageContainer>
  )
}

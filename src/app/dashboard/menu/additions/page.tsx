/**
 * Additions Page
 * Main page for managing addition groups and items
 */

'use client'

import { useState } from 'react'

import { Plus, Trash } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/base/accordion'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import BaseLoading from '@/shared/ui/base-loading'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetAdditions,
  useDeleteAddition,
  useDeleteAdditionItem,
} from '@/entities/addition'
import { useGetProducts } from '@/entities/product'
import {
  CreateAdditionDialog,
  CreateAdditionItemDialog,
} from '@/features/addition-form'

import type { JSX } from 'react'

export default function AdditionsPage(): JSX.Element {
  const [productFilter, setProductFilter] = useState<string>('all')

  const { data: additions, isLoading } = useGetAdditions(
    productFilter !== 'all' ? { productId: Number(productFilter) } : undefined
  )
  const { data: productsData } = useGetProducts({ limit: 100 })
  const { mutate: deleteAddition } = useDeleteAddition()
  const { mutate: deleteItem } = useDeleteAdditionItem()

  const products = productsData?.data || []

  if (isLoading) {
    return (
      <PageContainer>
        <div className="w-full">
          <BaseLoading />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Дополнения</h2>
            <p className="text-muted-foreground">
              Управляйте дополнительными позициями к продуктам
            </p>
          </div>
          {productFilter !== 'all' && (
            <CreateAdditionDialog
              productId={Number(productFilter)}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Создать дополнение
                </Button>
              }
            />
          )}
        </div>

        <Select value={productFilter} onValueChange={setProductFilter}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Выберите продукт" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все продукты</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {additions && additions.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                Групп дополнений
              </p>
              <p className="text-2xl font-bold">{additions.length}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                Всего позиций
              </p>
              <p className="text-2xl font-bold">
                {additions.reduce((sum, add) => sum + add.items.length, 0)}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                Активных
              </p>
              <p className="text-2xl font-bold">
                {additions.filter((a) => a.isActive).length}
              </p>
            </div>
          </div>
        )}

        {!additions || additions.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-muted-foreground text-lg font-medium">
                Дополнения не найдены
              </p>
              <p className="text-muted-foreground text-sm">
                Создайте первую группу дополнений
              </p>
            </div>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {additions.map((addition) => (
              <AccordionItem
                key={addition.id}
                value={addition.id.toString()}
                className="bg-card rounded-lg border"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex flex-1 items-center justify-between pr-4">
                    <div className="text-left">
                      <h3 className="font-semibold">{addition.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {addition.isRequired && 'Обязательно • '}
                        {addition.isMultiple && 'Множественный • '}
                        {addition.isCountable && 'Количественный • '}
                        Мин: {addition.minSelection}, Макс:{' '}
                        {addition.maxSelection}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {addition.items.length} позиций
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteAddition(addition.id)
                        }}
                      >
                        <Trash className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {addition.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.price} ₽</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash className="text-destructive h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <CreateAdditionItemDialog
                      additionId={addition.id}
                      trigger={
                        <Button size="sm" variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Добавить позицию
                        </Button>
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </PageContainer>
  )
}

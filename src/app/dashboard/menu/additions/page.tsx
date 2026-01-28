/**
 * Additions Page
 * Main page for managing addition groups and items
 */

'use client'

import { useState } from 'react'

import { Edit, Plus } from 'lucide-react'

import { useTranslation } from 'react-i18next'

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
import { ViewModeToggler } from '@/shared/ui/view-mode-toggler'

import {
  AdditionList,
  type IAddition,
  useGetAdditions,
} from '@/entities/menu/addition'
import { useGetProducts } from '@/entities/menu/product'
import {
  CreateAdditionDialog,
  DeleteAdditionButton,
  UpdateAdditionDialog,
} from '@/features/menu/addition-form'

import type { JSX } from 'react'

export default function AdditionsPage(): JSX.Element {
  const { t } = useTranslation('menu')
  const [productFilter, setProductFilter] = useState<string>('all')
  const [view, setView] = useState<'tree' | 'grid'>('grid')
  const [editingAddition, setEditingAddition] = useState<IAddition | null>(null)

  const { data: additions, isLoading } = useGetAdditions(
    productFilter !== 'all' ? { productId: Number(productFilter) } : undefined
  )
  const { data: productsData } = useGetProducts({ limit: 100 })

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
            <h2 className="text-3xl font-bold tracking-tight">
              {t('pages.additions.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.additions.description')}
            </p>
          </div>
          <CreateAdditionDialog
            productId={
              productFilter !== 'all' ? Number(productFilter) : undefined
            }
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('pages.additions.actions.create')}
              </Button>
            }
          />
        </div>

        <div className="flex items-center gap-4">
          <ViewModeToggler value={view} onChange={setView} />
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[300px]">
              <SelectValue
                placeholder={t('pages.additions.filters.selectProduct')}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('pages.additions.filters.allProducts')}
              </SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {additions && additions.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                {t('pages.additions.stats.groups')}
              </p>
              <p className="text-2xl font-bold">{additions.length}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                {t('pages.additions.stats.active')}
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
                {t('pages.additions.empty.notFound')}
              </p>
              <p className="text-muted-foreground text-sm">
                {productFilter === 'all'
                  ? t('pages.additions.empty.selectProductFirst')
                  : t('pages.additions.empty.createFirst')}
              </p>
            </div>
          </div>
        ) : view === 'tree' ? (
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
                            {addition.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingAddition(addition)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <div
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation()
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <DeleteAdditionButton
                              addition={addition}
                              variant="ghost"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {addition.isRequired && (
                            <Badge variant="secondary">
                              {t('pages.additions.badges.required')}
                            </Badge>
                          )}
                          {addition.isMultiple && (
                            <Badge variant="secondary">
                              {t('pages.additions.badges.multiple')}
                            </Badge>
                          )}
                          {addition.isCountable && (
                            <Badge variant="secondary">
                              {t('pages.additions.badges.countable')}
                            </Badge>
                          )}
                          {addition.isActive ? (
                            <Badge variant="default">
                              {t('pages.additions.badges.active')}
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              {t('pages.additions.badges.inactive')}
                            </Badge>
                          )}
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-lg border p-3">
                            <p className="text-muted-foreground text-xs font-medium">
                              {t('pages.additions.details.minSelection')}
                            </p>
                            <p className="text-lg font-semibold">
                              {addition.minSelection}
                            </p>
                          </div>
                          <div className="rounded-lg border p-3">
                            <p className="text-muted-foreground text-xs font-medium">
                              {t('pages.additions.details.maxSelection')}
                            </p>
                            <p className="text-lg font-semibold">
                              {addition.maxSelection}
                            </p>
                          </div>
                          <div className="rounded-lg border p-3">
                            <p className="text-muted-foreground text-xs font-medium">
                              {t('pages.additions.details.sortOrder')}
                            </p>
                            <p className="text-lg font-semibold">
                              {addition.sortOrder}
                            </p>
                          </div>
                          <div className="rounded-lg border p-3">
                            <p className="text-muted-foreground text-xs font-medium">
                              {t('pages.additions.details.itemsCount')}
                            </p>
                            <p className="text-lg font-semibold">
                              {addition.itemsCount ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
        ) : (
          <AdditionList
            additions={additions}
            isLoading={isLoading}
            onAdditionClick={(addition) => setEditingAddition(addition)}
          />
        )}
      </div>

      {editingAddition && (
        <UpdateAdditionDialog
          addition={editingAddition}
          isOpen={!!editingAddition}
          onClose={() => setEditingAddition(null)}
        />
      )}
    </PageContainer>
  )
}

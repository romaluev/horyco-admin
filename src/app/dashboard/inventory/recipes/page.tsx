'use client'

import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { IconSearch, IconChefHat } from '@tabler/icons-react'

import { formatCurrency } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Separator } from '@/shared/ui/base/separator'
import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetRecipes, RecipeTypeBadge, type RecipeType, type IRecipe } from '@/entities/inventory/recipe'
import { CreateRecipeDialog } from '@/features/inventory/recipe-form'

type StatusFilter = 'all' | 'active' | 'inactive'
type LinkedFilter = 'all' | 'product' | 'modifier' | 'semi-finished' | 'unlinked'

export default function RecipesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [linkedFilter, setLinkedFilter] = useState<LinkedFilter>('all')

  const { data: recipes, isLoading } = useGetRecipes({
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    type: linkedFilter === 'all' ? undefined : (linkedFilter as RecipeType),
  })

  const filteredRecipes = recipes?.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  )

  const getLinkedName = (recipe: IRecipe) => {
    if (recipe.productName) return recipe.productName
    if (recipe.modifierName) return recipe.modifierName
    if (recipe.itemName) return recipe.itemName
    return '—'
  }

  const getMarginColor = (margin: number | null | undefined) => {
    if (margin === null || margin === undefined) return 'text-muted-foreground'
    if (margin < 20) return 'text-destructive'
    if (margin < 30) return 'text-yellow-600 dark:text-yellow-500'
    return 'text-emerald-600 dark:text-emerald-500'
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Техкарты" description="Рецепты и себестоимость продуктов" />
          <CreateRecipeDialog />
        </div>
        <Separator />

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск техкарты..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Неактивные</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={linkedFilter}
            onValueChange={(v) => setLinkedFilter(v as LinkedFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Привязка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="product">Продукты</SelectItem>
              <SelectItem value="modifier">Модификаторы</SelectItem>
              <SelectItem value="semi-finished">Полуфабрикаты</SelectItem>
              <SelectItem value="unlinked">Без привязки</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !filteredRecipes?.length ? (
          <EmptyRecipesState hasFilters={Boolean(search || statusFilter !== 'all' || linkedFilter !== 'all')} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Техкарта</TableHead>
                  <TableHead>Продукт</TableHead>
                  <TableHead className="text-right">Себестоимость</TableHead>
                  <TableHead className="text-right">Маржа</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{recipe.name}</span>
                        <RecipeTypeBadge
                          productId={recipe.productId}
                          modifierId={recipe.modifierId}
                          itemId={recipe.itemId}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {getLinkedName(recipe)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(recipe.calculatedCost)}
                    </TableCell>
                    <TableCell
                      className={cn('text-right font-medium', getMarginColor(recipe.marginPercent))}
                    >
                      {recipe.marginPercent !== null && recipe.marginPercent !== undefined
                        ? `${recipe.marginPercent.toFixed(0)}%`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={recipe.isActive ? 'default' : 'secondary'}>
                        {recipe.isActive ? 'Активна' : 'Неактивна'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dashboard/inventory/recipes/${recipe.id}` as any}>Открыть</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

const EmptyRecipesState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
    <IconChefHat className="h-12 w-12 text-muted-foreground/50" />
    <h3 className="mt-4 text-lg font-semibold">
      {hasFilters ? 'Техкарты не найдены' : 'Нет техкарт'}
    </h3>
    <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
      {hasFilters
        ? 'Попробуйте изменить параметры поиска или фильтры.'
        : 'Создайте техкарты для отслеживания себестоимости и автоматического списания.'}
    </p>
    {!hasFilters && (
      <div className="mt-6">
        <CreateRecipeDialog />
      </div>
    )}
  </div>
)

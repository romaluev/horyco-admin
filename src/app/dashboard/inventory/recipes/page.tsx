'use client'

import { useState } from 'react'

import { IconSearch } from '@tabler/icons-react'

import { Heading } from '@/shared/ui/base/heading'
import { Input } from '@/shared/ui/base/input'
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
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetRecipes, RecipeTypeBadge } from '@/entities/recipe'
import { CreateRecipeDialog } from '@/features/recipe-form'

export default function RecipesPage() {
  const [search, setSearch] = useState('')

  const { data: recipes, isLoading } = useGetRecipes()

  const filteredRecipes = recipes?.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  )

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(value)

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Техкарты"
            description="Рецепты и себестоимость продуктов"
          />
          <CreateRecipeDialog />
        </div>
        <Separator />

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск техкарты..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Техкарта</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Выход</TableHead>
                  <TableHead className="text-right">Себестоимость</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filteredRecipes?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Техкарты не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.name}</TableCell>
                      <TableCell>
                        <RecipeTypeBadge
                          productId={recipe.productId}
                          modifierId={recipe.modifierId}
                          itemId={recipe.itemId}
                        />
                      </TableCell>
                      <TableCell>
                        {recipe.outputQuantity} {recipe.outputUnit || 'шт'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(recipe.calculatedCost)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={recipe.isActive ? 'default' : 'secondary'}>
                          {recipe.isActive ? 'Активна' : 'Неактивна'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" disabled>
                          Изменить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

/**
 * Recipes Page
 * Page for managing recipes (tech cards)
 */

'use client'

import { useState } from 'react'

import { IconSearch, IconChefHat } from '@tabler/icons-react'

import PageContainer from '@/shared/ui/layout/page-container'
import { Input } from '@/shared/ui/base/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Badge } from '@/shared/ui/base/badge'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useBranchStore } from '@/entities/branch'
import { useGetRecipes, RecipeCostDisplay, RecipeMarginBadge } from '@/entities/recipe'
import {
  CreateRecipeDialog,
  DeleteRecipeButton,
  DuplicateRecipeButton,
} from '@/features/recipe-form'
import { UNIT_LABELS, type InventoryUnit } from '@/shared/types/inventory'

export default function RecipesPage() {
  const { selectedBranchId } = useBranchStore()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useGetRecipes(
    { search: search || undefined },
    { enabled: !!selectedBranchId }
  )

  const recipes = data || []

  if (!selectedBranchId) {
    return (
      <PageContainer>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Выберите филиал</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Техкарты</h1>
            <p className="text-muted-foreground">
              Рецепты и технологические карты
            </p>
          </div>
          <CreateRecipeDialog branchId={selectedBranchId} />
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск техкарты..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-md border">
            <div className="text-center">
              <IconChefHat className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-muted-foreground">
                {search ? 'Техкарты не найдены' : 'Нет техкарт'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Выход: {recipe.outputQuantity}{' '}
                      {UNIT_LABELS[recipe.outputUnit as InventoryUnit] || recipe.outputUnit}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <DuplicateRecipeButton recipeId={recipe.id} />
                    <DeleteRecipeButton
                      recipeId={recipe.id}
                      recipeName={recipe.name}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ингредиентов:
                    </span>
                    <Badge variant="secondary">
                      {recipe.ingredientCount || 0}
                    </Badge>
                  </div>
                  {recipe.totalCost !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Себестоимость:
                      </span>
                      <RecipeCostDisplay cost={recipe.totalCost} />
                    </div>
                  )}
                  {recipe.linkedName && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Связан с: {recipe.linkedName}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

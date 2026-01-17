'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  IconArrowLeft,
  IconPlus,
  IconRefresh,
  IconCopy,
  IconTrash,
  IconEdit,
} from '@tabler/icons-react'

import { formatCurrency } from '@/shared/lib/format'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Badge } from '@/shared/ui/base/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
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
import PageContainer from '@/shared/ui/layout/page-container'
import BaseLoading from '@/shared/ui/base-loading'

import {
  useRecipeById,
  RecipeTypeBadge,
  useDeleteRecipe,
  useRemoveRecipeIngredient,
  useRecalculateRecipeCost,
} from '@/entities/recipe'

import {
  EditRecipeDialog,
  DuplicateRecipeDialog,
  AddIngredientDialog,
  EditIngredientDialog,
} from '@/features/recipe-workflow'

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const recipeId = Number(params.id)

  const { data: recipe, isLoading } = useRecipeById(recipeId)
  const deleteMutation = useDeleteRecipe()
  const removeIngredientMutation = useRemoveRecipeIngredient()
  const recalculateMutation = useRecalculateRecipeCost()

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)
  const [addIngredientDialogOpen, setAddIngredientDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<number | null>(null)

  const handleDelete = () => {
    deleteMutation.mutate(recipeId, {
      onSuccess: () => {
        router.push('/dashboard/inventory/recipes')
      },
    })
  }

  const handleRemoveIngredient = (ingredientId: number) => {
    removeIngredientMutation.mutate({ recipeId, ingredientId })
  }

  const handleRecalculate = () => {
    recalculateMutation.mutate(recipeId)
  }

  if (isLoading) {
    return (
      <PageContainer>
        <BaseLoading />
      </PageContainer>
    )
  }

  if (!recipe) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Техкарта не найдена</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/inventory/recipes">Назад к списку</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  // Calculate totals
  const totalIngredients = recipe.ingredients?.length ?? 0
  const totalCost =
    recipe.ingredients?.reduce((sum, ing) => sum + ing.lineCost, 0) ?? 0
  const costPerUnit = recipe.outputQuantity > 0 ? totalCost / recipe.outputQuantity : 0

  // Get the ingredient being edited
  const ingredientToEdit = recipe.ingredients?.find((ing) => ing.id === editingIngredient)

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/inventory/recipes">
                <IconArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <Heading title={recipe.name} description="Техкарта" />
                <Badge variant={recipe.isActive ? 'default' : 'secondary'}>
                  {recipe.isActive ? 'Активна' : 'Неактивна'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRecalculate}
              disabled={recalculateMutation.isPending}
            >
              <IconRefresh className="mr-2 h-4 w-4" />
              Пересчитать
            </Button>
            <Button variant="outline" onClick={() => setDuplicateDialogOpen(true)}>
              <IconCopy className="mr-2 h-4 w-4" />
              Дублировать
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
                  <AlertDialogTitle>Удалить техкарту?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Техкарта будет удалена
                    навсегда.
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

        {/* Recipe Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Название</span>
                <span className="font-medium">{recipe.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Тип</span>
                <RecipeTypeBadge
                  productId={recipe.productId}
                  modifierId={recipe.modifierId}
                  itemId={recipe.itemId}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Выход</span>
                <span className="font-medium">
                  {recipe.outputQuantity} {recipe.outputUnit || 'шт'}
                </span>
              </div>
              {recipe.prepTimeMinutes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Время приготовления</span>
                  <span className="font-medium">{recipe.prepTimeMinutes} мин</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Версия</span>
                <span className="font-medium">v{recipe.version}</span>
              </div>
              {recipe.notes && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground text-sm">Примечания:</span>
                  <p className="mt-1 text-sm">{recipe.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Себестоимость</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Расчётная себестоимость</span>
                <span className="text-xl font-bold">
                  {formatCurrency(recipe.calculatedCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">За единицу</span>
                <span className="font-medium">{formatCurrency(costPerUnit)}</span>
              </div>
              {recipe.costUpdatedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Обновлено</span>
                  <span>
                    {format(new Date(recipe.costUpdatedAt), 'dd MMM yyyy, HH:mm', {
                      locale: ru,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Создано</span>
                <span>
                  {format(new Date(recipe.createdAt), 'dd MMM yyyy', {
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
            <CardTitle>Сводка по ингредиентам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Всего ингредиентов: {totalIngredients}
                </p>
                <p className="text-sm text-muted-foreground">
                  Выход: {recipe.outputQuantity} {recipe.outputUnit || 'шт'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Итого себестоимость</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Ингредиенты</h3>
            <Button onClick={() => setAddIngredientDialogOpen(true)}>
              <IconPlus className="mr-2 h-4 w-4" />
              Добавить ингредиент
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Товар</TableHead>
                  <TableHead className="text-right">Количество</TableHead>
                  <TableHead className="text-right">Потери</TableHead>
                  <TableHead className="text-right">Цена за ед.</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!recipe.ingredients?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Нет ингредиентов
                    </TableCell>
                  </TableRow>
                ) : (
                  recipe.ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell className="text-muted-foreground">
                        {ingredient.sortOrder}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium">{ingredient.itemName}</p>
                            <p className="text-sm text-muted-foreground">
                              {ingredient.itemUnit}
                            </p>
                          </div>
                          {ingredient.isOptional && (
                            <Badge variant="outline" className="text-xs">
                              Опционально
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {ingredient.quantity} {ingredient.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {((ingredient.wasteFactor - 1) * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(ingredient.unitCost)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(ingredient.lineCost)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingIngredient(ingredient.id)}
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
                                  Удалить ингредиент?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Ингредиент &quot;{ingredient.itemName}&quot; будет
                                  удалён из техкарты.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveIngredient(ingredient.id)}
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
        </div>
      </div>

      {/* Dialogs */}
      <EditRecipeDialog
        recipe={recipe}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DuplicateRecipeDialog
        recipe={recipe}
        open={duplicateDialogOpen}
        onOpenChange={setDuplicateDialogOpen}
      />
      <AddIngredientDialog
        recipeId={recipeId}
        open={addIngredientDialogOpen}
        onOpenChange={setAddIngredientDialogOpen}
      />
      {ingredientToEdit && (
        <EditIngredientDialog
          recipeId={recipeId}
          ingredient={ingredientToEdit}
          open={!!editingIngredient}
          onOpenChange={(open) => {
            if (!open) setEditingIngredient(null)
          }}
        />
      )}
    </PageContainer>
  )
}

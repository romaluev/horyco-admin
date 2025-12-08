'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Loader2, Plus, Edit2, ChevronDown, Trash2 } from 'lucide-react'

import { getNextStep, getPreviousStep } from '@/shared/config/onboarding'
import { Button } from '@/shared/ui/base/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/base/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Input } from '@/shared/ui/base/input'
import { Textarea } from '@/shared/ui/base/textarea'
import BaseLoading from '@/shared/ui/base-loading'
import { OnboardingLayout } from '@/shared/ui/onboarding'

import {
  useGetOnboardingProgress,
  useGetDefaultProducts,
  useSubmitMenuSetup,
  useSkipStep,
  type MenuSetupRequest,
} from '@/entities/onboarding'

// Local types for frontend menu management
interface MenuProduct {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  isSelected: boolean
  preparationTime?: number
  calories?: number
  allergens?: string[]
}

interface MenuCategory {
  id: string
  name: string
  description?: string
  products: MenuProduct[]
}

export default function MenuTemplatePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  )
  const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  )
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [isNewCategory, setIsNewCategory] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedPrice, setEditedPrice] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [editedCategoryName, setEditedCategoryName] = useState('')
  const [editedCategoryDesc, setEditedCategoryDesc] = useState('')

  // Fetch onboarding progress
  const { data: progress, isLoading: isProgressLoading } =
    useGetOnboardingProgress()

  // Fetch default products based on business type from stepData
  const businessType = (
    (progress?.stepData?.business_identity as { businessType?: string })
      ?.businessType || 'restaurant'
  ) as string
  const {
    data: defaultProducts,
    isLoading: isProductsLoading,
    error: productsError,
  } = useGetDefaultProducts(businessType)

  // Transform default products to frontend format on load
  useEffect(() => {
    if (defaultProducts?.categories) {
      const transformed: MenuCategory[] = defaultProducts.categories.map(
        (cat, catIndex) => ({
          id: `category-${catIndex}`,
          name: cat.name,
          description: cat.description,
          products: cat.products.map((prod, prodIndex) => ({
            id: `product-${catIndex}-${prodIndex}`,
            name: prod.name,
            price: prod.suggestedPrice,
            description: prod.description,
            image: prod.image,
            isSelected: false,
            preparationTime: prod.preparationTime,
            calories: prod.calories,
            allergens: prod.allergens,
          })),
        })
      )
      setCategories(transformed)
    }
  }, [defaultProducts])

  // Mutations
  const { mutate: submitMenu, isPending: isSubmitting } = useSubmitMenuSetup({
    onSuccess: () => {
      const nextStep = getNextStep('menu_template')
      router.push(nextStep?.route || '/onboarding/staff-invite')
    },
  })

  const { mutate: skipMenu, isPending: isSkipping } = useSkipStep({
    onSuccess: () => {
      const nextStep = getNextStep('menu_template')
      router.push(nextStep?.route || '/onboarding/staff-invite')
    },
  })

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const handleEditProduct = (product: MenuProduct) => {
    setEditingProduct(product)
    setEditedName(product.name)
    setEditedPrice(product.price.toString())
    setEditedDescription(product.description || '')
    setIsNewProduct(false)
    setIsEditDialogOpen(true)
  }

  const handleAddProduct = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    setEditingCategory(category)
    setEditingProduct({
      id: `product-${Date.now()}`,
      name: '',
      price: 0,
      description: '',
      isSelected: true,
    })
    setEditedName('')
    setEditedPrice('0')
    setEditedDescription('')
    setIsNewProduct(true)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingProduct) return

    const updatedProduct = {
      ...editingProduct,
      name: editedName,
      price: Number(editedPrice),
      description: editedDescription,
    }

    if (isNewProduct && editingCategory) {
      // Add new product to category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                products: [...cat.products, updatedProduct],
              }
            : cat
        )
      )
    } else {
      // Edit existing product
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          products: cat.products.map((prod) =>
            prod.id === editingProduct.id ? updatedProduct : prod
          ),
        }))
      )
    }

    setIsEditDialogOpen(false)
    setEditingProduct(null)
    setEditingCategory(null)
  }

  const handleDeleteProduct = (categoryId: string, productId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              products: cat.products.filter((p) => p.id !== productId),
            }
          : cat
      )
    )
  }

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category)
    setEditedCategoryName(category.name)
    setEditedCategoryDesc(category.description || '')
    setIsNewCategory(false)
    setIsCategoryDialogOpen(true)
  }

  const handleAddCategory = () => {
    setEditingCategory({
      id: `category-${Date.now()}`,
      name: '',
      description: '',
      products: [],
    })
    setEditedCategoryName('')
    setEditedCategoryDesc('')
    setIsNewCategory(true)
    setIsCategoryDialogOpen(true)
  }

  const handleSaveCategoryEdit = () => {
    if (!editingCategory || !editedCategoryName.trim()) return

    const updated = {
      ...editingCategory,
      name: editedCategoryName,
      description: editedCategoryDesc,
    }

    if (isNewCategory) {
      setCategories((prev) => [...prev, updated])
    } else {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingCategory.id ? updated : cat))
      )
    }

    setIsCategoryDialogOpen(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
  }

  const handleSubmit = () => {
    // Prepare data: only selected products grouped by category
    const menuData: MenuSetupRequest = {
      categories: categories
        .map((cat) => ({
          name: cat.name,
          description: cat.description,
          products: cat.products
            .filter((p) => p.isSelected)
            .map((p) => ({
              name: p.name,
              price: p.price,
              description: p.description,
              image: p.image,
              preparationTime: p.preparationTime,
              calories: p.calories,
              allergens: p.allergens,
            })),
        }))
        .filter((cat) => cat.products.length > 0),
    }

    submitMenu(menuData)
  }

  const handleSkip = () => {
    skipMenu({ step: 'menu_template' })
  }

  const handleBack = () => {
    const prevStep = getPreviousStep('menu_template')
    router.push(prevStep?.route || '/onboarding/branch-setup')
  }

  const totalProducts = categories.reduce(
    (total, cat) => total + cat.products.length,
    0
  )

  if (isProgressLoading) {
    return <BaseLoading />
  }

  if (productsError && categories.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">
            Ошибка загрузки меню
          </h2>
          <p className="text-muted-foreground mt-2">
            Не удалось загрузить шаблоны меню. Попробуйте обновить страницу.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Обновить
          </Button>
        </div>
      </div>
    )
  }

  return (
    <OnboardingLayout
      currentStep="menu_template"
      completedSteps={
        progress?.completedSteps || ['business_identity', 'branch_setup']
      }
      skippedSteps={progress?.skippedSteps || []}
      title="Настройка меню"
      description="Организуйте блюда по категориям"
    >
      {/* Menu info badge */}
      {totalProducts > 0 && (
        <div className="bg-muted/50 mb-6 flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm font-medium">
            Всего блюд: {totalProducts}
          </span>
        </div>
      )}

      {/* Empty state with option to create */}
      {categories.length === 0 && !isProductsLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">Меню пусто</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Начните с создания категории, затем добавляйте блюда.
          </p>
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Создать категорию
          </Button>
        </div>
      )}

      {/* Categories with accordion */}
      {categories.length > 0 && (
        <div className="space-y-3">
          {categories.map((category) => (
            <Collapsible
              key={category.id}
              open={expandedCategories.has(category.id)}
              onOpenChange={() => toggleCategoryExpand(category.id)}
            >
              <div className="rounded-lg border">
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start gap-2 p-0 hover:bg-transparent"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedCategories.has(category.id)
                            ? 'rotate-0'
                            : '-rotate-90'
                        }`}
                      />
                      <div className="text-left">
                        <p className="font-semibold">{category.name}</p>
                        {category.description && (
                          <p className="text-muted-foreground text-xs">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm whitespace-nowrap">
                      {category.products.length}{' '}
                      {category.products.length === 1 ? 'блюдо' : 'блюд'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCategory(category)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <CollapsibleContent className="border-t p-4">
                  <div className="space-y-3">
                    {category.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          {product.description && (
                            <p className="text-muted-foreground text-sm">
                              {product.description}
                            </p>
                          )}
                          <p className="text-primary mt-1 font-semibold">
                            {new Intl.NumberFormat('ru-RU').format(
                              product.price
                            )}{' '}
                            сум
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDeleteProduct(category.id, product.id)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddProduct(category.id)}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить блюдо
                    </Button>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}

          <Button onClick={handleAddCategory} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Добавить категорию
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting || isSkipping}
        >
          Назад
        </Button>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            disabled={isSubmitting || isSkipping}
          >
            {isSkipping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Пропуск...
              </>
            ) : (
              'Пропустить'
            )}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={totalProducts === 0 || isSubmitting || isSkipping}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              `Продолжить (${totalProducts})`
            )}
          </Button>
        </div>
      </div>

      {/* Edit/Add Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewProduct ? 'Добавить блюдо' : 'Редактировать блюдо'}
            </DialogTitle>
            <DialogDescription>
              {isNewProduct
                ? 'Добавьте новое блюдо в категорию'
                : 'Измените название, цену или описание блюда'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label
                htmlFor="edit-product-name"
                className="mb-2 block text-sm font-medium"
              >
                Название *
              </label>
              <Input
                id="edit-product-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Название блюда"
              />
            </div>
            <div>
              <label
                htmlFor="edit-product-price"
                className="mb-2 block text-sm font-medium"
              >
                Цена (сум) *
              </label>
              <Input
                id="edit-product-price"
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                placeholder="25000"
              />
            </div>
            <div>
              <label
                htmlFor="edit-product-description"
                className="mb-2 block text-sm font-medium"
              >
                Описание
              </label>
              <Textarea
                id="edit-product-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Описание блюда"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editedName.trim() || !editedPrice.trim()}
            >
              {isNewProduct ? 'Добавить' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Add Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewCategory ? 'Добавить категорию' : 'Редактировать категорию'}
            </DialogTitle>
            <DialogDescription>
              {isNewCategory
                ? 'Создайте новую категорию для блюд'
                : 'Измените название или описание категории'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label
                htmlFor="edit-category-name"
                className="mb-2 block text-sm font-medium"
              >
                Название категории *
              </label>
              <Input
                id="edit-category-name"
                value={editedCategoryName}
                onChange={(e) => setEditedCategoryName(e.target.value)}
                placeholder="Например: Закуски"
              />
            </div>
            <div>
              <label
                htmlFor="edit-category-desc"
                className="mb-2 block text-sm font-medium"
              >
                Описание
              </label>
              <Textarea
                id="edit-category-desc"
                value={editedCategoryDesc}
                onChange={(e) => setEditedCategoryDesc(e.target.value)}
                placeholder="Описание категории"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCategoryDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveCategoryEdit}
              disabled={!editedCategoryName.trim()}
            >
              {isNewCategory ? 'Создать' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardingLayout>
  )
}

'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Loader2, Plus, Edit2, ChevronDown, Trash2 } from 'lucide-react'

import { getNextStep, getPreviousStep } from '@/shared/config/onboarding'
import { Button } from '@/shared/ui/base/button'
import { Checkbox } from '@/shared/ui/base/checkbox'
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
  useGetDefaultProducts,
  useSubmitMenuSetup,
  useSkipStep,
  useStepValidation,
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
  isSelected: boolean
  isExpanded: boolean
}

export default function MenuTemplatePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<MenuCategory[]>([])
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

  // Validate step access and get progress
  const { progress, isLoading: isProgressLoading } =
    useStepValidation('menu_template')

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
          isSelected: false,
          isExpanded: false,
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

  const toggleCategorySelect = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              isSelected: !cat.isSelected,
              // When selecting, also select all products
              products: cat.products.map((prod) => ({
                ...prod,
                isSelected: !cat.isSelected,
              })),
            }
          : cat
      )
    )
  }

  const toggleCategoryExpand = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              isExpanded: !cat.isExpanded,
            }
          : cat
      )
    )
  }

  const toggleProductSelect = (categoryId: string, productId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat

        const updatedProducts = cat.products.map((prod) =>
          prod.id === productId
            ? { ...prod, isSelected: !prod.isSelected }
            : prod
        )

        // Update category selection based on product selection
        const areAllSelected = updatedProducts.every((p) => p.isSelected)
        const areSomeSelected = updatedProducts.some((p) => p.isSelected)

        return {
          ...cat,
          products: updatedProducts,
          isSelected: areAllSelected || areSomeSelected,
        }
      })
    )
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
      isSelected: true,
      isExpanded: false,
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
    // Prepare data: only selected categories with selected products
    const menuData: MenuSetupRequest = {
      categories: categories
        .filter((cat) => cat.isSelected) // Only selected categories
        .map((cat) => ({
          name: cat.name,
          description: cat.description,
          products: cat.products
            .filter((p) => p.isSelected) // Only selected products
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
        .filter((cat) => cat.products.length > 0), // Ensure category has products
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

  const selectedProductsCount = categories.reduce(
    (total, cat) =>
      total + cat.products.filter((p) => p.isSelected).length,
    0
  )

  const selectedCategoriesCount = categories.filter(
    (cat) => cat.isSelected
  ).length

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
      {/* Create Category Button at Top */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          {selectedProductsCount > 0 && (
            <p className="text-sm text-muted-foreground">
              Выбрано: {selectedCategoriesCount}{' '}
              {selectedCategoriesCount === 1
                ? 'категория'
                : selectedCategoriesCount > 4
                  ? 'категорий'
                  : 'категории'}
              , {selectedProductsCount}{' '}
              {selectedProductsCount === 1
                ? 'блюдо'
                : selectedProductsCount > 4
                  ? 'блюд'
                  : 'блюда'}
            </p>
          )}
        </div>
        <Button onClick={handleAddCategory} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Создать категорию
        </Button>
      </div>

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

      {/* Categories as Cards */}
      {categories.length > 0 && (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`rounded-lg border-2 transition-all ${
                category.isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background'
              }`}
            >
              {/* Category Card Header */}
              <div className="flex items-start gap-3 p-4">
                <Checkbox
                  checked={category.isSelected}
                  onCheckedChange={() => toggleCategorySelect(category.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {category.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {category.products.filter((p) => p.isSelected).length}{' '}
                          из {category.products.length} выбрано
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleCategoryExpand(category.id)}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            category.isExpanded ? 'rotate-0' : '-rotate-90'
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid - Show when expanded */}
              {category.isExpanded && (
                <div className="border-t p-4 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {category.products.map((product) => (
                      <div
                        key={product.id}
                        className={`rounded-lg border p-3 transition-all ${
                          product.isSelected
                            ? 'border-primary bg-background'
                            : 'border-border bg-background/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={product.isSelected}
                            onCheckedChange={() =>
                              toggleProductSelect(category.id, product.id)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{product.name}</p>
                                {product.description && (
                                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                    {product.description}
                                  </p>
                                )}
                                <p className="text-primary mt-2 font-semibold">
                                  {new Intl.NumberFormat('ru-RU').format(
                                    product.price
                                  )}{' '}
                                  сум
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditProduct(product)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleDeleteProduct(category.id, product.id)
                                  }
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddProduct(category.id)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить блюдо в категорию
                  </Button>
                </div>
              )}
            </div>
          ))}
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
            disabled={selectedProductsCount === 0 || isSubmitting || isSkipping}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              `Продолжить (${selectedProductsCount})`
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

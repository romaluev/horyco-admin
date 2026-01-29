'use client'

import { useState, useEffect } from 'react'

import { Loader2, Plus, Edit2, ChevronDown, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { getNextStep, getPreviousStep } from '@/shared/config/onboarding'
import { useRouter } from '@/shared/lib/navigation'
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
import { OnboardingLayout } from '@/shared/ui/onboarding'

import {
  useGetDefaultProducts,
  useSubmitMenuSetup,
  useSkipStep,
  useStepValidation,
  type MenuSetupRequest,
} from '@/entities/onboarding/onboarding'

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
  const { t } = useTranslation('onboarding')
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
  const { progress } = useStepValidation('menu_template')

  // Fetch default products based on business type from stepData
  const businessType = ((
    progress?.stepData?.business_identity as { businessType?: string }
  )?.businessType || 'restaurant') as string
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
    (total, cat) => total + cat.products.filter((p) => p.isSelected).length,
    0
  )

  const selectedCategoriesCount = categories.filter(
    (cat) => cat.isSelected
  ).length

  if (productsError && categories.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">
            {t('pages.menuTemplate.errors.loadError')}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t('pages.menuTemplate.errors.loadErrorMessage')}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            {t('pages.menuTemplate.errors.refresh')}
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
      title={t('pages.menuTemplate.title')}
      description={t('pages.menuTemplate.description')}
    >
      {/* Create Category Button at Top */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          {selectedProductsCount > 0 && (
            <p className="text-muted-foreground text-sm">
              {t('pages.menuTemplate.selected')} {selectedCategoriesCount}{' '}
              {selectedCategoriesCount === 1
                ? t('pages.menuTemplate.category')
                : selectedCategoriesCount > 4
                  ? t('pages.menuTemplate.categories_4plus')
                  : t('pages.menuTemplate.categories')}
              , {selectedProductsCount}{' '}
              {selectedProductsCount === 1
                ? t('pages.menuTemplate.dish')
                : selectedProductsCount > 4
                  ? t('pages.menuTemplate.dishes_4plus')
                  : t('pages.menuTemplate.dishes')}
            </p>
          )}
        </div>
        <Button onClick={handleAddCategory} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          {t('pages.menuTemplate.createCategory')}
        </Button>
      </div>

      {/* Empty state with option to create */}
      {categories.length === 0 && !isProductsLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">
            {t('pages.menuTemplate.emptyState.title')}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {t('pages.menuTemplate.emptyState.description')}
          </p>
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" />
            {t('pages.menuTemplate.createCategory')}
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
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      {category.description && (
                        <p className="text-muted-foreground mt-1 text-sm">
                          {category.description}
                        </p>
                      )}
                      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                        <span>
                          {category.products.filter((p) => p.isSelected).length}{' '}
                          {t('pages.menuTemplate.categoryCard.selected')}{' '}
                          {category.products.length}
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
                        <Trash2 className="text-destructive h-4 w-4" />
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
                <div className="bg-muted/30 border-t p-4">
                  <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
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
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium">{product.name}</p>
                                {product.description && (
                                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
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
                                  <Trash2 className="text-destructive h-3 w-3" />
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
                    {t('pages.menuTemplate.addDishButton')}
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
          {t('pages.menuTemplate.buttons.back')}
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
                {t('pages.menuTemplate.buttons.skip_loading')}
              </>
            ) : (
              t('pages.menuTemplate.buttons.skip')
            )}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedProductsCount === 0 || isSubmitting || isSkipping}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('pages.menuTemplate.buttons.saving')}
              </>
            ) : (
              `${t('pages.menuTemplate.buttons.continue')} (${selectedProductsCount})`
            )}
          </Button>
        </div>
      </div>

      {/* Edit/Add Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewProduct
                ? t('pages.menuTemplate.productDialog.add')
                : t('pages.menuTemplate.productDialog.edit')}
            </DialogTitle>
            <DialogDescription>
              {isNewProduct
                ? t('pages.menuTemplate.productDialog.addDescription')
                : t('pages.menuTemplate.productDialog.editDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label
                htmlFor="edit-product-name"
                className="mb-2 block text-sm font-medium"
              >
                {t('pages.menuTemplate.productDialog.name')}
              </label>
              <Input
                id="edit-product-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder={t(
                  'pages.menuTemplate.productDialog.namePlaceholder'
                )}
              />
            </div>
            <div>
              <label
                htmlFor="edit-product-price"
                className="mb-2 block text-sm font-medium"
              >
                {t('pages.menuTemplate.productDialog.price')}
              </label>
              <Input
                id="edit-product-price"
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                placeholder={t(
                  'pages.menuTemplate.productDialog.pricePlaceholder'
                )}
              />
            </div>
            <div>
              <label
                htmlFor="edit-product-description"
                className="mb-2 block text-sm font-medium"
              >
                {t('pages.menuTemplate.productDialog.description')}
              </label>
              <Textarea
                id="edit-product-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder={t(
                  'pages.menuTemplate.productDialog.descriptionPlaceholder'
                )}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              {t('pages.menuTemplate.productDialog.cancel')}
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editedName.trim() || !editedPrice.trim()}
            >
              {isNewProduct
                ? t('pages.menuTemplate.productDialog.add_button')
                : t('pages.menuTemplate.productDialog.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Add Category Dialog */}
      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewCategory
                ? t('pages.menuTemplate.categoryDialog.add')
                : t('pages.menuTemplate.categoryDialog.edit')}
            </DialogTitle>
            <DialogDescription>
              {isNewCategory
                ? t('pages.menuTemplate.categoryDialog.addDescription')
                : t('pages.menuTemplate.categoryDialog.editDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label
                htmlFor="edit-category-name"
                className="mb-2 block text-sm font-medium"
              >
                {t('pages.menuTemplate.categoryDialog.name')}
              </label>
              <Input
                id="edit-category-name"
                value={editedCategoryName}
                onChange={(e) => setEditedCategoryName(e.target.value)}
                placeholder={t(
                  'pages.menuTemplate.categoryDialog.namePlaceholder'
                )}
              />
            </div>
            <div>
              <label
                htmlFor="edit-category-desc"
                className="mb-2 block text-sm font-medium"
              >
                {t('pages.menuTemplate.categoryDialog.description')}
              </label>
              <Textarea
                id="edit-category-desc"
                value={editedCategoryDesc}
                onChange={(e) => setEditedCategoryDesc(e.target.value)}
                placeholder={t(
                  'pages.menuTemplate.categoryDialog.descriptionPlaceholder'
                )}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCategoryDialogOpen(false)}
            >
              {t('pages.menuTemplate.categoryDialog.cancel')}
            </Button>
            <Button
              onClick={handleSaveCategoryEdit}
              disabled={!editedCategoryName.trim()}
            >
              {isNewCategory
                ? t('pages.menuTemplate.categoryDialog.create')
                : t('pages.menuTemplate.categoryDialog.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardingLayout>
  )
}

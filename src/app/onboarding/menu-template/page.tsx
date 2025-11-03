'use client'

import { useState, useEffect } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Loader2, Check, Edit2, X } from 'lucide-react'

import { getNextStep, getPreviousStep } from '@/shared/config/onboarding'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/base/dialog'
import { Input } from '@/shared/ui/base/input'
import { Textarea } from '@/shared/ui/base/textarea'
import BaseLoading from '@/shared/ui/base-loading'
import { OnboardingLayout } from '@/shared/ui/onboarding'

import {
  useGetOnboardingProgress,
  useGetDefaultProducts,
  useSubmitMenuSetup,
  useSkipMenuSetup,
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
  const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedPrice, setEditedPrice] = useState('')
  const [editedDescription, setEditedDescription] = useState('')

  // Fetch onboarding progress
  const { data: progress, isLoading: isProgressLoading } =
    useGetOnboardingProgress()

  // Fetch default products based on business type
  const businessType = progress?.stepData?.businessType || 'restaurant'
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

  const { mutate: skipMenu, isPending: isSkipping } = useSkipMenuSetup({
    onSuccess: () => {
      const nextStep = getNextStep('menu_template')
      router.push(nextStep?.route || '/onboarding/staff-invite')
    },
  })

  const handleToggleProduct = (categoryId: string, productId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              products: cat.products.map((prod) =>
                prod.id === productId
                  ? { ...prod, isSelected: !prod.isSelected }
                  : prod
              ),
            }
          : cat
      )
    )
  }

  const handleEditProduct = (product: MenuProduct) => {
    setEditingProduct(product)
    setEditedName(product.name)
    setEditedPrice(product.price.toString())
    setEditedDescription(product.description || '')
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingProduct) return

    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        products: cat.products.map((prod) =>
          prod.id === editingProduct.id
            ? {
                ...prod,
                name: editedName,
                price: Number(editedPrice),
                description: editedDescription,
              }
            : prod
        ),
      }))
    )

    setIsEditDialogOpen(false)
    setEditingProduct(null)
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
    skipMenu()
  }

  const handleBack = () => {
    const prevStep = getPreviousStep('menu_template')
    router.push(prevStep?.route || '/onboarding/branch-setup')
  }

  const selectedCount = categories.reduce(
    (total, cat) => total + cat.products.filter((p) => p.isSelected).length,
    0
  )

  if (isProgressLoading || isProductsLoading) {
    return <BaseLoading />
  }

  if (productsError) {
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

  // Empty state when no categories available
  const hasNoProducts = categories.length === 0

  return (
    <OnboardingLayout
      currentStep={progress?.currentStep || 'menu_template'}
      completedSteps={
        progress?.completedSteps || ['business_identity', 'branch_setup']
      }
      title="Настройка меню"
      description="Выберите популярные блюда для вашего заведения"
    >
      {/* Selected count badge */}
      {selectedCount > 0 && (
        <div className="bg-muted/50 mb-4 flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm font-medium">
            Выбрано блюд: {selectedCount}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setCategories((prev) =>
                prev.map((cat) => ({
                  ...cat,
                  products: cat.products.map((p) => ({
                    ...p,
                    isSelected: false,
                  })),
                }))
              )
            }
          >
            Сбросить всё
          </Button>
        </div>
      )}

      {/* Empty state */}
      {hasNoProducts && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">
            Нет доступных шаблонов меню
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            К сожалению, для вашего типа бизнеса пока нет готовых шаблонов. Вы
            можете пропустить этот шаг и создать меню позже.
          </p>
        </div>
      )}

      {/* Categories with products */}
      {!hasNoProducts && (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <span className="text-muted-foreground text-sm">
                  {category.products.filter((p) => p.isSelected).length} /{' '}
                  {category.products.length}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.products.map((product) => (
                  <Card
                    key={product.id}
                    className={`relative overflow-hidden p-0 transition-all ${
                      product.isSelected ? 'ring-primary ring-2' : ''
                    }`}
                  >
                    {product.isSelected && (
                      <div className="bg-primary absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="bg-muted relative h-40 w-full overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : null}
                    </div>

                    <CardHeader className="space-y-2 p-4">
                      <CardTitle className="line-clamp-1 text-base">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">
                        {product.description}
                      </CardDescription>
                      <div className="text-primary text-lg font-bold">
                        {new Intl.NumberFormat('ru-RU').format(product.price)}{' '}
                        сум
                      </div>
                    </CardHeader>

                    <CardContent className="flex gap-2 p-4 pt-0">
                      <Button
                        size="sm"
                        variant={product.isSelected ? 'secondary' : 'default'}
                        className="flex-1"
                        onClick={() =>
                          handleToggleProduct(category.id, product.id)
                        }
                      >
                        {product.isSelected ? (
                          <>
                            <X className="mr-1 h-3 w-3" />
                            Убрать
                          </>
                        ) : (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Выбрать
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
            disabled={selectedCount === 0 || isSubmitting || isSkipping}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              `Продолжить (${selectedCount})`
            )}
          </Button>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать блюдо</DialogTitle>
            <DialogDescription>
              Измените название, цену или описание блюда
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label
                htmlFor="edit-product-name"
                className="mb-2 block text-sm font-medium"
              >
                Название
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
                Цена (сум)
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
            <Button onClick={handleSaveEdit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardingLayout>
  )
}

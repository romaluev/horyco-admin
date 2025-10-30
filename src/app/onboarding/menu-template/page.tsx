'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGetOnboardingProgress, useSkipStep } from '@/entities/onboarding';
import { OnboardingLayout } from '@/shared/ui/onboarding';
import BaseLoading from '@/shared/ui/base-loading';
import { Button } from '@/shared/ui/base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import { Input } from '@/shared/ui/base/input';
import { Textarea } from '@/shared/ui/base/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/ui/base/dialog';
import { Loader2, Check, Edit2, X } from 'lucide-react';
import { getNextStep, getPreviousStep } from '@/shared/config/onboarding';
import {
  MOCK_POPULAR_MENU,
  type MockCategory,
  type MockProduct
} from '@/shared/lib/mock-menu-data';

export default function MenuTemplatePage() {
  const router = useRouter();
  const [categories, setCategories] =
    useState<MockCategory[]>(MOCK_POPULAR_MENU);
  const [editingProduct, setEditingProduct] = useState<MockProduct | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch onboarding progress
  const { data: progress, isLoading: progressLoading } =
    useGetOnboardingProgress();

  const { mutate: skipStep, isPending: isSkipping } = useSkipStep({
    onSuccess: () => {
      const nextStep = getNextStep('MENU_TEMPLATE');
      router.push(nextStep?.route || '/onboarding/staff-invite');
    }
  });

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
              )
            }
          : cat
      )
    );
  };

  const handleEditProduct = (product: MockProduct) => {
    setEditingProduct(product);
    setEditedName(product.name);
    setEditedPrice(product.price.toString());
    setEditedDescription(product.description || '');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;

    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        products: cat.products.map((prod) =>
          prod.id === editingProduct.id
            ? {
                ...prod,
                name: editedName,
                price: Number(editedPrice),
                description: editedDescription
              }
            : prod
        )
      }))
    );

    setEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Prepare data: only selected products grouped by category
    const selectedMenu = categories
      .map((cat) => ({
        categoryId: cat.id,
        categoryName: cat.name,
        products: cat.products
          .filter((p) => p.isSelected)
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description
          }))
      }))
      .filter((cat) => cat.products.length > 0);

    // Mock API call - in real implementation, send to backend
    console.log('Submitting menu:', selectedMenu);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);

    // Navigate to next step
    const nextStep = getNextStep('MENU_TEMPLATE');
    router.push(nextStep?.route || '/onboarding/staff-invite');
  };

  const handleSkip = () => {
    skipStep({
      step: 'MENU_TEMPLATE',
      reason: 'Создам меню позже'
    });
  };

  const handleBack = () => {
    const prevStep = getPreviousStep('MENU_TEMPLATE');
    router.push(prevStep?.route || '/onboarding/branch-setup');
  };

  const selectedCount = categories.reduce(
    (total, cat) => total + cat.products.filter((p) => p.isSelected).length,
    0
  );

  if (progressLoading) {
    return <BaseLoading />;
  }

  return (
    <OnboardingLayout
      currentStep={progress?.currentStep || 'MENU_TEMPLATE'}
      completedSteps={
        progress?.completedSteps || ['BUSINESS_INFO_VERIFIED', 'BRANCH_SETUP']
      }
      title='Настройка меню'
      description='Выберите популярные блюда для вашего заведения'
    >
      {/* Selected count badge */}
      {selectedCount > 0 && (
        <div className='bg-muted/50 mb-4 flex items-center justify-between rounded-lg border p-3'>
          <span className='text-sm font-medium'>
            Выбрано блюд: {selectedCount}
          </span>
          <Button
            size='sm'
            variant='ghost'
            onClick={() =>
              setCategories((prev) =>
                prev.map((cat) => ({
                  ...cat,
                  products: cat.products.map((p) => ({
                    ...p,
                    isSelected: false
                  }))
                }))
              )
            }
          >
            Сбросить всё
          </Button>
        </div>
      )}

      {/* Categories with products */}
      <div className='space-y-8'>
        {categories.map((category) => (
          <div key={category.id}>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>{category.name}</h2>
              <span className='text-muted-foreground text-sm'>
                {category.products.filter((p) => p.isSelected).length} /{' '}
                {category.products.length}
              </span>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {category.products.map((product) => (
                <Card
                  key={product.id}
                  className={`relative overflow-hidden transition-all ${
                    product.isSelected ? 'ring-primary ring-2' : ''
                  }`}
                >
                  {product.isSelected && (
                    <div className='bg-primary absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full'>
                      <Check className='h-4 w-4 text-white' />
                    </div>
                  )}

                  {/* Product Image */}
                  <div className='bg-muted relative h-40 w-full overflow-hidden'>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                    ) : (
                      <div className='bg-muted flex h-full w-full items-center justify-center'>
                        <span className='text-muted-foreground text-4xl'>
                          🍽️
                        </span>
                      </div>
                    )}
                  </div>

                  <CardHeader className='space-y-2 p-4'>
                    <CardTitle className='line-clamp-1 text-base'>
                      {product.name}
                    </CardTitle>
                    <CardDescription className='line-clamp-2 text-xs'>
                      {product.description}
                    </CardDescription>
                    <div className='text-primary text-lg font-bold'>
                      {new Intl.NumberFormat('ru-RU').format(product.price)} сум
                    </div>
                  </CardHeader>

                  <CardContent className='flex gap-2 p-4 pt-0'>
                    <Button
                      size='sm'
                      variant={product.isSelected ? 'secondary' : 'default'}
                      className='flex-1'
                      onClick={() =>
                        handleToggleProduct(category.id, product.id)
                      }
                    >
                      {product.isSelected ? (
                        <>
                          <X className='mr-1 h-3 w-3' />
                          Убрать
                        </>
                      ) : (
                        <>
                          <Check className='mr-1 h-3 w-3' />
                          Выбрать
                        </>
                      )}
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit2 className='h-3 w-3' />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className='mt-8 flex justify-between border-t pt-6'>
        <Button
          type='button'
          variant='outline'
          onClick={handleBack}
          disabled={isSubmitting || isSkipping}
        >
          Назад
        </Button>
        <div className='flex gap-4'>
          <Button
            type='button'
            variant='ghost'
            onClick={handleSkip}
            disabled={isSubmitting || isSkipping}
          >
            {isSkipping ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Сохранение...
              </>
            ) : (
              `Продолжить (${selectedCount})`
            )}
          </Button>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать блюдо</DialogTitle>
            <DialogDescription>
              Измените название, цену или описание блюда
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div>
              <label className='mb-2 block text-sm font-medium'>Название</label>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder='Название блюда'
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium'>
                Цена (сум)
              </label>
              <Input
                type='number'
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                placeholder='25000'
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium'>Описание</label>
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder='Описание блюда'
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardingLayout>
  );
}

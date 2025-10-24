'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onboardingApi, MenuTemplate } from '@/entities/onboarding';
import { OnboardingLayout } from '@/shared/ui/onboarding';
import { Button } from '@/shared/ui/base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import { Alert, AlertDescription } from '@/shared/ui/base/alert';
import { Badge } from '@/shared/ui/base/badge';
import { Skeleton } from '@/shared/ui/base/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/base/dialog';
import { ScrollArea } from '@/shared/ui/base/scroll-area';
import { AlertCircle, Loader2, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function MenuTemplatePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<MenuTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    currentStep: 'MENU_TEMPLATE',
    completedSteps: [
      'REGISTRATION_COMPLETE',
      'BUSINESS_INFO_VERIFIED',
      'BRANCH_SETUP'
    ]
  });

  useEffect(() => {
    // TODO: Uncomment when API is ready
    // const fetchData = async () => {
    //   try {
    //     setIsLoading(true);
    //     const [progressData, templatesData] = await Promise.all([
    //       onboardingApi.getProgress(),
    //       onboardingApi.getMenuTemplates()
    //     ]);
    //
    //     setProgress({
    //       currentStep: progressData.currentStep,
    //       completedSteps: progressData.completedSteps
    //     });
    //     setTemplates(templatesData);
    //   } catch (err: any) {
    //     setError(
    //       err.response?.data?.message || 'Не удалось загрузить шаблоны'
    //     );
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchData();

    // TEMPORARY: Use mock data
    setIsLoading(true);
    setTimeout(() => {
      setTemplates([
        {
          id: 1,
          name: 'Итальянская пиццерия',
          businessType: 'pizzeria',
          description:
            'Классическое меню итальянской пиццерии с пастой и салатами',
          categoriesCount: 5,
          productsCount: 32,
          categories: [
            { name: 'Пиццы', count: 12 },
            { name: 'Паста', count: 8 },
            { name: 'Салаты', count: 6 },
            { name: 'Десерты', count: 4 },
            { name: 'Напитки', count: 2 }
          ]
        },
        {
          id: 2,
          name: 'Узбекская кухня',
          businessType: 'restaurant',
          description: 'Традиционные узбекские блюда',
          categoriesCount: 6,
          productsCount: 28,
          categories: [
            { name: 'Плов', count: 5 },
            { name: 'Лагман', count: 4 },
            { name: 'Самса', count: 6 },
            { name: 'Шашлыки', count: 8 },
            { name: 'Салаты', count: 3 },
            { name: 'Напитки', count: 2 }
          ]
        },
        {
          id: 3,
          name: 'Кофейня',
          businessType: 'coffee_shop',
          description: 'Базовое меню кофейни',
          categoriesCount: 4,
          productsCount: 25,
          categories: [
            { name: 'Кофе', count: 10 },
            { name: 'Чай', count: 5 },
            { name: 'Выпечка', count: 8 },
            { name: 'Десерты', count: 2 }
          ]
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSubmit = async () => {
    if (!selectedTemplate) {
      toast.error('Выберите шаблон меню');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // TODO: Uncomment when API is ready
      // await onboardingApi.submitMenuTemplate({
      //   templateId: selectedTemplate,
      //   replaceExisting: false
      // });

      // TEMPORARY: Just simulate saving and navigate
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success('Меню успешно создано');
      router.push('/onboarding/payment-setup');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Не удалось применить шаблон. Попробуйте снова.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      setIsSubmitting(true);

      // TODO: Uncomment when API is ready
      // await onboardingApi.skipStep({
      //   step: 'MENU_TEMPLATE',
      //   reason: 'Создам меню позже'
      // });

      // TEMPORARY: Just navigate
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast.info('Шаг пропущен');
      router.push('/onboarding/payment-setup');
    } catch (err: any) {
      toast.error('Не удалось пропустить шаг');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={progress.currentStep}
      completedSteps={progress.completedSteps}
      title='Выберите готовое меню'
      description='Используйте шаблон для быстрого старта или создайте меню с нуля'
    >
      {error && (
        <Alert variant='destructive' className='mb-6'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-full' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-32 w-full' />
              </CardContent>
              <CardFooter>
                <Skeleton className='h-10 w-full' />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className='py-8 text-center'>
            <p className='text-muted-foreground'>
              Нет доступных шаблонов. Вы можете создать меню вручную позже.
            </p>
            <Button className='mt-4' onClick={handleSkip}>
              Создать меню позже
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id ? 'ring-primary ring-2' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-lg'>{template.name}</CardTitle>
                      <CardDescription className='mt-1'>
                        {template.description}
                      </CardDescription>
                    </div>
                    {selectedTemplate === template.id && (
                      <Check className='text-primary h-5 w-5' />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm'>
                      <Badge variant='secondary'>
                        {template.categoriesCount} категорий
                      </Badge>
                      <Badge variant='secondary'>
                        {template.productsCount} продуктов
                      </Badge>
                    </div>

                    {template.categories && template.categories.length > 0 && (
                      <div className='text-muted-foreground mt-3 text-sm'>
                        <p className='mb-1 font-medium'>Включает:</p>
                        <ul className='list-inside list-disc space-y-1'>
                          {template.categories.slice(0, 3).map((cat) => (
                            <li key={cat.name}>
                              {cat.name} ({cat.count})
                            </li>
                          ))}
                          {template.categories.length > 3 && (
                            <li>и ещё {template.categories.length - 3}...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className='flex gap-2'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className='mr-2 h-4 w-4' />
                        Просмотр
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-2xl'>
                      <DialogHeader>
                        <DialogTitle>{template.name}</DialogTitle>
                        <DialogDescription>
                          {template.description}
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className='mt-4 max-h-[400px]'>
                        <div className='space-y-4'>
                          {template.categories?.map((category) => (
                            <div key={category.name}>
                              <h4 className='font-medium'>
                                {category.name} ({category.count} позиций)
                              </h4>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size='sm'
                    className='flex-1'
                    variant={
                      selectedTemplate === template.id ? 'default' : 'outline'
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template.id);
                    }}
                  >
                    {selectedTemplate === template.id ? 'Выбрано' : 'Выбрать'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className='mt-8 flex justify-between'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/onboarding/branch-setup')}
              disabled={isSubmitting}
            >
              Назад
            </Button>
            <div className='flex gap-4'>
              <Button
                type='button'
                variant='ghost'
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Создать своё меню
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Применение...
                  </>
                ) : (
                  'Далее'
                )}
              </Button>
            </div>
          </div>

          <Alert className='mt-6'>
            <AlertDescription>
              Вы сможете отредактировать меню после завершения настройки
            </AlertDescription>
          </Alert>
        </>
      )}
    </OnboardingLayout>
  );
}

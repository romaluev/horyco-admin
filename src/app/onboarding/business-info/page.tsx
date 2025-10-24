'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { onboardingApi } from '@/entities/onboarding';
import { OnboardingLayout } from '@/shared/ui/onboarding';
import { Button } from '@/shared/ui/base/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import { Input } from '@/shared/ui/base/input';
import { Textarea } from '@/shared/ui/base/textarea';
import { Alert, AlertDescription } from '@/shared/ui/base/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const businessInfoSchema = z.object({
  businessType: z.string().min(1, { message: 'Выберите тип заведения' }),
  description: z.string().max(500).optional(),
  address: z.string().min(10, { message: 'Введите полный адрес' }),
  website: z
    .string()
    .url({ message: 'Введите корректный URL' })
    .optional()
    .or(z.literal('')),
  regionId: z.string().optional(),
  districtId: z.string().optional()
});

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

const BUSINESS_TYPES = [
  { value: 'coffee_shop', label: 'Кофейня' },
  { value: 'restaurant', label: 'Ресторан' },
  { value: 'pizzeria', label: 'Пиццерия' },
  { value: 'fast_food', label: 'Фаст-фуд' },
  { value: 'cafe', label: 'Кафе' },
  { value: 'sushi_bar', label: 'Суши-бар' },
  { value: 'bakery', label: 'Пекарня' },
  { value: 'bar', label: 'Бар' }
];

export default function BusinessInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    currentStep: 'BUSINESS_INFO_VERIFIED',
    completedSteps: ['REGISTRATION_COMPLETE']
  });

  const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessType: '',
      description: '',
      address: '',
      website: '',
      regionId: '',
      districtId: ''
    }
  });

  // TODO: Uncomment when API is ready
  // Fetch current progress
  // useEffect(() => {
  //   const fetchProgress = async () => {
  //     try {
  //       const progressData = await onboardingApi.getProgress();
  //       setProgress({
  //         currentStep: progressData.currentStep,
  //         completedSteps: progressData.completedSteps
  //       });
  //     } catch (err) {
  //       console.error('Failed to fetch progress:', err);
  //     }
  //   };
  //   fetchProgress();
  // }, []);

  const onSubmit = async (data: BusinessInfoFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Uncomment when API is ready
      // await onboardingApi.submitBusinessInfo({
      //   businessType: data.businessType,
      //   description: data.description,
      //   address: data.address,
      //   website: data.website,
      //   regionId: data.regionId ? parseInt(data.regionId) : undefined,
      //   districtId: data.districtId ? parseInt(data.districtId) : undefined
      // });

      // TEMPORARY: Just simulate saving and navigate
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success('Информация о бизнесе сохранена');
      router.push('/onboarding/branch-setup');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Не удалось сохранить информацию. Попробуйте снова.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={progress.currentStep}
      completedSteps={progress.completedSteps}
      title='Расскажите о вашем бизнесе'
      description='Эта информация поможет нам настроить систему под ваши потребности'
    >
      <Card>
        <CardHeader>
          <CardTitle>Информация о заведении</CardTitle>
          <CardDescription>
            Заполните основные данные о вашем ресторане
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-6'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='businessType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип заведения *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Выберите тип' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Это поможет подобрать подходящий шаблон меню
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Опишите вашу кухню, концепцию, особенности заведения...'
                        className='min-h-[100px] resize-none'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Максимум 500 символов (необязательно)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='г. Ташкент, ул. Навои 15'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Веб-сайт</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://example.com'
                        type='url'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>Необязательно</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Назад
                </Button>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Сохранение...
                    </>
                  ) : (
                    'Далее'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}

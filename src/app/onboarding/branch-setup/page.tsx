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
import { Input } from '@/shared/ui/base/input';
import { Switch } from '@/shared/ui/base/switch';
import { TimePicker } from '@/shared/ui/base/time-picker';
import { Alert, AlertDescription } from '@/shared/ui/base/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const timeSchema = z.object({
  open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Формат: HH:MM'
  }),
  close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Формат: HH:MM'
  }),
  isClosed: z.boolean().optional()
});

const branchSetupSchema = z.object({
  branchName: z
    .string()
    .min(3, { message: 'Название должно содержать минимум 3 символа' })
    .max(100),
  address: z.string().min(10, { message: 'Введите полный адрес' }),
  monday: timeSchema.optional(),
  tuesday: timeSchema.optional(),
  wednesday: timeSchema.optional(),
  thursday: timeSchema.optional(),
  friday: timeSchema.optional(),
  saturday: timeSchema.optional(),
  sunday: timeSchema.optional(),
  dineInEnabled: z.boolean(),
  takeawayEnabled: z.boolean(),
  deliveryEnabled: z.boolean()
});

type BranchSetupFormValues = z.infer<typeof branchSetupSchema>;

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Понедельник' },
  { key: 'tuesday', label: 'Вторник' },
  { key: 'wednesday', label: 'Среда' },
  { key: 'thursday', label: 'Четверг' },
  { key: 'friday', label: 'Пятница' },
  { key: 'saturday', label: 'Суббота' },
  { key: 'sunday', label: 'Воскресенье' }
];

export default function BranchSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    currentStep: 'BRANCH_SETUP',
    completedSteps: ['REGISTRATION_COMPLETE', 'BUSINESS_INFO_VERIFIED']
  });

  const form = useForm<BranchSetupFormValues>({
    resolver: zodResolver(branchSetupSchema),
    defaultValues: {
      branchName: '',
      address: '',
      monday: { open: '09:00', close: '23:00', isClosed: false },
      tuesday: { open: '09:00', close: '23:00', isClosed: false },
      wednesday: { open: '09:00', close: '23:00', isClosed: false },
      thursday: { open: '09:00', close: '23:00', isClosed: false },
      friday: { open: '09:00', close: '01:00', isClosed: false },
      saturday: { open: '10:00', close: '01:00', isClosed: false },
      sunday: { open: '10:00', close: '23:00', isClosed: false },
      dineInEnabled: true,
      takeawayEnabled: true,
      deliveryEnabled: false
    }
  });

  // TODO: Uncomment when API is ready
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

  const onSubmit = async (data: BranchSetupFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Uncomment when API is ready
      // const businessHours = {
      //   monday: data.monday,
      //   tuesday: data.tuesday,
      //   wednesday: data.wednesday,
      //   thursday: data.thursday,
      //   friday: data.friday,
      //   saturday: data.saturday,
      //   sunday: data.sunday
      // };
      //
      // await onboardingApi.submitBranchSetup({
      //   branchName: data.branchName,
      //   address: data.address,
      //   businessHours,
      //   dineInEnabled: data.dineInEnabled,
      //   takeawayEnabled: data.takeawayEnabled,
      //   deliveryEnabled: data.deliveryEnabled
      // });

      // TEMPORARY: Just simulate saving and navigate
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success('Филиал настроен');
      router.push('/onboarding/menu-template');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Не удалось сохранить настройки. Попробуйте снова.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={progress.currentStep}
      completedSteps={progress.completedSteps}
      title='Настройте ваш филиал'
      description='Укажите название, адрес и режим работы'
    >
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
          <CardDescription>
            Настройте параметры вашего первого филиала
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
                name='branchName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название филиала *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Например: Центральный филиал'
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
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='г. Ташкент, пр. Амира Темура 10'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Hours */}
              <div className='space-y-4'>
                <div>
                  <h3 className='mb-2 text-sm font-medium'>Режим работы</h3>
                  <p className='text-muted-foreground text-sm'>
                    Укажите часы работы для каждого дня недели
                  </p>
                </div>

                {DAYS_OF_WEEK.map((day) => {
                  const isClosed = form.watch(`${day.key}.isClosed` as any);

                  return (
                    <div key={day.key} className='flex items-center gap-4'>
                      <div className='w-32 text-sm'>{day.label}</div>
                      <FormField
                        control={form.control}
                        name={`${day.key}.open` as any}
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormControl>
                              <TimePicker
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isLoading || isClosed}
                                placeholder='Открытие'
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <span className='text-muted-foreground'>—</span>
                      <FormField
                        control={form.control}
                        name={`${day.key}.close` as any}
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormControl>
                              <TimePicker
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isLoading || isClosed}
                                placeholder='Закрытие'
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`${day.key}.isClosed` as any}
                        render={({ field }) => (
                          <FormItem className='flex items-center space-x-2'>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormLabel className='!mt-0 text-sm font-normal'>
                              Выходной
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Service Types */}
              <div className='space-y-4'>
                <div>
                  <h3 className='mb-2 text-sm font-medium'>
                    Типы обслуживания
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Выберите доступные способы обслуживания клиентов
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name='dineInEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Обслуживание в зале (Dine-in)
                        </FormLabel>
                        <FormDescription>
                          Управление столами и обслуживание официантами
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='takeawayEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          На вынос (Takeaway)
                        </FormLabel>
                        <FormDescription>
                          Заказы для самовывоза клиентами
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='deliveryEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Доставка (Delivery)
                        </FormLabel>
                        <FormDescription>
                          Доставка заказов курьерами
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-end gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push('/onboarding/business-info')}
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

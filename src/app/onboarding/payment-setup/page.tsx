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
import { Alert, AlertDescription } from '@/shared/ui/base/alert';
import { AlertCircle, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const paymentSetupSchema = z.object({
  cashEnabled: z.boolean(),
  cardEnabled: z.boolean(),
  paymeEnabled: z.boolean(),
  paymeMerchantId: z.string().optional(),
  paymeSecretKey: z.string().optional(),
  clickEnabled: z.boolean(),
  clickMerchantId: z.string().optional(),
  clickServiceId: z.string().optional(),
  clickSecretKey: z.string().optional()
});

type PaymentSetupFormValues = z.infer<typeof paymentSetupSchema>;

export default function PaymentSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    currentStep: 'PAYMENT_SETUP',
    completedSteps: [
      'REGISTRATION_COMPLETE',
      'BUSINESS_INFO_VERIFIED',
      'BRANCH_SETUP',
      'MENU_TEMPLATE'
    ]
  });

  const form = useForm<PaymentSetupFormValues>({
    resolver: zodResolver(paymentSetupSchema),
    defaultValues: {
      cashEnabled: true,
      cardEnabled: true,
      paymeEnabled: false,
      paymeMerchantId: '',
      paymeSecretKey: '',
      clickEnabled: false,
      clickMerchantId: '',
      clickServiceId: '',
      clickSecretKey: ''
    }
  });

  const paymeEnabled = form.watch('paymeEnabled');
  const clickEnabled = form.watch('clickEnabled');

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

  const onSubmit = async (data: PaymentSetupFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Uncomment when API is ready
      // await onboardingApi.submitPaymentSetup({
      //   cashEnabled: data.cashEnabled,
      //   cardEnabled: data.cardEnabled,
      //   paymeMerchantId: data.paymeEnabled ? data.paymeMerchantId : undefined,
      //   paymeSecretKey: data.paymeEnabled ? data.paymeSecretKey : undefined,
      //   clickMerchantId: data.clickEnabled ? data.clickMerchantId : undefined,
      //   clickServiceId: data.clickEnabled ? data.clickServiceId : undefined,
      //   clickSecretKey: data.clickEnabled ? data.clickSecretKey : undefined
      // });

      // TEMPORARY: Just simulate saving and navigate
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success('Способы оплаты настроены');
      router.push('/onboarding/staff-invite');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Не удалось сохранить настройки. Попробуйте снова.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      setIsLoading(true);

      // TODO: Uncomment when API is ready
      // await onboardingApi.skipStep({
      //   step: 'PAYMENT_SETUP',
      //   reason: 'Настрою позже'
      // });

      // TEMPORARY: Just navigate
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast.info('Шаг пропущен');
      router.push('/onboarding/staff-invite');
    } catch (err: any) {
      toast.error('Не удалось пропустить шаг');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={progress.currentStep}
      completedSteps={progress.completedSteps}
      title='Настройте способы оплаты'
      description='Подключите платёжные системы для приёма онлайн-платежей'
    >
      <Alert className='mb-6'>
        <Info className='h-4 w-4' />
        <AlertDescription>
          Этот шаг необязательный. Вы можете настроить платёжные методы позже в
          настройках системы.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Способы оплаты</CardTitle>
          <CardDescription>
            Выберите доступные методы оплаты для ваших клиентов
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
              {/* Basic Payment Methods */}
              <div className='space-y-4'>
                <h3 className='text-sm font-medium'>Базовые методы</h3>

                <FormField
                  control={form.control}
                  name='cashEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>Наличные</FormLabel>
                        <FormDescription>
                          Принимать оплату наличными в кассе
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
                  name='cardEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Банковская карта (терминал)
                        </FormLabel>
                        <FormDescription>
                          Оплата через POS-терминал
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

              {/* Payme Integration */}
              <div className='space-y-4 border-t pt-4'>
                <FormField
                  control={form.control}
                  name='paymeEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>Payme</FormLabel>
                        <FormDescription>
                          Онлайн-платежи через Payme
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

                {paymeEnabled && (
                  <div className='ml-7 space-y-4 rounded-lg border p-4'>
                    <FormField
                      control={form.control}
                      name='paymeMerchantId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Merchant ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='123456789'
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
                      name='paymeSecretKey'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <Input
                              type='password'
                              placeholder='••••••••'
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Click Integration */}
              <div className='space-y-4 border-t pt-4'>
                <FormField
                  control={form.control}
                  name='clickEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>Click</FormLabel>
                        <FormDescription>
                          Онлайн-платежи через Click
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

                {clickEnabled && (
                  <div className='ml-7 space-y-4 rounded-lg border p-4'>
                    <FormField
                      control={form.control}
                      name='clickMerchantId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Merchant ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='987654'
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
                      name='clickServiceId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='12345'
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
                      name='clickSecretKey'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <Input
                              type='password'
                              placeholder='••••••••'
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <div className='flex justify-between pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push('/onboarding/menu-template')}
                  disabled={isLoading}
                >
                  Назад
                </Button>
                <div className='flex gap-4'>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={handleSkip}
                    disabled={isLoading}
                  >
                    Пропустить
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
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}

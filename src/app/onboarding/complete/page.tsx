'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  onboardingApi,
  CompleteOnboardingResponse
} from '@/entities/onboarding';
import { OnboardingLayout } from '@/shared/ui/onboarding';
import { Button } from '@/shared/ui/base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import { Alert, AlertDescription } from '@/shared/ui/base/alert';
import { Badge } from '@/shared/ui/base/badge';
import { Skeleton } from '@/shared/ui/base/skeleton';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  PartyPopper,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function CompletePage() {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionData, setCompletionData] =
    useState<CompleteOnboardingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    currentStep: 'GO_LIVE',
    completedSteps: [
      'REGISTRATION_COMPLETE',
      'BUSINESS_INFO_VERIFIED',
      'BRANCH_SETUP',
      'MENU_TEMPLATE',
      'PAYMENT_SETUP',
      'STAFF_INVITED'
    ]
  });

  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        setIsCompleting(true);

        // TODO: Uncomment when API is ready
        // // Fetch progress first
        // const progressData = await onboardingApi.getProgress();
        // setProgress({
        //   currentStep: progressData.currentStep,
        //   completedSteps: progressData.completedSteps
        // });
        //
        // // Complete onboarding
        // const response = await onboardingApi.complete();
        // setCompletionData(response);

        // TEMPORARY: Use mock data
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setCompletionData({
          success: true,
          message: 'Поздравляем! Система готова к работе',
          tenant: {
            id: 1,
            businessName: 'Ваш Ресторан',
            status: 'active',
            activatedAt: new Date().toISOString()
          },
          onboardingProgress: {
            currentStep: 'GO_LIVE',
            completedSteps: [
              'REGISTRATION_COMPLETE',
              'BUSINESS_INFO_VERIFIED',
              'BRANCH_SETUP',
              'MENU_TEMPLATE',
              'PAYMENT_SETUP',
              'STAFF_INVITED'
            ],
            completionPercentage: 100,
            isCompleted: true
          },
          nextSteps: [
            {
              title: 'Настройте меню под себя',
              link: '/dashboard/products',
              priority: 'high'
            },
            {
              title: 'Добавьте сотрудников',
              link: '/dashboard/employee',
              priority: 'medium'
            },
            {
              title: 'Проверьте настройки филиала',
              link: '/dashboard/branches',
              priority: 'medium'
            }
          ]
        });

        setIsCompleted(true);
        toast.success('Поздравляем! Система готова к работе');
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            'Не удалось завершить настройку. Попробуйте снова.'
        );
      } finally {
        setIsCompleting(false);
      }
    };

    completeOnboarding();
  }, []);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (error) {
    return (
      <OnboardingLayout
        currentStep={progress.currentStep}
        completedSteps={progress.completedSteps}
        title='Ошибка завершения'
        description='Произошла ошибка при завершении настройки'
      >
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className='mt-6 flex justify-center gap-4'>
          <Button
            variant='outline'
            onClick={() => router.push('/onboarding/staff-invite')}
          >
            Назад
          </Button>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </OnboardingLayout>
    );
  }

  if (isCompleting || !isCompleted) {
    return (
      <OnboardingLayout
        currentStep={progress.currentStep}
        completedSteps={progress.completedSteps}
        title='Завершение настройки'
        description='Подождите, система активируется...'
      >
        <Card>
          <CardContent className='py-12'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              <Loader2 className='text-primary h-12 w-12 animate-spin' />
              <p className='text-muted-foreground'>Финализация настроек...</p>
            </div>
          </CardContent>
        </Card>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      currentStep='GO_LIVE'
      completedSteps={[
        'REGISTRATION_COMPLETE',
        'BUSINESS_INFO_VERIFIED',
        'BRANCH_SETUP',
        'MENU_TEMPLATE',
        'PAYMENT_SETUP',
        'STAFF_INVITED',
        'GO_LIVE'
      ]}
      title='Поздравляем!'
      description='Ваш ресторан готов к запуску'
    >
      <div className='space-y-6'>
        {/* Success Banner */}
        <Card className='border-primary bg-primary/5'>
          <CardHeader>
            <div className='flex items-center gap-4'>
              <div className='bg-primary/10 rounded-full p-3'>
                <PartyPopper className='text-primary h-8 w-8' />
              </div>
              <div>
                <CardTitle className='text-2xl'>Все готово!</CardTitle>
                <CardDescription className='mt-1 text-base'>
                  Система активирована и готова к приёму заказов
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Completion Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Что было настроено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {completionData?.onboardingProgress.completedSteps.map((step) => (
                <div key={step} className='flex items-center gap-3'>
                  <CheckCircle2 className='text-primary h-5 w-5' />
                  <span className='capitalize'>
                    {step === 'REGISTRATION_COMPLETE' && 'Регистрация'}
                    {step === 'BUSINESS_INFO_VERIFIED' &&
                      'Информация о бизнесе'}
                    {step === 'BRANCH_SETUP' && 'Настройка филиала'}
                    {step === 'MENU_TEMPLATE' && 'Шаблон меню'}
                    {step === 'PAYMENT_SETUP' && 'Способы оплаты'}
                    {step === 'STAFF_INVITED' && 'Приглашение персонала'}
                  </span>
                </div>
              ))}

              {completionData?.onboardingProgress.skippedSteps &&
                completionData.onboardingProgress.skippedSteps.length > 0 && (
                  <div className='border-t pt-3'>
                    <p className='text-muted-foreground mb-2 text-sm font-medium'>
                      Пропущенные шаги:
                    </p>
                    {completionData.onboardingProgress.skippedSteps.map(
                      (step) => (
                        <div key={step} className='flex items-center gap-3'>
                          <XCircle className='text-muted-foreground h-5 w-5' />
                          <span className='text-muted-foreground capitalize'>
                            {step}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Следующие шаги</CardTitle>
            <CardDescription>
              Рекомендуем выполнить эти действия для полноценной работы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {completionData?.nextSteps?.map((nextStep, index) => (
                <div
                  key={index}
                  className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-medium'>{nextStep.title}</h4>
                      <Badge
                        variant={
                          nextStep.priority === 'high'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {nextStep.priority === 'high'
                          ? 'Важно'
                          : 'Рекомендуется'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => router.push(nextStep.link)}
                  >
                    Перейти
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className='flex justify-center'>
          <Button size='lg' onClick={handleGoToDashboard}>
            Начать работу
            <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}

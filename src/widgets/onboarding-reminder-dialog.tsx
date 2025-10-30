'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { AlertCircle, X } from 'lucide-react';

import { Button } from '@/shared/ui/base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';

import { useGetOnboardingProgress } from '@/entities/onboarding';

export function OnboardingReminderDialog() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: progress, isLoading } = useGetOnboardingProgress();

  useEffect(() => {
    // Check if user dismissed the dialog in this session
    if (isDismissed || isLoading) return;

    // Show dialog if onboarding is not completed
    if (progress && !progress.isCompleted) {
      setIsVisible(true);
    }
  }, [progress, isLoading, isDismissed]);

  const handleStartOnboarding = () => {
    setIsVisible(false);

    // Get the current step or start from beginning
    const route = progress?.currentStep
      ? getRouteForStep(progress.currentStep)
      : '/onboarding/business-info';

    router.push(route);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible) return null;

  return (
    <div className='fixed right-4 top-20 z-50 w-80 animate-in slide-in-from-right'>
      <Card className='border-warning shadow-lg'>
        <CardHeader className='relative pb-3'>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-2 top-2 h-6 w-6'
            onClick={handleDismiss}
          >
            <X className='h-4 w-4' />
          </Button>
          <div className='flex items-start gap-3'>
            <AlertCircle className='text-warning mt-0.5 h-5 w-5' />
            <div>
              <CardTitle className='text-base'>
                Настройка не завершена
              </CardTitle>
              <CardDescription className='mt-1'>
                Завершите настройку для полного доступа к системе
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          <p className='text-muted-foreground text-sm'>
            Вы пропустили шаги настройки. Завершите их для активации всех
            функций системы.
          </p>
          <div className='flex gap-2'>
            <Button
              onClick={handleStartOnboarding}
              size='sm'
              className='flex-1'
            >
              Продолжить настройку
            </Button>
            <Button
              onClick={handleDismiss}
              variant='ghost'
              size='sm'
              className='flex-1'
            >
              Позже
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to map step to route
function getRouteForStep(step: string): string {
  const stepRoutes: Record<string, string> = {
    REGISTRATION_COMPLETE: '/onboarding/business-info',
    BUSINESS_INFO_VERIFIED: '/onboarding/branch-setup',
    BRANCH_SETUP: '/onboarding/menu-template',
    MENU_TEMPLATE: '/onboarding/staff-invite',
    STAFF_INVITED: '/onboarding/complete',
    GO_LIVE: '/dashboard'
  };

  return stepRoutes[step] || '/onboarding/business-info';
}

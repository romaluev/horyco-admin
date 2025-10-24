'use client';

import { ReactNode } from 'react';
import { OnboardingProgress } from './onboarding-progress';
import Image from 'next/image';
import logo from '@/shared/assets/logo.png';

const ONBOARDING_STEPS = [
  {
    id: 'REGISTRATION_COMPLETE',
    name: 'Регистрация',
    description: 'Создание аккаунта'
  },
  {
    id: 'BUSINESS_INFO_VERIFIED',
    name: 'О бизнесе',
    description: 'Информация о ресторане'
  },
  {
    id: 'BRANCH_SETUP',
    name: 'Филиал',
    description: 'Настройка филиала'
  },
  {
    id: 'MENU_TEMPLATE',
    name: 'Меню',
    description: 'Выбор шаблона'
  },
  {
    id: 'PAYMENT_SETUP',
    name: 'Оплата',
    description: 'Способы оплаты'
  },
  {
    id: 'STAFF_INVITED',
    name: 'Персонал',
    description: 'Приглашение команды'
  },
  {
    id: 'GO_LIVE',
    name: 'Готово',
    description: 'Запуск системы'
  }
];

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: string;
  completedSteps: string[];
  title: string;
  description?: string;
}

export function OnboardingLayout({
  children,
  currentStep,
  completedSteps,
  title,
  description
}: OnboardingLayoutProps) {
  const progress = Math.round(
    (completedSteps.length / ONBOARDING_STEPS.length) * 100
  );

  return (
    <div className='bg-background flex h-screen flex-col'>
      {/* Header with Logo and Progress */}
      <div className='bg-muted/30 border-b'>
        <div className='container mx-auto px-4 py-4'>
          <div className='mb-2 flex items-start justify-between gap-12'>
            {/* Logo - Left */}
            <div className='flex shrink-0 items-center gap-2'>
              <Image
                className='!h-8 !w-8 overflow-hidden rounded-lg'
                src={logo}
                alt='OshXona'
              />
              <h1 className='text-xl font-semibold text-[#023055]'>OshXona</h1>
            </div>

            {/* Progress Bar - Right (expanded) */}
            <div className='mb-4 max-w-[30rem] flex-1'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-medium'>Прогресс онбординга</span>
                <span className='text-sm font-medium'>{progress}%</span>
              </div>
              <div className='bg-secondary h-2 w-full overflow-hidden rounded-full'>
                <div
                  className='bg-primary h-full transition-all duration-500'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <OnboardingProgress
            steps={ONBOARDING_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className='flex-1 overflow-y-auto'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mx-auto max-w-3xl'>
            <div className='mb-8'>
              <h2 className='text-3xl font-bold'>{title}</h2>
              {description && (
                <p className='text-muted-foreground mt-2'>{description}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

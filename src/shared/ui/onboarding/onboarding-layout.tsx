'use client'

import Image from 'next/image'

import logo from '@/shared/assets/logo.png'

import { OnboardingProgress } from './onboarding-progress'

import type { ReactNode } from 'react'

// Only visible onboarding steps (registration_complete is auto-completed, not shown in UI)
// Step IDs match backend response format
const ONBOARDING_STEPS = [
  {
    id: 'business_identity',
    name: 'О бизнесе',
    description: 'Информация о ресторане',
  },
  {
    id: 'branch_setup',
    name: 'Филиал',
    description: 'Настройка филиала',
  },
  {
    id: 'menu_template',
    name: 'Меню',
    description: 'Выбор шаблона',
  },
  {
    id: 'staff_invited',
    name: 'Персонал',
    description: 'Приглашение команды',
  },
  {
    id: 'go_live',
    name: 'Готово',
    description: 'Запуск системы',
  },
]

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: string
  completedSteps: string[]
  skippedSteps?: string[]
  title: string
  description?: string
}

export function OnboardingLayout({
  children,
  currentStep,
  completedSteps,
  skippedSteps = [],
  title,
  description,
}: OnboardingLayoutProps) {
  return (
    <div className="bg-background flex h-screen flex-col">
      <div className="bg-muted/30 shrink-0 border-b">
        <div className="container mx-auto px-2 py-3">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Image
              className="w-32 overflow-hidden rounded-lg"
              src={logo}
              alt="Horyco Admin"
            />
          </div>

          {/* Progress Steps */}
          <OnboardingProgress
            steps={ONBOARDING_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            skippedSteps={skippedSteps}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">{title}</h2>
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

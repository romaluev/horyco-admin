'use client'

import Image from 'next/image'

import logo from '@/shared/assets/logo.png'

import { OnboardingProgress } from './onboarding-progress'

import type { ReactNode } from 'react'

// Only visible onboarding steps (REGISTRATION_COMPLETE is auto-completed, not shown in UI)
const ONBOARDING_STEPS = [
  {
    id: 'BUSINESS_INFO_VERIFIED',
    name: 'О бизнесе',
    description: 'Информация о ресторане',
  },
  {
    id: 'BRANCH_SETUP',
    name: 'Филиал',
    description: 'Настройка филиала',
  },
  {
    id: 'MENU_TEMPLATE',
    name: 'Меню',
    description: 'Выбор шаблона',
  },
  {
    id: 'STAFF_INVITED',
    name: 'Персонал',
    description: 'Приглашение команды',
  },
  {
    id: 'GO_LIVE',
    name: 'Готово',
    description: 'Запуск системы',
  },
]

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: string
  completedSteps: string[]
  title: string
  description?: string
}

export function OnboardingLayout({
  children,
  currentStep,
  completedSteps,
  title,
  description,
}: OnboardingLayoutProps) {
  return (
    <div className="bg-background flex h-screen flex-col">
      <div className="bg-muted/30 shrink-0 border-b">
        <div className="container mx-auto px-2 py-3">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Image
              className="!h-10 !w-10 overflow-hidden rounded-lg"
              src={logo}
              alt="Horyco Admin"
            />
            <h1 className="text-2xl font-semibold text-[#023055]">Horyco Admin</h1>
          </div>

          {/* Progress Steps */}
          <OnboardingProgress
            steps={ONBOARDING_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
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

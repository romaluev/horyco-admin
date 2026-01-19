import type { OnboardingStep } from '@/entities/onboarding/onboarding/model/types'

/**
 * Onboarding configuration and constants
 * Centralized configuration for the onboarding flow
 */

// Step configuration with routes and metadata
export interface StepConfig {
  id: OnboardingStep
  route: string
  title: string
  description: string
  isOptional: boolean
  order: number
}

// Only include steps that should be shown in the UI
// REGISTRATION_COMPLETE is auto-completed and should not be shown
export const ONBOARDING_STEPS: StepConfig[] = [
  {
    id: 'business_identity',
    route: '/onboarding/business-info',
    title: 'Информация о бизнесе',
    description: 'Основные данные о заведении',
    isOptional: false,
    order: 0,
  },
  {
    id: 'branch_setup',
    route: '/onboarding/branch-setup',
    title: 'Настройка филиала',
    description: 'График работы и услуги',
    isOptional: false,
    order: 1,
  },
  {
    id: 'menu_template',
    route: '/onboarding/menu-template',
    title: 'Шаблон меню',
    description: 'Выбор готового меню',
    isOptional: true,
    order: 2,
  },
  {
    id: 'staff_invited',
    route: '/onboarding/staff-invite',
    title: 'Приглашение сотрудников',
    description: 'Добавление команды',
    isOptional: true,
    order: 3,
  },
  {
    id: 'go_live',
    route: '/onboarding/complete',
    title: 'Завершение',
    description: 'Готово к использованию',
    isOptional: false,
    order: 4,
  },
]

/**
 * Get step configuration by ID
 */
export const getStepConfig = (
  stepId: OnboardingStep
): StepConfig | undefined => {
  return ONBOARDING_STEPS.find((step) => step.id === stepId)
}

/**
 * Get step route by ID
 */
export const getStepRoute = (stepId: OnboardingStep): string => {
  const step = getStepConfig(stepId)
  return step?.route || '/onboarding/business-info'
}

/**
 * Get next step in the flow
 */
export const getNextStep = (
  currentStepId: OnboardingStep
): StepConfig | undefined => {
  const currentStep = getStepConfig(currentStepId)
  if (!currentStep) return undefined

  return ONBOARDING_STEPS.find((step) => step.order === currentStep.order + 1)
}

/**
 * Get previous step in the flow
 */
export const getPreviousStep = (
  currentStepId: OnboardingStep
): StepConfig | undefined => {
  const currentStep = getStepConfig(currentStepId)
  if (!currentStep) return undefined

  return ONBOARDING_STEPS.find((step) => step.order === currentStep.order - 1)
}

/**
 * Calculate completion percentage based on completed steps
 * Formula from docs: (completedSteps.length / totalRequiredSteps.length) * 100
 */
export const calculateCompletionPercentage = (
  completedSteps: OnboardingStep[]
): number => {
  const totalSteps = ONBOARDING_STEPS.length
  const completed = completedSteps.length
  return Math.round((completed / totalSteps) * 100)
}

/**
 * Check if a step is completed
 */
export const isStepCompleted = (
  stepId: OnboardingStep,
  completedSteps: OnboardingStep[]
): boolean => {
  return completedSteps.includes(stepId)
}

/**
 * Check if a step is accessible (previous required steps are completed)
 */
export const isStepAccessible = (
  stepId: OnboardingStep,
  completedSteps: OnboardingStep[]
): boolean => {
  const step = getStepConfig(stepId)
  if (!step) return false

  // First step is always accessible
  if (step.order === 0) return true

  // Check if all previous required steps are completed
  const previousRequiredSteps = ONBOARDING_STEPS.filter(
    (s) => s.order < step.order && !s.isOptional
  )

  return previousRequiredSteps.every((s) =>
    isStepCompleted(s.id, completedSteps)
  )
}

/**
 * Get steps for display in progress component
 */
export const getProgressSteps = () => {
  return ONBOARDING_STEPS.map((step) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    route: step.route,
    isOptional: step.isOptional,
  }))
}

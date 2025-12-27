import { useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { ONBOARDING_STEPS, getStepRoute } from '@/shared/config/onboarding'

import { useGetOnboardingProgress } from './queries'

import type { OnboardingStep } from './types'

/**
 * Hook to validate onboarding step access and redirect if needed
 * Ensures users cannot skip required steps or access steps out of order
 *
 * Validation runs silently in background - no loading states shown
 * Content renders immediately, redirect happens if validation fails
 *
 * @param currentStep - The step ID of the current page
 * @param options - Configuration options
 */
export const useStepValidation = (
  currentStep: OnboardingStep,
  options?: {
    /**
     * If true, skip validation (useful for edge cases)
     */
    skipValidation?: boolean
  }
) => {
  const router = useRouter()
  const {
    data: progress,
    isLoading,
    isFetching,
  } = useGetOnboardingProgress()

  // Track if we've already validated to prevent loops
  const hasValidatedRef = useRef(false)

  // Reset validation state when step changes
  useEffect(() => {
    hasValidatedRef.current = false
  }, [currentStep])

  useEffect(() => {
    // Skip validation if explicitly disabled
    if (options?.skipValidation) {
      return
    }

    // Wait for data to be loaded and not fetching
    if (isLoading || isFetching || !progress) {
      return
    }

    // Prevent multiple validations
    if (hasValidatedRef.current) {
      return
    }

    // Mark as validated
    hasValidatedRef.current = true

    // If onboarding is already completed, redirect to dashboard
    if (progress.isCompleted) {
      router.replace('/dashboard')
      return
    }

    const completedSteps = progress.completedSteps || []
    const skippedSteps = progress.skippedSteps || []

    // Find current step config
    const currentStepConfig = ONBOARDING_STEPS.find(
      (step) => step.id === currentStep
    )

    if (!currentStepConfig) {
      // Invalid step, redirect to first step
      router.replace('/onboarding/business-info')
      return
    }

    // Check if current step is accessible
    // A step is accessible if all previous required steps are completed
    const previousRequiredSteps = ONBOARDING_STEPS.filter(
      (step) => step.order < currentStepConfig.order && !step.isOptional
    )

    const hasIncompleteRequiredStep = previousRequiredSteps.some(
      (step) => !completedSteps.includes(step.id)
    )

    if (hasIncompleteRequiredStep) {
      // Find the first incomplete required step and redirect there
      const firstIncompleteStep = ONBOARDING_STEPS.find((step) => {
        if (step.isOptional) return false
        return !completedSteps.includes(step.id)
      })

      if (firstIncompleteStep) {
        const route = getStepRoute(firstIncompleteStep.id)
        router.replace(route)
        return
      }
    }

    // For the go_live/complete step, validate all steps are done
    if (currentStep === 'go_live') {
      const incompleteStep = ONBOARDING_STEPS.find((step) => {
        if (step.id === 'go_live') return false

        if (!step.isOptional) {
          return !completedSteps.includes(step.id)
        }

        // Optional steps must be either completed or skipped
        return (
          !completedSteps.includes(step.id) && !skippedSteps.includes(step.id)
        )
      })

      if (incompleteStep) {
        const route = getStepRoute(incompleteStep.id)
        router.replace(route)
      }
    }
  }, [
    currentStep,
    progress,
    isLoading,
    isFetching,
    router,
    options?.skipValidation,
  ])

  // Only return actual data loading state, not validation state
  // This allows content to render immediately
  return {
    isLoading,
    progress,
    isValid:
      !isLoading &&
      progress !== undefined &&
      !progress.isCompleted &&
      ONBOARDING_STEPS.some((step) => step.id === currentStep),
  }
}

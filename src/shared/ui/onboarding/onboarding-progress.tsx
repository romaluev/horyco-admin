'use client'

import { useRouter } from 'next/navigation'

import { Check, Slash } from 'lucide-react'

import { getStepConfig } from '@/shared/config/onboarding'
import { cn } from '@/shared/lib/utils'

interface OnboardingStep {
  id: string
  name: string
  description: string
  route?: string
}

interface OnboardingProgressProps {
  steps: OnboardingStep[]
  currentStep: string
  completedSteps: string[]
  skippedSteps?: string[]
  className?: string
}

export function OnboardingProgress({
  steps,
  currentStep,
  completedSteps,
  skippedSteps = [],
  className,
}: OnboardingProgressProps) {
  const router = useRouter()

  const handleStepClick = (step: OnboardingStep) => {
    const isCompleted = completedSteps.includes(step.id)
    const isCurrent = step.id === currentStep

    // Only allow clicking on completed steps to edit them
    if (isCompleted && !isCurrent) {
      const stepConfig = getStepConfig(step.id)
      if (stepConfig?.route) {
        router.push(stepConfig.route)
      }
    }
  }

  const getStepIcon = (
    isPassed: boolean,
    isSkipped: boolean,
    isCurrent: boolean,
    stepIdx: number
  ) => {
    if (isPassed) return <Check className="h-4 w-4" />
    if (isSkipped) return <Slash className="h-4 w-4" />
    if (isCurrent) return <span className="font-bold">{stepIdx + 1}</span>
    return <span>{stepIdx + 1}</span>
  }

  const getStepStyles = (
    isPassed: boolean,
    isCurrent: boolean,
    isSkipped: boolean,
    isUpcoming: boolean
  ) => {
    const baseClasses =
      'mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all'

    if (isPassed)
      return cn(
        baseClasses,
        'bg-primary/90 text-primary-foreground ring-2 ring-primary/20'
      )
    if (isCurrent)
      return cn(
        baseClasses,
        'border-primary bg-[#fff6f6] text-primary ring-primary border-2 ring-2'
      )
    if (isSkipped)
      return cn(baseClasses, 'bg-muted text-muted-foreground')
    if (isUpcoming)
      return cn(
        baseClasses,
        'border-muted-foreground/30 bg-background text-muted-foreground border-2'
      )
    return baseClasses
  }

  return (
    <div className={cn('w-full', className)}>
      <nav aria-label="Progress">
        <ol className="relative flex items-start justify-between">
          {steps.map((step, stepIdx) => {
            const isCompleted = completedSteps.includes(step.id)
            const isSkipped = skippedSteps.includes(step.id)
            const isCurrent = step.id === currentStep
            const isPassed = isCompleted && !isCurrent && !isSkipped
            const isUpcoming = !isCompleted && !isCurrent && !isSkipped
            const isClickable = (isCompleted || isSkipped) && !isCurrent

            return (
              <li
                key={step.id}
                className="relative flex flex-1 flex-col items-center"
              >
                <button
                  onClick={() => handleStepClick(step)}
                  disabled={!isClickable}
                  title={
                    isClickable ? 'Нажмите, чтобы редактировать' : undefined
                  }
                  className={cn(
                    'group relative z-10 flex flex-col items-center transition-all',
                    isClickable && 'cursor-pointer',
                    !isClickable && 'cursor-default'
                  )}
                >
                  <div className="relative">
                    <span
                      className={getStepStyles(
                        isPassed,
                        isCurrent,
                        isSkipped,
                        isUpcoming
                      )}
                    >
                      {getStepIcon(isPassed, isSkipped, isCurrent, stepIdx)}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-center text-sm font-medium transition-colors',
                      isPassed && 'text-foreground group-hover:text-primary',
                      isCurrent && 'text-primary font-bold',
                      isSkipped && 'text-muted-foreground line-through',
                      isUpcoming && 'text-muted-foreground'
                    )}
                  >
                    {step.name}
                  </span>
                </button>

                {stepIdx < steps.length - 1 && (
                  <div className="absolute top-4 left-1/2 flex h-0.5 w-full items-center">
                    <div
                      className={cn(
                        'h-full w-full transition-colors',
                        isCompleted || isSkipped
                          ? 'bg-primary/60'
                          : 'bg-muted'
                      )}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

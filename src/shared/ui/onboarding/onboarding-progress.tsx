'use client';

import { Check, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { getStepConfig } from '@/shared/config/onboarding';

interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  route?: string;
}

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  currentStep: string;
  completedSteps: string[];
  className?: string;
}

export function OnboardingProgress({
  steps,
  currentStep,
  completedSteps,
  className
}: OnboardingProgressProps) {
  const router = useRouter();

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;

  const handleStepClick = (step: OnboardingStep) => {
    const isCompleted = completedSteps.includes(step.id);
    const isCurrent = step.id === currentStep;

    // Only allow clicking on completed steps to edit them
    if (isCompleted && !isCurrent) {
      const stepConfig = getStepConfig(step.id as any);
      if (stepConfig?.route) {
        router.push(stepConfig.route);
      }
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <nav aria-label='Progress'>
        <ol role='list' className='relative flex items-start justify-between'>
          {steps.map((step, stepIdx) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isUpcoming = !isCompleted && !isCurrent;
            const isClickable = isCompleted && !isCurrent;

            return (
              <li
                key={step.id}
                className='relative flex flex-1 flex-col items-center'
              >
                <button
                  onClick={() => handleStepClick(step)}
                  disabled={!isClickable}
                  title={isClickable ? 'Нажмите, чтобы редактировать' : undefined}
                  className={cn(
                    'group relative z-10 flex flex-col items-center transition-all',
                    isClickable &&
                      'cursor-pointer',
                    !isClickable && 'cursor-default'
                  )}
                >
                  <div className='relative'>
                    <span
                      className={cn(
                        'mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all',
                        isCompleted &&
                          'bg-primary text-primary-foreground',
                        isCurrent &&
                          'border-primary bg-background text-primary border-2',
                        isUpcoming &&
                          'border-muted-foreground/30 bg-background text-muted-foreground border-2'
                      )}
                    >
                      {isCompleted ? (
                        <Check className='h-4 w-4' />
                      ) : (
                        <span>{stepIdx + 1}</span>
                      )}
                    </span>
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      'text-center text-sm font-medium transition-colors',
                      isCompleted && 'text-foreground group-hover:text-primary',
                      isCurrent && 'text-primary font-semibold',
                      isUpcoming && 'text-muted-foreground'
                    )}
                  >
                    {step.name}
                  </span>
                </button>

                {/* Connecting line (not for last step) */}
                {stepIdx < steps.length - 1 && (
                  <div className='absolute top-4 left-1/2 flex h-0.5 w-full items-center'>
                    <div
                      className={cn(
                        'h-full w-full transition-colors',
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

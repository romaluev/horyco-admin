'use client';

import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface OnboardingStep {
  id: string;
  name: string;
  description: string;
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
  return (
    <div className={cn('w-full', className)}>
      {/* Steps */}
      <nav aria-label='Progress'>
        <ol role='list' className='flex space-x-4'>
          {steps.map((step, stepIdx) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isUpcoming = !isCompleted && !isCurrent;

            return (
              <li key={step.id} className='flex-1'>
                <div className={cn('group flex flex-col pb-0 pl-0')}>
                  <span className='flex items-center text-sm font-medium'>
                    <span
                      className={cn(
                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs',
                        isCompleted && 'bg-primary text-primary-foreground',
                        isCurrent && 'border-primary text-primary border-2',
                        isUpcoming &&
                          'border-muted text-muted-foreground border-2'
                      )}
                    >
                      {isCompleted ? (
                        <Check className='h-3 w-3' />
                      ) : (
                        <span>{stepIdx + 1}</span>
                      )}
                    </span>
                    <span className='ml-2'>{step.name}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

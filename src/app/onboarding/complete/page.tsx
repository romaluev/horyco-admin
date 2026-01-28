'use client'

import { useEffect } from 'react'

import { useRouter } from '@/shared/lib/navigation'

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  PartyPopper,
  XCircle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import BaseLoading from '@/shared/ui/base-loading'
import { OnboardingLayout } from '@/shared/ui/onboarding'

import {
  useCompleteOnboarding,
  useStepValidation,
} from '@/entities/onboarding/onboarding'

export default function CompletePage() {
  const router = useRouter()
  const { t } = useTranslation('onboarding')

  // Validate step access but skip automatic redirect on completion
  // The complete page manages its own success state and user-initiated redirect
  const { isLoading: isProgressLoading, progress } = useStepValidation(
    'go_live',
    { skipCompletedRedirect: true }
  )

  const {
    mutate: completeOnboarding,
    data: completionData,
    isPending: isCompleting,
    isSuccess: isCompleted,
    isError,
    error,
  } = useCompleteOnboarding()

  // Trigger completion once validation passes
  useEffect(() => {
    if (!isProgressLoading && progress && !isCompleting && !isCompleted && !isError) {
      completeOnboarding()
    }
  }, [
    progress,
    isProgressLoading,
    completeOnboarding,
    isCompleting,
    isCompleted,
    isError,
  ])

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <OnboardingLayout
      currentStep="go_live"
      completedSteps={progress?.completedSteps || []}
      skippedSteps={progress?.skippedSteps || []}
      title={
        isError
          ? t('pages.complete.titleError')
          : isCompleted
            ? t('pages.complete.titleSuccess')
            : t('pages.complete.title')
      }
      description={
        isError
          ? t('pages.complete.descriptionError')
          : isCompleted
            ? t('pages.complete.descriptionSuccess')
            : t('pages.complete.descriptionLoading')
      }
    >
      {isProgressLoading || isCompleting ? (
        <BaseLoading />
      ) : isError ? (
        <>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ||
                t('pages.complete.buttons.error')}
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/onboarding/staff-invite')}
            >
              {t('pages.complete.buttons.back')}
            </Button>
            <Button onClick={() => completeOnboarding()}>
              {t('pages.complete.buttons.retry')}
            </Button>
          </div>
        </>
      ) : isCompleted && completionData ? (
        <div className="space-y-6">
          {/* Success Banner */}
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <PartyPopper className="text-primary h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t('pages.complete.successBanner.title')}</CardTitle>
                  <CardDescription className="mt-1 text-base">
                    {t('pages.complete.successBanner.description')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Completion Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.complete.completionSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completionData?.completedSteps.map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="capitalize">
                      {t(`pages.complete.steps.${step}`)}
                    </span>
                  </div>
                ))}

                {completionData?.skippedSteps &&
                  completionData.skippedSteps.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-muted-foreground mb-2 text-sm font-medium">
                        {t('pages.complete.skippedSteps')}
                      </p>
                      {completionData.skippedSteps.map((step) => (
                        <div key={step} className="flex items-center gap-3">
                          <XCircle className="text-muted-foreground h-5 w-5" />
                          <span className="text-muted-foreground capitalize">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.complete.nextSteps')}</CardTitle>
              <CardDescription>
                {t('pages.complete.nextStepsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completionData?.nextSteps?.map((nextStep, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{nextStep.title}</h4>
                        <Badge
                          variant={
                            nextStep.priority === 'high'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {nextStep.priority === 'high'
                            ? t('pages.complete.priority.high')
                            : t('pages.complete.priority.recommended')}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(nextStep.link)}
                    >
                      {t('pages.complete.goToNextStep')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button size="lg" onClick={handleGoToDashboard}>
              {t('pages.complete.buttons.start')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : null}
    </OnboardingLayout>
  )
}

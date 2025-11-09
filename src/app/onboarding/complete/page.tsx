'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  PartyPopper,
  XCircle,
} from 'lucide-react'

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
  useGetOnboardingProgress,
  useCompleteOnboarding,
} from '@/entities/onboarding'

export default function CompletePage() {
  const router = useRouter()
  const { data: progress, isLoading: isProgressLoading } =
    useGetOnboardingProgress()

  const {
    mutate: completeOnboarding,
    data: completionData,
    isPending: isCompleting,
    isSuccess: isCompleted,
    isError,
    error,
  } = useCompleteOnboarding()

  useEffect(() => {
    if (!isCompleting && !isCompleted && !isError) {
      completeOnboarding()
    }
  }, [completeOnboarding, isCompleting, isCompleted, isError])

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
          ? 'Ошибка завершения'
          : isCompleted
            ? 'Поздравляем!'
            : 'Завершение настройки'
      }
      description={
        isError
          ? 'Произошла ошибка при завершении настройки'
          : isCompleted
            ? 'Ваш ресторан готов к запуску'
            : 'Подождите, система активируется...'
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
                'Не удалось завершить настройку. Попробуйте снова.'}
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/onboarding/staff-invite')}
            >
              Назад
            </Button>
            <Button onClick={() => completeOnboarding()}>
              Попробовать снова
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
                  <CardTitle className="text-2xl">Все готово!</CardTitle>
                  <CardDescription className="mt-1 text-base">
                    Система активирована и готова к приёму заказов
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Completion Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Что было настроено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completionData?.completedSteps.map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="capitalize">
                      {step === 'registration_complete' && 'Регистрация'}
                      {step === 'business_identity' && 'Информация о бизнесе'}
                      {step === 'branch_setup' && 'Настройка филиала'}
                      {step === 'menu_template' && 'Шаблон меню'}
                      {step === 'staff_invited' && 'Приглашение персонала'}
                      {step === 'go_live' && 'Запуск системы'}
                    </span>
                  </div>
                ))}

                {completionData?.skippedSteps &&
                  completionData.skippedSteps.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-muted-foreground mb-2 text-sm font-medium">
                        Пропущенные шаги:
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
              <CardTitle>Следующие шаги</CardTitle>
              <CardDescription>
                Рекомендуем выполнить эти действия для полноценной работы
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
                            ? 'Важно'
                            : 'Рекомендуется'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(nextStep.link)}
                    >
                      Перейти
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
              Начать работу
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : null}
    </OnboardingLayout>
  )
}

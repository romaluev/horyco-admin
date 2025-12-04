'use client'

import { formatPrice } from '@/shared/lib/format'
import { BaseError } from '@/shared/ui/base-error'
import { BaseLoading } from '@/shared/ui/base-loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Separator } from '@/shared/ui/base/separator'

import { SubscriptionStatusBadge } from '@/entities/subscription'
import { useGetSubscription } from '@/entities/subscription'

export const SubscriptionDashboard = () => {
  const { data: subscription, isLoading, error } = useGetSubscription()

  if (isLoading) return <BaseLoading className="py-10" />
  if (error) return <BaseError className="py-10" message="Ошибка загрузки подписки" />
  if (!subscription) return null

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader className="gap-1.5">
          <div className="flex items-center justify-between">
            <CardTitle>Статус подписки</CardTitle>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">План</p>
              <p className="text-lg font-medium">{subscription.currentPlan.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Способ оплаты</p>
              <p className="text-lg font-medium">
                {subscription.paymentFlow === 'manual' ? 'Ручной платеж' : 'Автоматический'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Period Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Период биллинга</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Начало периода</p>
              <p className="text-sm font-medium">
                {new Date(subscription.billingPeriod.currentPeriodStart).toLocaleDateString(
                  'ru-RU'
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Конец периода</p>
              <p className="text-sm font-medium">
                {new Date(subscription.billingPeriod.currentPeriodEnd).toLocaleDateString(
                  'ru-RU'
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Дней до продления</p>
              <p className="text-sm font-medium">{subscription.billingPeriod.daysUntilRenewal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Стоимость подписки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Итого:</span>
            <span className="font-semibold">
              {formatPrice(subscription.billingSummary.total)}
            </span>
          </div>
          {subscription.billingSummary.discount > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Скидка:</span>
                <span className="text-sm">
                  -{formatPrice(subscription.billingSummary.discount)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Trial Info Card */}
      {subscription.trial.isInTrial && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="text-base text-orange-900 dark:text-orange-200">
              Пробный период
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800 dark:text-orange-300">
              Пробный период заканчивается{' '}
              <strong>
                {subscription.trial.trialEndsAt &&
                  new Date(subscription.trial.trialEndsAt).toLocaleDateString('ru-RU')}
              </strong>
              ({subscription.trial.daysRemaining} дн.)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modules Card */}
      {subscription.modules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Активные модули</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subscription.modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">{module.name}</p>
                    {module.isInTrial && (
                      <p className="text-xs text-muted-foreground">
                        Пробный период: {module.daysRemainingInTrial} дн.
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(module.priceMonthly)}/мес
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

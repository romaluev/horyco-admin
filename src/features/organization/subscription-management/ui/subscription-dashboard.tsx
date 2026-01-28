'use client'

import { useTranslation } from 'react-i18next'

import { formatPrice } from '@/shared/lib/format'
import { BaseError, BaseLoading } from '@/shared/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Separator } from '@/shared/ui/base/separator'

import { SubscriptionStatusBadge, useGetSubscription } from '@/entities/organization/subscription'

export const SubscriptionDashboard = () => {
  const { t } = useTranslation('organization')
  const { data: subscription, isLoading, error } = useGetSubscription()

  if (isLoading) return <BaseLoading className="py-10" />
  if (error) return <BaseError className="py-10" message={t('subscription.loadError')} />
  if (!subscription) return null

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader className="gap-1.5">
          <div className="flex items-center justify-between">
            <CardTitle>{t('subscription.status.title')}</CardTitle>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">{t('subscription.status.plan')}</p>
              <p className="text-lg font-medium">{subscription.currentPlan.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('subscription.status.paymentFlow')}</p>
              <p className="text-lg font-medium">
                {subscription.paymentFlow === 'manual' ? t('subscription.status.manual') : t('subscription.status.automatic')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Period Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('subscription.billingPeriod.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">{t('subscription.billingPeriod.start')}</p>
              <p className="text-sm font-medium">
                {new Date(subscription.billingPeriod.currentPeriodStart).toLocaleDateString(
                  'ru-RU'
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('subscription.billingPeriod.end')}</p>
              <p className="text-sm font-medium">
                {new Date(subscription.billingPeriod.currentPeriodEnd).toLocaleDateString(
                  'ru-RU'
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('subscription.billingPeriod.daysUntilRenewal')}</p>
              <p className="text-sm font-medium">{subscription.billingPeriod.daysUntilRenewal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('subscription.pricing.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('subscription.pricing.total')}:</span>
            <span className="font-semibold">
              {formatPrice(subscription.billingSummary.total)}
            </span>
          </div>
          {subscription.billingSummary.discount > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('subscription.pricing.discount')}:</span>
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
              {t('subscription.trial.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800 dark:text-orange-300">
              {t('subscription.trial.endsAt')}{' '}
              <strong>
                {subscription.trial.trialEndsAt &&
                  new Date(subscription.trial.trialEndsAt).toLocaleDateString('ru-RU')}
              </strong>
              ({subscription.trial.daysRemaining} {t('subscription.trial.daysRemaining')})
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modules Card */}
      {subscription.modules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('subscription.modules.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subscription.modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">{module.name}</p>
                    {module.isInTrial && (
                      <p className="text-xs text-muted-foreground">
                        {t('subscription.modules.trial')}: {module.daysRemainingInTrial} {t('subscription.modules.daysRemaining')}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(module.priceMonthly)}{t('subscription.modules.monthly')}
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

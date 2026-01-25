'use client'

import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'
import PageContainer from '@/shared/ui/layout/page-container'

import { useBranchStore } from '@/entities/organization/branch'
import { BrandingSettingsForm } from '@/features/organization/branding-settings-form'
import { FeatureFlagsManager } from '@/features/organization/feature-flags-manager'
import { PaymentSettingsForm } from '@/features/organization/payment-settings-form'
import { SmsSettingsForm } from '@/features/organization/sms-settings-form'
import { SubscriptionPage } from '@/features/organization/subscription-management'
import { ThemeSettings } from '@/features/organization/theme-settings'

export default function SettingsPage() {
  const { t } = useTranslation('dashboard')
  const { selectedBranchId } = useBranchStore()
  const [activeTab, setActiveTab] = useState('branding')

  return (
    <PageContainer scrollable>
      <div className="space-y-4 w-full">
        <div className="flex items-start justify-between">
          <Heading
            title={t('settings.title')}
            description={t('settings.description')}
          />
        </div>
        <Separator />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="branding" className="w-full">{t('settings.tabs.branding')}</TabsTrigger>
            <TabsTrigger value="features" className="w-full">{t('settings.tabs.features')}</TabsTrigger>
            <TabsTrigger value="payment" className="w-full">{t('settings.tabs.payment')}</TabsTrigger>
            <TabsTrigger value="sms" className="w-full">{t('settings.tabs.sms')}</TabsTrigger>
            <TabsTrigger value="subscription" className="w-full">{t('settings.tabs.subscription')}</TabsTrigger>
            <TabsTrigger value="appearance" className="w-full">{t('settings.tabs.appearance')}</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-4 w-full">
            <div className="rounded-lg border p-6">
              <BrandingSettingsForm
                branchId={selectedBranchId ?? undefined}
              />
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 w-full">
            <div className="rounded-lg border p-6">
              <FeatureFlagsManager branchId={selectedBranchId ?? undefined} />
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 w-full">
            {selectedBranchId !== null && (
              <div className="rounded-lg border border-orange-500 bg-orange-50 p-4 dark:bg-orange-950/20">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  {t('settings.warnings.paymentOrgLevel')}
                </p>
              </div>
            )}
            <div className="rounded-lg border p-6">
              <PaymentSettingsForm />
            </div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4 w-full">
            {selectedBranchId !== null && (
              <div className="rounded-lg border border-orange-500 bg-orange-50 p-4 dark:bg-orange-950/20">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  {t('settings.warnings.smsOrgLevel')}
                </p>
              </div>
            )}
            <div className="rounded-lg border p-6">
              <SmsSettingsForm />
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="w-full">
            <SubscriptionPage />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 w-full">
            <div className="rounded-lg border p-6">
              <ThemeSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}

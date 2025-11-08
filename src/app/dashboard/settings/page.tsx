'use client'

import { useState } from 'react'

import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'
import PageContainer from '@/shared/ui/layout/page-container'

import { useBranchStore } from '@/entities/branch'
import { BrandingSettingsForm } from '@/features/branding-settings-form'
import { FeatureFlagsManager } from '@/features/feature-flags-manager'
import { PaymentSettingsForm } from '@/features/payment-settings-form'
import { SmsSettingsForm } from '@/features/sms-settings-form'

export default function SettingsPage() {
  const { selectedBranchId } = useBranchStore()
  const [activeTab, setActiveTab] = useState('branding')

  return (
    <PageContainer scrollable>
      <div className="space-y-4 w-full">
        <div className="flex items-start justify-between">
          <Heading
            title="Настройки"
            description="Управление настройками вашего бизнеса"
          />
        </div>
        <Separator />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="branding" className="w-full">Брендинг</TabsTrigger>
            <TabsTrigger value="features" className="w-full">Функции</TabsTrigger>
            <TabsTrigger value="payment" className="w-full">Оплата</TabsTrigger>
            <TabsTrigger value="sms" className="w-full">SMS</TabsTrigger>
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
                  Настройки оплаты доступны только на уровне организации. Выберите
                  &quot;Все филиалы (По умолчанию)&quot; для редактирования.
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
                  Настройки SMS доступны только на уровне организации. Выберите
                  &quot;Все филиалы (По умолчанию)&quot; для редактирования.
                </p>
              </div>
            )}
            <div className="rounded-lg border p-6">
              <SmsSettingsForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}

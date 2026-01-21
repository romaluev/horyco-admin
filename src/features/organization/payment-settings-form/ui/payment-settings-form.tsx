'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import { Switch } from '@/shared/ui/base/switch'
import BaseLoading from '@/shared/ui/base-loading'
import { SecretInput } from '@/shared/ui/secret-input'

import {
  usePaymentSettings,
  useUpdatePaymentSettings,
  useTestIntegration,
  type IPaymentSettings,
} from '@/entities/organization/settings'

import {
  paymentSettingsSchema,
  type PaymentSettingsFormData,
} from '../model/schema'

const extractValue = <T,>(setting: { value: T } | undefined): T | undefined => {
  return setting?.value
}

const isMasked = (value: string | undefined): boolean => {
  return value === '***masked***'
}

const convertToFormData = (
  settings: IPaymentSettings | undefined
): PaymentSettingsFormData => {
  if (!settings) {
    return {
      paymeEnabled: false,
      paymeMerchantId: '',
      paymeKey: '',
      clickEnabled: false,
      clickMerchantId: '',
      clickSecretKey: '',
      uzumEnabled: false,
      uzumMerchantId: '',
      uzumSecretKey: '',
    }
  }

  return {
    paymeEnabled: extractValue(settings.paymeEnabled) ?? false,
    paymeMerchantId: extractValue(settings.paymeMerchantId) || '',
    paymeKey: extractValue(settings.paymeKey) || '',
    clickEnabled: extractValue(settings.clickEnabled) ?? false,
    clickMerchantId: extractValue(settings.clickMerchantId) || '',
    clickSecretKey: extractValue(settings.clickSecretKey) || '',
    uzumEnabled: extractValue(settings.uzumEnabled) ?? false,
    uzumMerchantId: extractValue(settings.uzumMerchantId) || '',
    uzumSecretKey: extractValue(settings.uzumSecretKey) || '',
  }
}

export const PaymentSettingsForm = () => {
  const { t } = useTranslation('organization')
  const { data: paymentSettings, isLoading } = usePaymentSettings()
  const { mutate: updateSettings, isPending } = useUpdatePaymentSettings()
  const { mutate: testIntegration, isPending: isTesting } = useTestIntegration()

  const [testingProvider, setTestingProvider] = useState<string | null>(null)

  const form = useForm<PaymentSettingsFormData>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: convertToFormData(paymentSettings),
  })

  useEffect(() => {
    if (paymentSettings) {
      form.reset(convertToFormData(paymentSettings))
    }
  }, [paymentSettings, form])

  const handleSubmit = (data: PaymentSettingsFormData) => {
    updateSettings(data)
  }

  const handleTest = (provider: 'payme' | 'click' | 'uzum') => {
    setTestingProvider(provider)
    testIntegration(
      { provider },
      {
        onSettled: () => {
          setTestingProvider(null)
        },
      }
    )
  }

  if (isLoading) {
    return <BaseLoading />
  }

  const isPaymeKeyMasked = isMasked(extractValue(paymentSettings?.paymeKey))
  const isClickKeyMasked = isMasked(extractValue(paymentSettings?.clickSecretKey))
  const isUzumKeyMasked = isMasked(extractValue(paymentSettings?.uzumSecretKey))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* PayMe */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>PayMe</CardTitle>
                <CardDescription>{t('paymentSettings.providers.payme.description')}</CardDescription>
              </div>
              <FormField
                control={form.control}
                name="paymeEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="paymeMerchantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merchant ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="merchant_12345" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymeKey"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SecretInput
                      label="Secret Key"
                      value={field.value}
                      onChange={field.onChange}
                      isMasked={isPaymeKeyMasked}
                      placeholder="Введите секретный ключ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleTest('payme')}
              disabled={isTesting || !form.watch('paymeEnabled')}
            >
              {testingProvider === 'payme' ? t('paymentSettings.testing') : t('paymentSettings.test')}
            </Button>
          </CardContent>
        </Card>

        {/* Click */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Click</CardTitle>
                <CardDescription>{t('paymentSettings.providers.click.description')}</CardDescription>
              </div>
              <FormField
                control={form.control}
                name="clickEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="clickMerchantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merchant ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="click_67890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clickSecretKey"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SecretInput
                      label="Secret Key"
                      value={field.value}
                      onChange={field.onChange}
                      isMasked={isClickKeyMasked}
                      placeholder="Введите секретный ключ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleTest('click')}
              disabled={isTesting || !form.watch('clickEnabled')}
            >
              {testingProvider === 'click' ? t('paymentSettings.testing') : t('paymentSettings.test')}
            </Button>
          </CardContent>
        </Card>

        {/* Uzum */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Uzum</CardTitle>
                <CardDescription>{t('paymentSettings.providers.uzum.description')}</CardDescription>
              </div>
              <FormField
                control={form.control}
                name="uzumEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="uzumMerchantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merchant ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="uzum_12345" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uzumSecretKey"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SecretInput
                      label="Secret Key"
                      value={field.value}
                      onChange={field.onChange}
                      isMasked={isUzumKeyMasked}
                      placeholder="Введите секретный ключ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleTest('uzum')}
              disabled={isTesting || !form.watch('uzumEnabled')}
            >
              {testingProvider === 'uzum' ? t('paymentSettings.testing') : t('paymentSettings.test')}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? t('common.actions.saving') : t('paymentSettings.saveChanges')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

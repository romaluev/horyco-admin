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
import { Label } from '@/shared/ui/base/label'
import { PhoneInput } from '@/shared/ui/base/phone-input'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/base/radio-group'
import { Switch } from '@/shared/ui/base/switch'
import BaseLoading from '@/shared/ui/base-loading'
import { SecretInput } from '@/shared/ui/secret-input'

import {
  useSmsSettings,
  useUpdateSmsSettings,
  useTestIntegration,
  type ISmsSettings,
} from '@/entities/organization/settings'

import { smsSettingsSchema, type SmsSettingsFormData } from '../model/schema'

const extractValue = <T,>(setting: { value: T } | undefined): T | undefined => {
  return setting?.value
}

const isMasked = (value: string | undefined): boolean => {
  return value === '***masked***'
}

const convertToFormData = (
  settings: ISmsSettings | undefined
): SmsSettingsFormData => {
  if (!settings) {
    return {
      smsEnabled: false,
      smsProvider: 'playmobile',
      playmobileLogin: '',
      playmobilePassword: '',
      playmobileSender: '',
      eskizEmail: '',
      eskizPassword: '',
      eskizSender: '',
    }
  }

  return {
    smsEnabled: extractValue(settings.smsEnabled) ?? false,
    smsProvider: extractValue(settings.smsProvider) || 'playmobile',
    playmobileLogin: extractValue(settings.playmobileLogin) || '',
    playmobilePassword: extractValue(settings.playmobilePassword) || '',
    playmobileSender: extractValue(settings.playmobileSender) || '',
    eskizEmail: extractValue(settings.eskizEmail) || '',
    eskizPassword: extractValue(settings.eskizPassword) || '',
    eskizSender: extractValue(settings.eskizSender) || '',
  }
}

export const SmsSettingsForm = () => {
  const { t } = useTranslation('organization')
  const { data: smsSettings, isLoading } = useSmsSettings()
  const { mutate: updateSettings, isPending } = useUpdateSmsSettings()
  const { mutate: testIntegration, isPending: isTesting } = useTestIntegration()

  const [testPhone, setTestPhone] = useState('+998901234567')

  const form = useForm<SmsSettingsFormData>({
    resolver: zodResolver(smsSettingsSchema),
    defaultValues: convertToFormData(smsSettings),
  })

  useEffect(() => {
    if (smsSettings) {
      form.reset(convertToFormData(smsSettings))
    }
  }, [smsSettings, form])

  const handleSubmit = (data: SmsSettingsFormData) => {
    updateSettings(data)
  }

  const handleTest = () => {
    const provider = form.watch('smsProvider')
    testIntegration({ provider, phoneNumber: testPhone })
  }

  if (isLoading) {
    return <BaseLoading />
  }

  const selectedProvider = form.watch('smsProvider')
  const isPlaymobilePasswordMasked = isMasked(
    extractValue(smsSettings?.playmobilePassword)
  )
  const isEskizPasswordMasked = isMasked(
    extractValue(smsSettings?.eskizPassword)
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('smsSettings.title')}</CardTitle>
                <CardDescription>
                  {t('smsSettings.description')}
                </CardDescription>
              </div>
              <FormField
                control={form.control}
                name="smsEnabled"
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
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="smsProvider"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t('smsSettings.provider')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="playmobile" id="playmobile" />
                        <Label htmlFor="playmobile" className="cursor-pointer">
                          {'Playmobile'}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="eskiz" id="eskiz" />
                        <Label htmlFor="eskiz" className="cursor-pointer">
                          {'Eskiz'}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProvider === 'playmobile' && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-medium">{t('smsSettings.playmobileSettings')}</h4>

                <FormField
                  control={form.control}
                  name="playmobileLogin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('smsSettings.login')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="your_login" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="playmobilePassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SecretInput
                          label={t('smsSettings.password')}
                          value={field.value}
                          onChange={field.onChange}
                          isMasked={isPlaymobilePasswordMasked}
                          placeholder="Введите пароль"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="playmobileSender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('smsSettings.senderName')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Horyco" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {selectedProvider === 'eskiz' && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-medium">{t('smsSettings.eskizSettings')}</h4>

                <FormField
                  control={form.control}
                  name="eskizEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="user@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eskizPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SecretInput
                          label={t('smsSettings.password')}
                          value={field.value}
                          onChange={field.onChange}
                          isMasked={isEskizPasswordMasked}
                          placeholder="Введите пароль"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eskizSender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('smsSettings.senderName')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Horyco" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>{t('smsSettings.testing')}</Label>
              <div className="flex gap-2">
                <PhoneInput
                  value={testPhone}
                  onChange={(value) => setTestPhone(value || '')}
                  defaultCountry="UZ"
                  placeholder="+998 90 123 45 67"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTest}
                  disabled={isTesting || !form.watch('smsEnabled')}
                >
                  {isTesting ? t('smsSettings.sending') : t('smsSettings.sendTest')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? t('common.actions.saving') : t('smsSettings.saveChanges')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

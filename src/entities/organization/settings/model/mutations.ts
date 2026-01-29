import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { settingsApi } from './api'
import { settingsKeys } from './query-keys'

import type {
  IUpdateBrandingDto,
  IUpdateFeatureFlagsDto,
  IUpdatePaymentSettingsDto,
  IUpdateSmsSettingsDto,
  ITestIntegrationDto,
} from './types'

/**
 * Update branding settings
 */
export const useUpdateBranding = (branchId?: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IUpdateBrandingDto) =>
      settingsApi.updateBranding(data, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: settingsKeys.branding(branchId),
      })
      queryClient.invalidateQueries({
        queryKey: settingsKeys.allSettings(branchId),
      })
      toast.success(
        branchId
          ? 'Настройки бренда филиала обновлены'
          : 'Настройки бренда обновлены'
      )
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления настроек: ${error.message}`)
    },
  })
}

/**
 * Update feature flags
 */
export const useUpdateFeatures = (branchId?: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IUpdateFeatureFlagsDto) =>
      settingsApi.updateFeatures(data, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: settingsKeys.features(branchId),
      })
      queryClient.invalidateQueries({
        queryKey: settingsKeys.allSettings(branchId),
      })
      toast.success(
        branchId ? 'Функции филиала обновлены' : 'Функции обновлены'
      )
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления функций: ${error.message}`)
    },
  })
}

/**
 * Update payment settings
 */
export const useUpdatePaymentSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IUpdatePaymentSettingsDto) =>
      settingsApi.updatePaymentSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.payments() })
      queryClient.invalidateQueries({ queryKey: settingsKeys.allSettings() })
      toast.success('Настройки оплаты обновлены')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления настроек оплаты: ${error.message}`)
    },
  })
}

/**
 * Update SMS settings
 */
export const useUpdateSmsSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IUpdateSmsSettingsDto) =>
      settingsApi.updateSmsSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.sms() })
      queryClient.invalidateQueries({ queryKey: settingsKeys.allSettings() })
      toast.success('Настройки SMS обновлены')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления настроек SMS: ${error.message}`)
    },
  })
}

/**
 * Test integration
 */
export const useTestIntegration = () => {
  return useMutation({
    mutationFn: (data: ITestIntegrationDto) =>
      settingsApi.testIntegration(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message, {
          description: `Время ответа: ${data.details.responseTime}ms`,
        })
      } else {
        toast.error(data.message, {
          description: data.error,
        })
      }
    },
    onError: (error: Error) => {
      toast.error(`Ошибка тестирования интеграции: ${error.message}`)
    },
  })
}

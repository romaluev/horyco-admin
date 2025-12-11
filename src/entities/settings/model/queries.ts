import { useQuery } from '@tanstack/react-query'

import { settingsApi } from './api'
import { settingsKeys } from './query-keys'

/**
 * Get all settings (structured response)
 */
export const useAllSettings = (branchId?: number) => {
  return useQuery({
    queryKey: settingsKeys.allSettings(branchId),
    queryFn: () => settingsApi.getAllSettings(branchId),
  })
}

/**
 * Get branding settings
 */
export const useBrandingSettings = (branchId?: number) => {
  return useQuery({
    queryKey: settingsKeys.branding(branchId),
    queryFn: () => settingsApi.getBranding(branchId),
  })
}

/**
 * Get feature flags
 */
export const useFeatureFlags = (branchId?: number) => {
  return useQuery({
    queryKey: settingsKeys.features(branchId),
    queryFn: () => settingsApi.getFeatures(branchId),
  })
}

/**
 * Check if a specific feature is enabled
 */
export const useFeatureCheck = (feature: string, branchId?: number) => {
  return useQuery({
    queryKey: settingsKeys.featureCheck(feature, branchId),
    queryFn: () => settingsApi.checkFeature(feature, branchId),
  })
}

/**
 * Get payment integration settings
 */
export const usePaymentSettings = () => {
  return useQuery({
    queryKey: settingsKeys.payments(),
    queryFn: () => settingsApi.getPaymentSettings(),
  })
}

/**
 * Get SMS integration settings
 */
export const useSmsSettings = () => {
  return useQuery({
    queryKey: settingsKeys.sms(),
    queryFn: () => settingsApi.getSmsSettings(),
  })
}

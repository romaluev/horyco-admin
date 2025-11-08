import api from '@/shared/lib/axios'

import type {
  IAllSettingsResponse,
  IBrandingSettings,
  IFeatureFlags,
  IPaymentSettings,
  ISmsSettings,
  IUpdateBrandingDto,
  IUpdateFeatureFlagsDto,
  IUpdatePaymentSettingsDto,
  IUpdateSmsSettingsDto,
  ITestIntegrationDto,
  ITestIntegrationResponse,
  IFeatureCheckResponse,
} from './types'

const BASE_URL = '/admin/settings'

/**
 * Settings API functions
 */
export const settingsApi = {
  /**
   * Get all settings (structured response)
   */
  getAllSettings: async (
    branchId?: number
  ): Promise<IAllSettingsResponse> => {
    const params = branchId ? { branchId } : {}
    const response = await api.get<IAllSettingsResponse>(BASE_URL, { params })
    return response.data
  },

  /**
   * Get branding settings
   */
  getBranding: async (branchId?: number): Promise<IBrandingSettings> => {
    const params = branchId ? { branchId } : {}
    const response = await api.get<IBrandingSettings>(
      `${BASE_URL}/branding`,
      { params }
    )
    return response.data
  },

  /**
   * Update branding settings
   */
  updateBranding: async (
    data: IUpdateBrandingDto,
    branchId?: number
  ): Promise<IBrandingSettings> => {
    const params = branchId ? { branchId } : {}
    const response = await api.put<IBrandingSettings>(
      `${BASE_URL}/branding`,
      data,
      { params }
    )
    return response.data
  },

  /**
   * Get feature flags
   */
  getFeatures: async (branchId?: number): Promise<IFeatureFlags> => {
    const params = branchId ? { branchId } : {}
    const response = await api.get<IFeatureFlags>(`${BASE_URL}/features`, {
      params,
    })
    return response.data
  },

  /**
   * Update feature flags
   */
  updateFeatures: async (
    data: IUpdateFeatureFlagsDto,
    branchId?: number
  ): Promise<IFeatureFlags> => {
    const params = branchId ? { branchId } : {}
    const response = await api.put<IFeatureFlags>(
      `${BASE_URL}/features`,
      data,
      { params }
    )
    return response.data
  },

  /**
   * Check if a specific feature is enabled
   */
  checkFeature: async (
    feature: string,
    branchId?: number
  ): Promise<IFeatureCheckResponse> => {
    const params = branchId ? { branchId } : {}
    const response = await api.get<IFeatureCheckResponse>(
      `${BASE_URL}/features/${feature}/check`,
      { params }
    )
    return response.data
  },

  /**
   * Get payment integration settings
   */
  getPaymentSettings: async (): Promise<IPaymentSettings> => {
    const response = await api.get<IPaymentSettings>(
      `${BASE_URL}/integrations/payments`
    )
    return response.data
  },

  /**
   * Update payment integration settings
   */
  updatePaymentSettings: async (
    data: IUpdatePaymentSettingsDto
  ): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(
      `${BASE_URL}/integrations/payments`,
      data
    )
    return response.data
  },

  /**
   * Get SMS integration settings
   */
  getSmsSettings: async (): Promise<ISmsSettings> => {
    const response = await api.get<ISmsSettings>(
      `${BASE_URL}/integrations/sms`
    )
    return response.data
  },

  /**
   * Update SMS integration settings
   */
  updateSmsSettings: async (
    data: IUpdateSmsSettingsDto
  ): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(
      `${BASE_URL}/integrations/sms`,
      data
    )
    return response.data
  },

  /**
   * Test integration configuration
   */
  testIntegration: async (
    data: ITestIntegrationDto
  ): Promise<ITestIntegrationResponse> => {
    const response = await api.post<ITestIntegrationResponse>(
      `${BASE_URL}/integrations/test`,
      data
    )
    return response.data
  },
}

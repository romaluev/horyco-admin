/**
 * Settings entity types
 * Defines all settings-related interfaces and types
 */

/**
 * Setting scope - tenant or branch level
 */
export type SettingScope = 'tenant' | 'branch'

/**
 * Base setting value with metadata
 */
export interface ISettingValue<T = unknown> {
  key: string
  value: T
  scope: SettingScope
  isOverride: boolean
  inheritedFrom?: string
}

/**
 * All settings response (structured)
 */
export interface IAllSettingsResponse {
  tenantId: number
  branchId?: number
  branding: IBrandingSettings
  features: IFeatureFlags
  payments: IPaymentSettings
  sms: ISmsSettings
}

/**
 * Branding Settings
 */
export interface IBrandingSettings {
  brandName: ISettingValue<string>
  brandDescription: ISettingValue<string>
  logoUrl: ISettingValue<string>
  logoDarkUrl: ISettingValue<string>
  faviconUrl: ISettingValue<string>
  primaryColor: ISettingValue<string>
  secondaryColor: ISettingValue<string>
  facebookUrl: ISettingValue<string>
  instagramUrl: ISettingValue<string>
  telegramUrl: ISettingValue<string>
  websiteUrl: ISettingValue<string>
  contactPhone: ISettingValue<string>
  contactEmail: ISettingValue<string>
  contactAddress: ISettingValue<string>
}

/**
 * Feature Flags
 */
export interface IFeatureFlags {
  qrOrderingEnabled: ISettingValue<boolean>
  loyaltyEnabled: ISettingValue<boolean>
  deliveryEnabled: ISettingValue<boolean>
  dineInEnabled: ISettingValue<boolean>
  takeawayEnabled: ISettingValue<boolean>
  reservationsEnabled: ISettingValue<boolean>
  onlinePaymentEnabled: ISettingValue<boolean>
  tipsEnabled: ISettingValue<boolean>
  reviewsEnabled: ISettingValue<boolean>
  multiLanguageEnabled: ISettingValue<boolean>
  darkModeEnabled: ISettingValue<boolean>
  analyticsEnabled: ISettingValue<boolean>
}

/**
 * Payment Settings
 */
export interface IPaymentSettings {
  paymeEnabled: ISettingValue<boolean>
  paymeMerchantId: ISettingValue<string>
  paymeKey: ISettingValue<string>
  clickEnabled: ISettingValue<boolean>
  clickMerchantId: ISettingValue<string>
  clickSecretKey: ISettingValue<string>
  uzumEnabled: ISettingValue<boolean>
  uzumMerchantId: ISettingValue<string>
  uzumSecretKey: ISettingValue<string>
}

/**
 * SMS Settings
 */
export interface ISmsSettings {
  smsEnabled: ISettingValue<boolean>
  smsProvider: ISettingValue<'playmobile' | 'eskiz'>
  playmobileLogin: ISettingValue<string>
  playmobilePassword: ISettingValue<string>
  playmobileSender: ISettingValue<string>
  eskizEmail: ISettingValue<string>
  eskizPassword: ISettingValue<string>
  eskizSender: ISettingValue<string>
}

/**
 * Update DTOs
 */

export interface IUpdateBrandingDto {
  brandName?: string
  brandDescription?: string
  logoUrl?: string
  logoDarkUrl?: string
  faviconUrl?: string
  primaryColor?: string
  secondaryColor?: string
  facebookUrl?: string
  instagramUrl?: string
  telegramUrl?: string
  websiteUrl?: string
  contactPhone?: string
  contactEmail?: string
  contactAddress?: string
}

export interface IUpdateFeatureFlagsDto {
  qrOrderingEnabled?: boolean
  loyaltyEnabled?: boolean
  deliveryEnabled?: boolean
  dineInEnabled?: boolean
  takeawayEnabled?: boolean
  reservationsEnabled?: boolean
  onlinePaymentEnabled?: boolean
  tipsEnabled?: boolean
  reviewsEnabled?: boolean
  multiLanguageEnabled?: boolean
  darkModeEnabled?: boolean
  analyticsEnabled?: boolean
}

export interface IUpdatePaymentSettingsDto {
  paymeEnabled?: boolean
  paymeMerchantId?: string
  paymeKey?: string
  clickEnabled?: boolean
  clickMerchantId?: string
  clickSecretKey?: string
  uzumEnabled?: boolean
  uzumMerchantId?: string
  uzumSecretKey?: string
}

export interface IUpdateSmsSettingsDto {
  smsEnabled?: boolean
  smsProvider?: 'playmobile' | 'eskiz'
  playmobileLogin?: string
  playmobilePassword?: string
  playmobileSender?: string
  eskizEmail?: string
  eskizPassword?: string
  eskizSender?: string
}

/**
 * Integration test request/response
 */
export interface ITestIntegrationDto {
  provider: 'playmobile' | 'eskiz' | 'payme' | 'click' | 'uzum'
  phoneNumber?: string
}

export interface ITestIntegrationResponse {
  success: boolean
  provider: string
  message: string
  error?: string
  details: {
    responseTime: number
    endpoint: string
    statusCode: number
  }
}

/**
 * Feature flag check response
 */
export interface IFeatureCheckResponse {
  enabled: boolean
}

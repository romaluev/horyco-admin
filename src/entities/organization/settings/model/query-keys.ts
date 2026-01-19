/**
 * Query keys for settings
 */
export const settingsKeys = {
  all: ['settings'] as const,
  allSettings: (branchId?: number) =>
    [...settingsKeys.all, 'all', branchId] as const,
  branding: (branchId?: number) =>
    [...settingsKeys.all, 'branding', branchId] as const,
  features: (branchId?: number) =>
    [...settingsKeys.all, 'features', branchId] as const,
  featureCheck: (feature: string, branchId?: number) =>
    [...settingsKeys.all, 'feature-check', feature, branchId] as const,
  payments: () => [...settingsKeys.all, 'payments'] as const,
  sms: () => [...settingsKeys.all, 'sms'] as const,
}

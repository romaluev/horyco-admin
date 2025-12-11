export const onboardingKeys = {
  all: () => ['onboarding'] as const,
  progress: () => [...onboardingKeys.all(), 'progress'] as const,
  defaultProducts: (businessType?: string) =>
    [...onboardingKeys.all(), 'default-products', { businessType }] as const,
  regions: () => ['regions'] as const,
  districts: (regionId?: number) => ['regions', regionId, 'districts'] as const,
} as const

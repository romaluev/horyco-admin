export const onboardingKeys = {
  all: () => ['onboarding'] as const,
  progress: () => [...onboardingKeys.all(), 'progress'] as const,
  templates: () => [...onboardingKeys.all(), 'templates'] as const,
  templatesByType: (businessType?: string) =>
    [...onboardingKeys.templates(), { businessType }] as const,
  regions: () => ['regions'] as const,
  districts: (regionId?: number) => ['regions', regionId, 'districts'] as const
} as const;

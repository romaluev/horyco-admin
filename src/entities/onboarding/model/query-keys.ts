/**
 * Query keys factory for onboarding entity
 * Provides consistent cache key management for React Query
 */

export const onboardingKeys = {
  all: () => ['onboarding'] as const,
  progress: () => [...onboardingKeys.all(), 'progress'] as const,
  menuTemplates: () => [...onboardingKeys.all(), 'menu-templates'] as const,
  menuTemplate: (id: number) => [...onboardingKeys.menuTemplates(), id] as const
} as const;

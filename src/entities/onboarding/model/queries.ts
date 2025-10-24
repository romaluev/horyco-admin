/**
 * React Query hooks for onboarding READ operations
 */

import { useQuery } from '@tanstack/react-query';
import { onboardingApi } from './api';
import { onboardingKeys } from './query-keys';

/**
 * Fetches current onboarding progress
 * Use this to check which step user is on
 */
export const useGetOnboardingProgress = () => {
  return useQuery({
    queryKey: onboardingKeys.progress(),
    queryFn: () => onboardingApi.getProgress(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });
};

/**
 * Fetches available menu templates
 * @param businessType - Optional filter by business type
 */
export const useGetMenuTemplates = (businessType?: string) => {
  return useQuery({
    queryKey: [...onboardingKeys.menuTemplates(), { businessType }],
    queryFn: () => onboardingApi.getMenuTemplates(businessType),
    enabled: true, // Can be controlled based on step
    staleTime: 1000 * 60 * 10 // 10 minutes - templates don't change often
  });
};

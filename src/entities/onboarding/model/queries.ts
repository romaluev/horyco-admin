import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { onboardingApi } from './api';
import { onboardingKeys } from './query-keys';
import type {
  OnboardingProgress,
  MenuTemplate,
  Region,
  District
} from './types';

// Get onboarding progress
export const useGetOnboardingProgress = (
  options?: Omit<UseQueryOptions<OnboardingProgress>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: onboardingKeys.progress(),
    queryFn: () => onboardingApi.getProgress(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options
  });
};

// Get menu templates
export const useGetMenuTemplates = (
  businessType?: string,
  options?: Omit<UseQueryOptions<MenuTemplate[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: onboardingKeys.templatesByType(businessType),
    queryFn: () => onboardingApi.getMenuTemplates(businessType),
    staleTime: 1000 * 60 * 30, // 30 minutes (templates don't change often)
    ...options
  });
};

// Get regions
export const useGetRegions = (
  options?: Omit<UseQueryOptions<Region[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: onboardingKeys.regions(),
    queryFn: () => onboardingApi.getRegions(),
    staleTime: Infinity, // Regions rarely change
    ...options
  });
};

// Get districts
export const useGetDistricts = (
  regionId?: number,
  options?: Omit<UseQueryOptions<District[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: onboardingKeys.districts(regionId),
    queryFn: () => onboardingApi.getDistricts(regionId!),
    enabled: !!regionId,
    staleTime: Infinity, // Districts rarely change
    ...options
  });
};

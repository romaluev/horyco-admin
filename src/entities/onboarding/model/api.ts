import api from '@/shared/lib/axios'

import type {
  OnboardingProgress,
  BusinessInfoRequest,
  BusinessInfoResponse,
  BranchSetupRequest,
  BranchSetupResponse,
  BranchLocationRequest,
  BranchLocationResponse,
  DefaultProductsResponse,
  MenuSetupRequest,
  MenuSetupResponse,
  StaffInviteRequest,
  StaffInviteResponse,
  CompleteOnboardingResponse,
  SkipStepRequest,
  SkipStepResponse,
  Region,
  District,
} from './types'

export const onboardingApi = {
  // Get current onboarding progress
  async getProgress(): Promise<OnboardingProgress> {
    const response = await api.get<{ data: OnboardingProgress }>(
      '/admin/onboarding/progress'
    )
    return response.data.data
  },

  // Submit business identity step (NEW API)
  async submitBusinessInfo(
    data: BusinessInfoRequest
  ): Promise<BusinessInfoResponse> {
    const response = await api.post<{ data: BusinessInfoResponse }>(
      '/admin/onboarding/steps/business-identity',
      data
    )
    return response.data.data
  },

  // Submit branch setup step
  async submitBranchSetup(
    data: BranchSetupRequest
  ): Promise<BranchSetupResponse> {
    const response = await api.post<{ data: BranchSetupResponse }>(
      '/admin/onboarding/steps/branch-setup',
      data
    )
    return response.data.data
  },

  // Submit branch location step (NEW)
  async submitBranchLocation(
    data: BranchLocationRequest
  ): Promise<BranchLocationResponse> {
    const response = await api.post<{ data: BranchLocationResponse }>(
      '/admin/onboarding/steps/branch-location',
      data
    )
    return response.data.data
  },

  // Get default products for business type
  async getDefaultProducts(
    businessType?: string
  ): Promise<DefaultProductsResponse> {
    const response = await api.get<DefaultProductsResponse>(
      '/admin/onboarding/default-products',
      {
        params: { businessType },
      }
    )
    return response.data
  },

  // Submit menu setup
  async submitMenuSetup(data: MenuSetupRequest): Promise<MenuSetupResponse> {
    const response = await api.post<{ data: MenuSetupResponse }>(
      '/admin/onboarding/steps/menu-setup',
      data
    )
    return response.data.data
  },

  // Submit staff invite step
  async submitStaffInvite(
    data: StaffInviteRequest
  ): Promise<StaffInviteResponse> {
    const response = await api.post<{ data: StaffInviteResponse }>(
      '/admin/onboarding/steps/staff-invite',
      data
    )
    return response.data.data
  },

  // Complete onboarding
  async complete(): Promise<CompleteOnboardingResponse> {
    const response = await api.post<{ data: CompleteOnboardingResponse }>(
      '/admin/onboarding/complete'
    )
    return response.data.data
  },

  // Skip a step
  async skipStep(data: SkipStepRequest): Promise<SkipStepResponse> {
    const response = await api.patch<{ data: SkipStepResponse }>(
      '/admin/onboarding/skip-step',
      data
    )
    return response.data.data
  },

  // Get regions
  async getRegions(): Promise<Region[]> {
    const response = await api.get<Region[]>('/admin/regions')
    return response.data
  },

  // Get districts by region
  async getDistricts(regionId: number): Promise<District[]> {
    const response = await api.get<District[]>(
      `/admin/regions/${regionId}/districts`
    )
    return response.data
  },
}

import api from '@/shared/lib/axios';
import type {
  OnboardingProgress,
  BusinessInfoRequest,
  BusinessInfoResponse,
  BranchSetupRequest,
  BranchSetupResponse,
  BranchLocationRequest,
  BranchLocationResponse,
  MenuTemplate,
  ApplyMenuTemplateRequest,
  ApplyMenuTemplateResponse,
  StaffInviteRequest,
  StaffInviteResponse,
  CompleteOnboardingResponse,
  SkipStepRequest,
  SkipStepResponse,
  Region,
  District
} from './types';

export const onboardingApi = {
  // Get current onboarding progress
  async getProgress(): Promise<OnboardingProgress> {
    const response = await api.get<OnboardingProgress>(
      '/admin/onboarding/progress'
    );
    return response.data;
  },

  // Submit business identity step (NEW API)
  async submitBusinessInfo(
    data: BusinessInfoRequest
  ): Promise<BusinessInfoResponse> {
    const response = await api.post<BusinessInfoResponse>(
      '/admin/onboarding/steps/business-identity',
      data
    );
    return response.data;
  },

  // Submit branch setup step
  async submitBranchSetup(
    data: BranchSetupRequest
  ): Promise<BranchSetupResponse> {
    const response = await api.post<BranchSetupResponse>(
      '/admin/onboarding/steps/branch-setup',
      data
    );
    return response.data;
  },

  // Submit branch location step (NEW)
  async submitBranchLocation(
    data: BranchLocationRequest
  ): Promise<BranchLocationResponse> {
    const response = await api.post<BranchLocationResponse>(
      '/admin/onboarding/steps/branch-location',
      data
    );
    return response.data;
  },

  // Get menu templates
  async getMenuTemplates(businessType?: string): Promise<MenuTemplate[]> {
    const response = await api.get<MenuTemplate[]>(
      '/admin/onboarding/menu-templates',
      {
        params: { businessType }
      }
    );
    return response.data;
  },

  // Apply menu template
  async applyMenuTemplate(
    data: ApplyMenuTemplateRequest
  ): Promise<ApplyMenuTemplateResponse> {
    const response = await api.post<ApplyMenuTemplateResponse>(
      '/admin/onboarding/steps/menu-template',
      data
    );
    return response.data;
  },

  // Submit staff invite step
  async submitStaffInvite(
    data: StaffInviteRequest
  ): Promise<StaffInviteResponse> {
    const response = await api.post<StaffInviteResponse>(
      '/admin/onboarding/steps/staff-invite',
      data
    );
    return response.data;
  },

  // Complete onboarding
  async complete(): Promise<CompleteOnboardingResponse> {
    const response = await api.post<CompleteOnboardingResponse>(
      '/admin/onboarding/complete'
    );
    return response.data;
  },

  // Skip a step
  async skipStep(data: SkipStepRequest): Promise<SkipStepResponse> {
    const response = await api.post<SkipStepResponse>(
      '/admin/onboarding/skip-step',
      data
    );
    return response.data;
  },

  // Get regions
  async getRegions(): Promise<Region[]> {
    const response = await api.get<Region[]>('/admin/regions');
    return response.data;
  },

  // Get districts by region
  async getDistricts(regionId: number): Promise<District[]> {
    const response = await api.get<District[]>(
      `/admin/regions/${regionId}/districts`
    );
    return response.data;
  }
};

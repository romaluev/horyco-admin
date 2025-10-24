import api from '@/shared/lib/axios';
import {
  OnboardingProgress,
  BusinessInfoRequest,
  BusinessInfoResponse,
  BranchSetupRequest,
  BranchSetupResponse,
  MenuTemplate,
  MenuTemplateRequest,
  MenuTemplateResponse,
  PaymentSetupRequest,
  PaymentSetupResponse,
  StaffInviteRequest,
  StaffInviteResponse,
  CompleteOnboardingResponse,
  SkipStepRequest
} from './types';

/**
 * Onboarding API functions
 */
export const onboardingApi = {
  /**
   * Get current onboarding progress
   */
  getProgress: async (): Promise<OnboardingProgress> => {
    const response = await api.get<OnboardingProgress>(
      '/admin/onboarding/progress'
    );
    return response.data;
  },

  /**
   * Step 2: Business Info
   */
  submitBusinessInfo: async (
    data: BusinessInfoRequest
  ): Promise<BusinessInfoResponse> => {
    const response = await api.post<BusinessInfoResponse>(
      '/admin/onboarding/steps/business-info',
      data
    );
    return response.data;
  },

  /**
   * Step 3: Branch Setup
   */
  submitBranchSetup: async (
    data: BranchSetupRequest
  ): Promise<BranchSetupResponse> => {
    const response = await api.post<BranchSetupResponse>(
      '/admin/onboarding/steps/branch-setup',
      data
    );
    return response.data;
  },

  /**
   * Get available menu templates
   */
  getMenuTemplates: async (businessType?: string): Promise<MenuTemplate[]> => {
    const params = businessType ? { businessType } : {};
    const response = await api.get<MenuTemplate[]>(
      '/admin/onboarding/menu-templates',
      { params }
    );
    return response.data;
  },

  /**
   * Step 4: Menu Template
   */
  submitMenuTemplate: async (
    data: MenuTemplateRequest
  ): Promise<MenuTemplateResponse> => {
    const response = await api.post<MenuTemplateResponse>(
      '/admin/onboarding/steps/menu-template',
      data
    );
    return response.data;
  },

  /**
   * Step 5: Payment Setup
   */
  submitPaymentSetup: async (
    data: PaymentSetupRequest
  ): Promise<PaymentSetupResponse> => {
    const response = await api.post<PaymentSetupResponse>(
      '/admin/onboarding/steps/payment-setup',
      data
    );
    return response.data;
  },

  /**
   * Step 6: Staff Invite
   */
  submitStaffInvite: async (
    data: StaffInviteRequest
  ): Promise<StaffInviteResponse> => {
    const response = await api.post<StaffInviteResponse>(
      '/admin/onboarding/steps/staff-invite',
      data
    );
    return response.data;
  },

  /**
   * Skip a step
   */
  skipStep: async (data: SkipStepRequest): Promise<OnboardingProgress> => {
    const response = await api.patch<OnboardingProgress>(
      '/admin/onboarding/skip-step',
      data
    );
    return response.data;
  },

  /**
   * Complete onboarding
   */
  complete: async (): Promise<CompleteOnboardingResponse> => {
    const response = await api.post<CompleteOnboardingResponse>(
      '/admin/onboarding/complete'
    );
    return response.data;
  }
};

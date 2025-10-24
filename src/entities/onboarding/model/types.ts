/**
 * Onboarding entity types
 */

// Onboarding steps enum
export enum OnboardingStep {
  REGISTRATION_COMPLETE = 'REGISTRATION_COMPLETE',
  BUSINESS_INFO_VERIFIED = 'BUSINESS_INFO_VERIFIED',
  BRANCH_SETUP = 'BRANCH_SETUP',
  MENU_TEMPLATE = 'MENU_TEMPLATE',
  PAYMENT_SETUP = 'PAYMENT_SETUP',
  STAFF_INVITED = 'STAFF_INVITED',
  GO_LIVE = 'GO_LIVE'
}

// Onboarding progress
export interface OnboardingProgress {
  currentStep: string;
  completedSteps: string[];
  completionPercentage: number;
  isCompleted: boolean;
  stepData?: Record<string, any>;
  skippedSteps?: string[];
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

// Business Info step
export interface BusinessInfoRequest {
  businessType: string;
  description?: string;
  address: string;
  website?: string;
  regionId?: number;
  districtId?: number;
}

export interface BusinessInfoResponse {
  currentStep: string;
  completedSteps: string[];
  completionPercentage: number;
  stepData: {
    BUSINESS_INFO_VERIFIED: {
      businessType: string;
      description?: string;
      completedAt: string;
    };
  };
}

// Branch Setup step
export interface BusinessHours {
  monday?: { open: string; close: string; isClosed?: boolean };
  tuesday?: { open: string; close: string; isClosed?: boolean };
  wednesday?: { open: string; close: string; isClosed?: boolean };
  thursday?: { open: string; close: string; isClosed?: boolean };
  friday?: { open: string; close: string; isClosed?: boolean };
  saturday?: { open: string; close: string; isClosed?: boolean };
  sunday?: { open: string; close: string; isClosed?: boolean };
}

export interface BranchSetupRequest {
  branchName: string;
  address: string;
  businessHours: BusinessHours;
  dineInEnabled: boolean;
  takeawayEnabled: boolean;
  deliveryEnabled: boolean;
}

export interface BranchSetupResponse {
  currentStep: string;
  completedSteps: string[];
  completionPercentage: number;
}

// Menu Template step
export interface MenuTemplate {
  id: number;
  name: string;
  businessType: string;
  description: string;
  categoriesCount: number;
  productsCount: number;
  previewImage?: string;
  categories?: {
    name: string;
    count: number;
  }[];
}

export interface MenuTemplateRequest {
  templateId: number;
  replaceExisting?: boolean;
}

export interface MenuTemplateResponse {
  success: boolean;
  message: string;
  categoriesCreated: number;
  productsCreated: number;
  currentStep: string;
  completionPercentage: number;
}

// Payment Setup step
export interface PaymentSetupRequest {
  cashEnabled: boolean;
  cardEnabled: boolean;
  paymeMerchantId?: string;
  paymeSecretKey?: string;
  clickMerchantId?: string;
  clickServiceId?: string;
  clickSecretKey?: string;
}

export interface PaymentSetupResponse {
  currentStep: string;
  completedSteps: string[];
  completionPercentage: number;
}

// Staff Invite step
export interface StaffInvitation {
  fullName: string;
  phone: string;
  email?: string;
  roleId: number;
  branchIds: number[];
}

export interface StaffInviteRequest {
  invitations: StaffInvitation[];
}

export interface StaffInviteResponse {
  currentStep: string;
  completedSteps: string[];
  completionPercentage: number;
  invitationsSent: number;
}

// Complete Onboarding
export interface CompleteOnboardingResponse {
  success: boolean;
  message: string;
  tenant: {
    id: number;
    businessName: string;
    status: string;
    activatedAt: string;
  };
  onboardingProgress: OnboardingProgress;
  nextSteps: {
    title: string;
    link: string;
    priority: string;
  }[];
}

// Skip step
export interface SkipStepRequest {
  step: string;
  reason?: string;
}

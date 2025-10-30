// Onboarding step identifiers
export type OnboardingStep =
  | 'registration_complete'
  | 'business_identity'
  | 'branch_setup'
  | 'menu_template'
  | 'staff_invited'
  | 'go_live'
  | 'payment_setup';

// Onboarding progress response
export interface OnboardingProgress {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  completionPercentage: number;
  isCompleted: boolean;
  stepData?: Record<string, any>;
  skippedSteps?: OnboardingStep[];
  nextStep?: OnboardingStep;
  canSkip?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Base response wrapper for all onboarding step responses
export interface OnboardingStepResponse<T = {}> {
  success: boolean;
  message: string;
  progress: OnboardingProgress & T;
}

// Step 1: Business Identity (NEW API)
export interface BusinessIdentityRequest {
  businessName: string;
  businessType: string;
  slug?: string;
  logoUrl?: string;
}

export interface BusinessIdentityResponse extends OnboardingStepResponse {}

// Legacy alias for backwards compatibility
export type BusinessInfoRequest = BusinessIdentityRequest;
export type BusinessInfoResponse = BusinessIdentityResponse;

// Step 2: Branch Setup (UPDATED API)
export interface BranchSetupRequest {
  branchName: string;
  address: string;
  region: string;
  city: string;
  businessHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  dineInEnabled: boolean;
  takeawayEnabled: boolean;
  deliveryEnabled: boolean;
}

export interface BranchSetupResponse
  extends OnboardingStepResponse<{
    branchId: number;
  }> {}

// Step 3: Branch Location (NEW)
export interface BranchLocationRequest {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  postalCode?: string;
  fullAddress: string;
  phone: string;
  email?: string;
}

export interface BranchLocationResponse extends OnboardingStepResponse {}

// Menu setup step - Default products
export interface DefaultProduct {
  name: string;
  description?: string;
  suggestedPrice: number;
  image?: string;
  preparationTime?: number;
  calories?: number;
  allergens?: string[];
}

export interface DefaultCategory {
  name: string;
  description?: string;
  products: DefaultProduct[];
}

export interface DefaultProductsResponse {
  categories: DefaultCategory[];
}

// Menu setup step - Submit menu
export interface MenuProduct {
  name: string;
  price: number;
  description?: string;
  image?: string;
  preparationTime?: number;
  calories?: number;
  allergens?: string[];
}

export interface MenuCategory {
  name: string;
  description?: string;
  products: MenuProduct[];
}

export interface MenuSetupRequest {
  categories: MenuCategory[];
}

export interface MenuSetupResponse {
  success: boolean;
  categoriesCreated: number;
  productsCreated: number;
}

// Staff invite step
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

export interface StaffInviteResponse
  extends OnboardingStepResponse<{
    invitationsSent: number;
  }> {}

// Complete onboarding
export interface CompleteOnboardingResponse extends OnboardingProgress {
  remainingSteps?: string[];
  nextSteps?: {
    title: string;
    link: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

// Skip step
export interface SkipStepRequest {
  step: OnboardingStep;
  reason?: string;
}

export interface SkipStepResponse extends OnboardingStepResponse {}

// Regions and districts
export interface Region {
  id: number;
  name: string;
}

export interface District {
  id: number;
  regionId: number;
  name: string;
}

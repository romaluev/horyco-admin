/**
 * Authentication request payload
 * Corresponds to AuthDto in the backend
 */
export interface AuthRequest {
  phone: string;
  password: string;
}

/**
 * Authentication response
 * The structure is inferred from the backend auth.service.ts
 */
export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    // Add other user properties as needed
  };
}

/**
 * Registration OTP - Send OTP request
 */
export interface SendOTPRequest {
  phone: string;
  businessName: string;
}

/**
 * Registration OTP - Send OTP response
 */
export interface SendOTPResponse {
  success: boolean;
  message: string;
  otpSentAt: string;
  expiresIn: number;
  maskedPhone: string;
}

/**
 * Registration - Verify OTP request
 */
export interface VerifyOTPRequest {
  phone: string;
  otp: string;
  businessName: string;
  ownerName: string;
  password: string;
}

/**
 * Registration - Verify OTP response
 */
export interface VerifyOTPResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    tenantId: number;
    phone: string;
    fullName: string;
    roles: string[];
    permissions: string[];
  };
  tenant: {
    id: number;
    businessName: string;
    status: string;
    createdAt: string;
  };
  onboardingProgress: {
    currentStep: string;
    completedSteps: string[];
    completionPercentage: number;
    isCompleted: boolean;
  };
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// Define the User type
export interface IUser {
  id: number;
  fullName: string;
  password: string;
  phone: string;
  photoUrl: null | string;
}

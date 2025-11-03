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
 * Updated to match new API structure
 */
export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    employee: {
      id: number;
      phone: string;
      fullName: string;
      roles: string[];
      tenantId: number;
      activeBranchId: number;
    };
  };
  timestamp: string;
  requestId: string;
}

/**
 * Registration OTP - Send OTP request
 */
export interface SendOTPRequest {
  phone: string;
  businessName: string;
}

/**
 * Registration OTP - Send OTP response (actual API structure)
 */
export interface SendOTPResponse {
  success: boolean;
  data: {
    message: string;
    expiresAt: string; // ISO date string
  };
  timestamp: string;
  requestId: string;
  message: string;
  maskedPhone: string;
  expiresIn: number;
}

/**
 * Registration - Verify OTP request (Step 2)
 * Supports both simple verification and complete registration in one call
 */
export interface VerifyOTPRequest {
  phone: string;
  code?: string;
  otp?: string;
  businessName?: string;
  ownerName?: string;
  password?: string;
}

/**
 * Registration - Verify OTP response (Step 2)
 */
export interface VerifyOTPResponse {
  verified: boolean;
  message: string;
  onboardingProgress: {
    isCompleted: boolean;
    currentStep: string;
  };
}

/**
 * Registration - Complete registration request (Step 3)
 */
export interface CompleteRegistrationRequest {
  phone: string;
  fullName: string;
  email?: string;
  password: string;
}

/**
 * Registration - Complete registration response (Step 3)
 */
export interface CompleteRegistrationResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    employee: {
      id: number;
      phone: string;
      fullName: string;
      roles: string[];
      tenantId: number;
      activeBranchId: number;
    };
  };
  timestamp: string;
  requestId: string;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
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
  photoUrl?: string | null;
}

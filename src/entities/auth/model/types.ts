/**
 * Authentication request payload
 * Corresponds to AuthDto in the backend
 */
export interface AuthRequest {
  phone: string
  password: string
  tenantSlug?: string // Optional for multi-tenant disambiguation
}

/**
 * Authentication response
 * Updated to match new API structure
 */
export interface AuthResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
    employee: {
      id: number
      authUserId?: number // auth_users.id for identity management
      phone: string
      fullName: string
      tenantId: number
      tenantName?: string
      activeBranchId: number
      isOwner: boolean
      branchPermissions: Record<string, string[]> // Map of branchId -> permissions[]
    }
  }
  timestamp: string
  requestId: string
}

/**
 * Magic Link / Invite - Verify invitation token
 */
export interface VerifyInviteRequest {
  token: string
}

/**
 * Magic Link / Invite - Verify invitation response
 */
export interface VerifyInviteResponse {
  valid: boolean
  tenantId?: number
  tenantName?: string
  ownerPhone?: string
  ownerEmail?: string
  requiresPassword?: boolean
  expiresAt?: string
  daysRemaining?: number
  message?: string
}

/**
 * Magic Link / Invite - Complete invitation (set password)
 */
export interface CompleteInviteRequest {
  token: string
  password: string
}

/**
 * Magic Link / Invite - Complete invitation response
 */
export interface CompleteInviteResponse {
  success: boolean
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user?: {
    id: number
    fullName: string
    phone: string
    email?: string
    isOwner: boolean
  }
  tenant?: {
    id: number
    name: string
    slug: string
  }
  message?: string
}

/**
 * Registration OTP - Send OTP request
 */
export interface SendOTPRequest {
  phone: string
  businessName: string
  email?: string
}

/**
 * Registration OTP - Send OTP response (actual API structure)
 */
export interface SendOTPResponse {
  success: boolean
  data: {
    message: string
    expiresAt: string // ISO date string
  }
  timestamp: string
  requestId: string
  message: string
  maskedPhone: string
  expiresIn: number
}

/**
 * Registration - Verify OTP request (Step 2)
 * Supports both simple verification and complete registration in one call
 */
export interface VerifyOTPRequest {
  phone: string
  code?: string
  otp?: string
  businessName?: string
  ownerName?: string
  password?: string
}

/**
 * Registration - Verify OTP response (Step 2)
 */
export interface VerifyOTPResponse {
  verified: boolean
  message: string
  onboardingProgress: {
    isCompleted: boolean
    currentStep: string
  }
}

/**
 * Registration - Complete registration request (Step 3)
 */
export interface CompleteRegistrationRequest {
  phone: string
  fullName: string
  email?: string
  password: string
  businessName?: string // Business name from OTP request
}

/**
 * Registration - Complete registration response (Step 3)
 */
export interface CompleteRegistrationResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
    employee: {
      id: number
      authUserId?: number // auth_users.id for identity management
      phone: string
      fullName: string
      tenantId: number
      tenantName?: string
      activeBranchId: number
      isOwner: boolean
      branchPermissions: Record<string, string[]> // Map of branchId -> permissions[]
    }
  }
  timestamp: string
  requestId: string
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  statusCode: number
  message: string | string[]
  error?: string
}

// Define the User type
export interface IUser {
  id: number
  fullName: string
  password?: string // Optional - not exposed in API responses
  phone: string
  photoUrl?: string | null
  avatar?: {
    original?: string
    thumb?: string
  }
}

// Staff Invite Types (for employees)
export interface VerifyStaffInviteRequest {
  token: string
}

export interface VerifyStaffInviteResponse {
  valid: boolean
  employeeId?: number
  employeeName?: string
  employeePhone?: string
  tenantId?: number
  requiresPassword: boolean
  expiresAt?: string
  daysRemaining?: number
  message?: string
}

export interface CompleteStaffInviteRequest {
  token: string
  password: string
}

export interface CompleteStaffInviteResponse {
  success: boolean
  accessToken: string
  refreshToken: string
  expiresIn: number
  employee: {
    id: number
    fullName: string
    phone: string
  }
  tenant: {
    id: number
    name: string
  }
  message: string
}

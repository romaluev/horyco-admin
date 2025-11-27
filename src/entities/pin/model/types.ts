/**
 * PIN Management Types
 * Based on ADMIN_PIN_MANAGEMENT.md specification
 */

/**
 * Response from PIN generation endpoint
 * PIN is shown only once in this response
 */
export interface IPinGenerateResponse {
  pin: string
  expiresAt: string
  message: string
}

/**
 * Response from PIN status endpoint
 */
export interface IPinStatusResponse {
  employeeId: number
  hasPin: boolean
  pinEnabled: boolean
  isExpired: boolean
  expiresAt: string | null
  daysUntilExpiration: number | null
  lastUsedAt: string | null
  failedAttempts: number
}

/**
 * Request for generating PIN
 */
export interface IGeneratePinRequest {
  employeeId: number
}

/**
 * Request for refreshing own PIN
 */
export interface IRefreshPinRequest {
  currentPassword: string
}

/**
 * PIN status for display
 */
export type PinStatus = 'active' | 'expired' | 'disabled' | 'none'

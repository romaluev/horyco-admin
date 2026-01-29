import { toast } from 'sonner'

import type { AxiosError } from 'axios'

export interface PermissionErrorDetails {
  code: string
  message: string
  details?: {
    requiredPermissions?: string[]
  }
  suggestion?: string
}

export interface PermissionErrorResponse {
  success: false
  error: {
    code: PermissionErrorDetails
    message: string
    details: {
      statusCode: number
    }
  }
  path: string
  timestamp: string
  requestId: string
  statusCode: 403
}

/**
 * Check if error is a permission denied error
 */
export function isPermissionError(
  error: unknown
): error is AxiosError<PermissionErrorResponse> {
  if (!error || typeof error !== 'object') return false

  const axiosError = error as AxiosError

  return !!(
    axiosError?.response?.status === 403 &&
    axiosError?.response?.data &&
    typeof axiosError.response.data === 'object' &&
    'error' in axiosError.response.data
  )
}

/**
 * Extract permission details from error response
 */
export function getPermissionErrorDetails(
  error: unknown
): PermissionErrorDetails | null {
  if (!isPermissionError(error)) return null

  const response = error.response?.data as PermissionErrorResponse
  return response?.error?.code || null
}

/**
 * Show permission error toast with details
 */
export function showPermissionError(
  error: unknown,
  customMessage?: string
): void {
  if (!isPermissionError(error)) return

  const details = getPermissionErrorDetails(error)
  if (!details) return

  const title = customMessage || details.message
  const permissions = details.details?.requiredPermissions || []
  const suggestion = details.suggestion || ''

  let description = ''
  if (permissions.length > 0) {
    description += `Required: ${permissions.join(', ')}\n`
  }
  if (suggestion) {
    description += suggestion
  }

  if (description) {
    toast.error(title, {
      description,
      duration: 6000,
    })
  } else {
    toast.error(title, {
      duration: 5000,
    })
  }
}

/**
 * Handle permission error with logging
 */
export function handlePermissionError(error: unknown, context?: string): void {
  if (!isPermissionError(error)) return

  const details = getPermissionErrorDetails(error)
  const requestId = (error.response?.data as any)?.requestId

  console.warn(`Permission Denied${context ? ` (${context})` : ''}:`, {
    message: details?.message,
    requiredPermissions: details?.details?.requiredPermissions,
    suggestion: details?.suggestion,
    requestId,
  })

  showPermissionError(error)
}

/**
 * Middleware for React Query error handler
 * Use in queryClient errorHandler or in catch blocks
 */
export function createPermissionErrorHandler(
  onPermissionError?: (error: PermissionErrorDetails) => void
) {
  return (error: unknown) => {
    if (isPermissionError(error)) {
      const details = getPermissionErrorDetails(error)
      if (details) {
        if (onPermissionError) {
          onPermissionError(details)
        }
        showPermissionError(error)
      }
    }
  }
}

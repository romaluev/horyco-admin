/**
 * Extract error message from API error response
 * Handles various error response formats from the backend
 */
export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (typeof error !== 'object' || error === null) {
    return defaultMessage
  }

  // Handle axios error response
  if ('response' in error) {
    const axiosError = error as { response?: { data?: unknown } }
    const data = axiosError.response?.data

    if (typeof data === 'object' && data !== null) {
      const errorData = data as Record<string, unknown>

      // Handle our API error format: { error: { message: string, validationErrors: [] } }
      if ('error' in errorData && typeof errorData.error === 'object' && errorData.error !== null) {
        const apiError = errorData.error as Record<string, unknown>

        // Check for validation errors first
        if ('validationErrors' in apiError && Array.isArray(apiError.validationErrors)) {
          const validationErrors = apiError.validationErrors as Array<{ messages?: string[] }>
          const firstError = validationErrors[0]
          if (firstError?.messages?.[0]) {
            const message = firstError.messages[0]
            // Return the message if it's a string, not a number
            if (typeof message === 'string') {
              return message
            }
          }
        }

        // Fall back to main error message
        if ('message' in apiError && typeof apiError.message === 'string') {
          return apiError.message
        }
      }

      // Handle simple { message: string } format
      if ('message' in errorData && typeof errorData.message === 'string') {
        return errorData.message
      }
    }
  }

  // Handle Error instance
  if (error instanceof Error) {
    return error.message
  }

  return defaultMessage
}

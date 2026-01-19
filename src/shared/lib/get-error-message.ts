/**
 * Common error message translations
 */
const ERROR_TRANSLATIONS: Record<string, string> = {
  'already has an active count in progress': 'На этом складе уже есть активная инвентаризация',
  'Warehouse already exists for branch': 'Склад для этого филиала уже существует',
  'Cannot delete warehouse with existing stock': 'Нельзя удалить склад с остатками. Сначала перенесите или спишите товары.',
  'Cannot delete supplier with existing purchase orders': 'Нельзя удалить поставщика с заказами. Деактивируйте его вместо удаления.',
}

/**
 * Try to translate common error messages to Russian
 */
const translateError = (message: string): string => {
  for (const [key, translation] of Object.entries(ERROR_TRANSLATIONS)) {
    if (message.includes(key)) {
      return translation
    }
  }
  return message
}

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

      // Handle our API error format: { error: { message: string, details: { originalError: string }, validationErrors: [] } }
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
              return translateError(message)
            }
          }
        }

        // Check for originalError in details
        if ('details' in apiError && typeof apiError.details === 'object' && apiError.details !== null) {
          const details = apiError.details as Record<string, unknown>
          if ('originalError' in details && typeof details.originalError === 'string') {
            return translateError(details.originalError)
          }
        }

        // Fall back to main error message
        if ('message' in apiError && typeof apiError.message === 'string') {
          return translateError(apiError.message)
        }
      }

      // Handle simple { message: string } format
      if ('message' in errorData && typeof errorData.message === 'string') {
        return translateError(errorData.message)
      }
    }
  }

  // Handle Error instance
  if (error instanceof Error) {
    return translateError(error.message)
  }

  return defaultMessage
}

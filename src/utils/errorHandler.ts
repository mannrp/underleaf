export type ErrorCategory = 'network' | 'processing' | 'validation' | 'unknown'

export interface AppError {
  category: ErrorCategory
  message: string
  originalError?: Error
  details?: string
}

export function categorizeError(error: unknown): AppError {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      category: 'network',
      message: 'Network connection failed. Please check your internet connection.',
      originalError: error as Error,
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('API') || error.message.includes('401') || error.message.includes('403')) {
      return {
        category: 'network',
        message: 'API request failed. Please check your API key and try again.',
        originalError: error,
        details: error.message,
      }
    }

    if (error.message.includes('timeout')) {
      return {
        category: 'network',
        message: 'Request timed out. Please try again.',
        originalError: error,
      }
    }

    if (error.message.includes('parse') || error.message.includes('JSON')) {
      return {
        category: 'processing',
        message: 'Failed to process response. Please try again.',
        originalError: error,
      }
    }

    if (error.message.includes('invalid') || error.message.includes('required')) {
      return {
        category: 'validation',
        message: 'Invalid input. Please check your data and try again.',
        originalError: error,
        details: error.message,
      }
    }

    return {
      category: 'unknown',
      message: error.message || 'An unexpected error occurred.',
      originalError: error,
    }
  }

  return {
    category: 'unknown',
    message: 'An unexpected error occurred.',
  }
}

export function getUserFriendlyMessage(error: unknown): string {
  const appError = categorizeError(error)
  return appError.message
}

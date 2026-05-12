export interface ApiErrorShape {
  message?: string
  details?: unknown
}

export const getFriendlyErrorMessage = (error: unknown): string => {
  const defaultMessage = 'Something went wrong. Please try again.'

  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: ApiErrorShape }).data
    if (data?.message) return data.message
  }

  if (error instanceof Error) return error.message
  return defaultMessage
}

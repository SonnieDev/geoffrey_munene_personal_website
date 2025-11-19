// Error tracking utility
// This is a basic implementation. For production, consider using Sentry or similar service

const isDevelopment = import.meta.env.DEV

export const logError = (error, errorInfo = {}) => {
  // In development, log to console
  if (isDevelopment) {
    console.error('Error logged:', error, errorInfo)
    return
  }

  // In production, you would send to error tracking service
  // Example with Sentry:
  // Sentry.captureException(error, { extra: errorInfo })

  // For now, we'll just log to console
  // You can extend this to send to your backend API
  console.error('Production error:', error, errorInfo)

  // Optional: Send to your backend API
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ error: error.toString(), errorInfo, url: window.location.href })
  // }).catch(err => console.error('Failed to log error:', err))
}

export const logApiError = (error, endpoint, method = 'GET') => {
  logError(error, {
    type: 'api_error',
    endpoint,
    method,
    status: error.response?.status,
    statusText: error.response?.statusText,
  })
}

export const logComponentError = (error, componentName, props = {}) => {
  logError(error, {
    type: 'component_error',
    component: componentName,
    props: Object.keys(props), // Only log prop keys, not values (for privacy)
  })
}


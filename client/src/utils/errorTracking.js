// Error tracking utility
// This is a basic implementation. For production, consider using Sentry or similar service

const isDevelopment = import.meta.env.DEV

export const logError = (error, errorInfo = {}) => {
  // Always log to console
  console.error('Error logged:', error, errorInfo)

  // Send to backend for dev tools (only if admin is logged in)
  const token = localStorage.getItem('adminToken')
  if (token) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    fetch(`${apiUrl}/admin/dev/logs/errors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        error: {
          message: error.message || String(error),
          stack: error.stack,
        },
        context: errorInfo,
      }),
    }).catch(() => {
      // Silently fail if logging fails
    })
  }

  // In production, you would also send to error tracking service
  // Example with Sentry:
  // if (!isDevelopment) {
  //   Sentry.captureException(error, { extra: errorInfo })
  // }
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


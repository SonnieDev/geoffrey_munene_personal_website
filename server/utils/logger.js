// Centralized logging utility
// In production, use a proper logging library like Winston
// For now, this provides a consistent interface that can be easily upgraded

const isDevelopment = process.env.NODE_ENV === 'development'

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
}

const currentLogLevel = isDevelopment ? logLevels.DEBUG : logLevels.INFO

const formatMessage = (level, message, ...args) => {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level}]`
  
  if (args.length > 0) {
    return [`${prefix} ${message}`, ...args]
  }
  return `${prefix} ${message}`
}

const logger = {
  error: (message, ...args) => {
    if (currentLogLevel >= logLevels.ERROR) {
      const formatted = formatMessage('ERROR', message, ...args)
      if (Array.isArray(formatted)) {
        console.error(...formatted)
      } else {
        console.error(formatted)
      }
    }
  },
  
  warn: (message, ...args) => {
    if (currentLogLevel >= logLevels.WARN) {
      const formatted = formatMessage('WARN', message, ...args)
      if (Array.isArray(formatted)) {
        console.warn(...formatted)
      } else {
        console.warn(formatted)
      }
    }
  },
  
  info: (message, ...args) => {
    if (currentLogLevel >= logLevels.INFO) {
      const formatted = formatMessage('INFO', message, ...args)
      if (Array.isArray(formatted)) {
        console.log(...formatted)
      } else {
        console.log(formatted)
      }
    }
  },
  
  debug: (message, ...args) => {
    if (currentLogLevel >= logLevels.DEBUG) {
      const formatted = formatMessage('DEBUG', message, ...args)
      if (Array.isArray(formatted)) {
        console.log(...formatted)
      } else {
        console.log(formatted)
      }
    }
  },
  
  // Convenience methods for common use cases
  api: (req, res, responseTime) => {
    const method = req.method
    const url = req.originalUrl || req.url
    const status = res.statusCode
    const ip = req.ip || req.connection.remoteAddress
    
    logger.info(`API ${method} ${url} ${status} ${responseTime}ms - ${ip}`)
  },
  
  errorWithContext: (error, context = {}) => {
    logger.error(`Error: ${error.message}`, {
      stack: error.stack,
      ...context,
    })
  },
}

export default logger


import mongoose from 'mongoose'
import Blog from '../models/Blog.js'
import Job from '../models/Job.js'
import Contact from '../models/Contact.js'
import Testimonial from '../models/Testimonial.js'
import Admin from '../models/Admin.js'

// In-memory storage for logs (in production, use a proper logging service)
const errorLogs = []
const apiRequestLogs = []
const MAX_LOGS = 1000 // Keep last 1000 logs

// Store error log
export const logError = (error, context = {}) => {
  const logEntry = {
    id: Date.now() + Math.random(),
    timestamp: new Date(),
    type: 'error',
    message: error.message || String(error),
    stack: error.stack,
    context,
  }
  errorLogs.unshift(logEntry)
  if (errorLogs.length > MAX_LOGS) {
    errorLogs.pop()
  }
  console.error('Error logged:', logEntry)
}

// Store API request log
export const logApiRequest = (req, res, responseTime) => {
  // Use originalUrl if available, otherwise use path
  const path = req.originalUrl || req.url || req.path
  
  const logEntry = {
    id: Date.now() + Math.random(),
    timestamp: new Date(),
    method: req.method,
    path: path,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown',
    userAgent: req.get('user-agent') || 'unknown',
    userId: req.admin?._id || null,
  }
  apiRequestLogs.unshift(logEntry)
  if (apiRequestLogs.length > MAX_LOGS) {
    apiRequestLogs.pop()
  }
  // Debug log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('API Request logged:', logEntry.method, logEntry.path, logEntry.statusCode)
  }
}

// @desc    Get system health
// @route   GET /api/admin/dev/health
// @access  Private (Dev, Admin, Super Admin)
export const getSystemHealth = async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    }

    // Get memory usage
    const memoryUsage = process.memoryUsage()
    const formatBytes = (bytes) => {
      return (bytes / 1024 / 1024).toFixed(2) + ' MB'
    }

    // Get uptime
    const uptime = process.uptime()
    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / 86400)
      const hours = Math.floor((seconds % 86400) / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${days}d ${hours}h ${minutes}m`
    }

    res.json({
      success: true,
      data: {
        server: {
          status: 'running',
          uptime: formatUptime(uptime),
          nodeVersion: process.version,
          platform: process.platform,
        },
        database: {
          status: dbStates[dbState] || 'unknown',
          connected: dbState === 1,
          name: mongoose.connection.name,
        },
        memory: {
          rss: formatBytes(memoryUsage.rss),
          heapTotal: formatBytes(memoryUsage.heapTotal),
          heapUsed: formatBytes(memoryUsage.heapUsed),
          external: formatBytes(memoryUsage.external),
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || 'development',
          port: process.env.PORT || 5000,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get system health',
      error: error.message,
    })
  }
}

// @desc    Get database statistics
// @route   GET /api/admin/dev/stats
// @access  Private (Dev, Admin, Super Admin)
export const getDatabaseStats = async (req, res) => {
  try {
    const [blogs, jobs, contacts, testimonials, admins] = await Promise.all([
      Blog.countDocuments(),
      Job.countDocuments(),
      Contact.countDocuments(),
      Testimonial.countDocuments(),
      Admin.countDocuments(),
    ])

    // Get recent activity counts (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const [recentBlogs, recentJobs, recentContacts, recentTestimonials] = await Promise.all([
      Blog.countDocuments({ createdAt: { $gte: oneDayAgo } }),
      Job.countDocuments({ createdAt: { $gte: oneDayAgo } }),
      Contact.countDocuments({ createdAt: { $gte: oneDayAgo } }),
      Testimonial.countDocuments({ createdAt: { $gte: oneDayAgo } }),
    ])

    res.json({
      success: true,
      data: {
        collections: {
          blogs: {
            total: blogs,
            recent: recentBlogs,
          },
          jobs: {
            total: jobs,
            recent: recentJobs,
          },
          contacts: {
            total: contacts,
            recent: recentContacts,
          },
          testimonials: {
            total: testimonials,
            recent: recentTestimonials,
          },
          admins: {
            total: admins,
            recent: 0, // Admins are rarely created
          },
        },
        database: {
          name: mongoose.connection.name,
          collections: Object.keys(mongoose.connection.collections).length,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get database stats',
      error: error.message,
    })
  }
}

// @desc    Get error logs
// @route   GET /api/admin/dev/logs/errors
// @access  Private (Dev, Admin, Super Admin)
export const getErrorLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    const logs = errorLogs.slice(0, limit)

    res.json({
      success: true,
      data: {
        logs,
        total: errorLogs.length,
        limit,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get error logs',
      error: error.message,
    })
  }
}

// @desc    Store error log (POST from client)
// @route   POST /api/admin/dev/logs/errors
// @access  Private (Dev, Admin, Super Admin)
export const storeErrorLog = async (req, res) => {
  try {
    const { error, context } = req.body
    
    if (!error) {
      return res.status(400).json({
        success: false,
        message: 'Error object is required',
      })
    }

    // Use the logError function to store the error
    logError(error, context || {})

    res.json({
      success: true,
      message: 'Error logged successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to store error log',
      error: error.message,
    })
  }
}

// @desc    Get API request logs
// @route   GET /api/admin/dev/logs/requests
// @access  Private (Dev, Admin, Super Admin)
export const getApiRequestLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100
    const method = req.query.method
    const statusCode = req.query.statusCode

    let logs = apiRequestLogs

    // Filter by method if provided
    if (method) {
      logs = logs.filter((log) => log.method === method.toUpperCase())
    }

    // Filter by status code if provided
    if (statusCode) {
      logs = logs.filter((log) => log.statusCode === parseInt(statusCode))
    }

    logs = logs.slice(0, limit)

    res.json({
      success: true,
      data: {
        logs,
        total: apiRequestLogs.length,
        limit,
        filters: {
          method: method || null,
          statusCode: statusCode || null,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get API request logs',
      error: error.message,
    })
  }
}

// @desc    Clear logs
// @route   DELETE /api/admin/dev/logs
// @access  Private (Dev, Admin, Super Admin)
export const clearLogs = async (req, res) => {
  try {
    const { type } = req.body

    if (type === 'errors') {
      errorLogs.length = 0
    } else if (type === 'requests') {
      apiRequestLogs.length = 0
    } else if (type === 'all') {
      errorLogs.length = 0
      apiRequestLogs.length = 0
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid log type. Use "errors", "requests", or "all"',
      })
    }

    res.json({
      success: true,
      message: `Cleared ${type} logs`,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear logs',
      error: error.message,
    })
  }
}


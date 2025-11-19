import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import connectDB from './config/database.js'
import contactRoutes from './routes/contactRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import toolsRoutes from './routes/toolsRoutes.js'
import youtubeRoutes from './routes/youtubeRoutes.js'
import jobsRoutes from './routes/jobsRoutes.js'
import authRoutes from './routes/authRoutes.js'
import adminJobRoutes from './routes/adminJobRoutes.js'
import adminBlogRoutes from './routes/adminBlogRoutes.js'
import adminContactRoutes from './routes/adminContactRoutes.js'
import testimonialRoutes from './routes/testimonialRoutes.js'
import adminTestimonialRoutes from './routes/adminTestimonialRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import devToolsRoutes from './routes/devToolsRoutes.js'
import { logApiRequest } from './controllers/devToolsController.js'

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// CORS configuration - MUST be before other middleware for preflight requests
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.FRONTEND_URL || 'https://geoffreymunene.netlify.app',
      'https://geoffreymunene.com',
      'https://www.geoffreymunene.com'
    ].filter(Boolean) // Remove any undefined values
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174']

app.use(cors({
  origin: function (origin, callback) {
    // In production, be strict about origins
    if (process.env.NODE_ENV === 'production') {
      // Allow requests with no origin only for same-origin requests
      if (!origin) {
        return callback(new Error('CORS: Origin header required in production'))
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`))
      }
    } else {
      // In development, allow localhost origins
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
}))

// Security Middleware
// Helmet helps secure Express apps by setting various HTTP headers
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for images
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}

// In development, allow localhost connections
if (process.env.NODE_ENV === 'development') {
  helmetConfig.contentSecurityPolicy.directives.imgSrc.push("http:")
  helmetConfig.contentSecurityPolicy.directives.connectSrc.push(
    "http://localhost:5000",
    "http://localhost:5173",
    "http://localhost:3000"
  )
}

app.use(helmet(helmetConfig))

// Rate limiting
// General API rate limiter (skip OPTIONS requests for CORS preflight)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // Skip preflight requests
})

// Stricter rate limiter for auth endpoints (skip OPTIONS requests)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // Skip preflight requests
})

// Stricter rate limiter for AI tools (more expensive)
const toolsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 requests per hour
  message: 'Too many tool requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply rate limiting (after CORS to allow preflight requests)
app.use('/api/', apiLimiter)
app.use('/api/admin/login', authLimiter)
app.use('/api/tools', toolsLimiter)

// Security: Limit request body size
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Middleware to log API requests (for dev tools) - must be after body parser
app.use((req, res, next) => {
  const startTime = Date.now()
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    // Only log admin API requests - check both originalUrl and path
    const urlToCheck = req.originalUrl || req.url || req.path
    if (urlToCheck.startsWith('/api/admin')) {
      try {
        logApiRequest(req, res, responseTime)
      } catch (error) {
        // Silently fail if logging fails
        console.error('Failed to log API request:', error)
      }
    }
  })
  
  next()
})

// Routes
app.use('/api/contact', contactRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/tools', toolsRoutes)
app.use('/api/youtube', youtubeRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/testimonials', testimonialRoutes)

// Admin routes
app.use('/api/admin', authRoutes)
app.use('/api/admin/jobs', adminJobRoutes)
app.use('/api/admin/blogs', adminBlogRoutes)
app.use('/api/admin/contacts', adminContactRoutes)
app.use('/api/admin/testimonials', adminTestimonialRoutes)
app.use('/api/admin/admins', adminRoutes)
app.use('/api/admin/dev', devToolsRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
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

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
// CORS configuration - Update allowedOrigins for production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.FRONTEND_URL || 'https://geoffreymunene.netlify.app',
      'https://geoffreymunene.com',
      'https://www.geoffreymunene.com'
    ]
  : ['http://localhost:5173', 'http://localhost:3000']

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Security: Limit request body size
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/api/contact', contactRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/tools', toolsRoutes)
app.use('/api/youtube', youtubeRoutes)
app.use('/api/jobs', jobsRoutes)

// Admin routes
app.use('/api/admin', authRoutes)
app.use('/api/admin/jobs', adminJobRoutes)
app.use('/api/admin/blogs', adminBlogRoutes)
app.use('/api/admin/contacts', adminContactRoutes)

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


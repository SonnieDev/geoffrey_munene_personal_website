import express from 'express'
import { register, login, getMe, changePassword } from '../controllers/userAuthController.js'
import { protect } from '../middleware/userAuthMiddleware.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/me', protect, getMe)
router.put('/password', protect, changePassword)

export default router


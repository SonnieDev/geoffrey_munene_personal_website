import express from 'express'
import { getContentHistory, getContentById, deleteContent } from '../controllers/userContentController.js'
import { protect } from '../middleware/userAuthMiddleware.js'

const router = express.Router()

// All routes require authentication
router.get('/content', protect, getContentHistory)
router.get('/content/:id', protect, getContentById)
router.delete('/content/:id', protect, deleteContent)

export default router


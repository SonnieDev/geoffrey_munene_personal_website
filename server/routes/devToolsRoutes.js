import express from 'express'
import {
  getSystemHealth,
  getDatabaseStats,
  getErrorLogs,
  storeErrorLog,
  getApiRequestLogs,
  clearLogs,
} from '../controllers/devToolsController.js'
import { protect } from '../middleware/authMiddleware.js'
import { requireActive, requireRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All routes require authentication, active account, and dev role
router.use(protect)
router.use(requireActive)
router.use(requireRole('dev')) // Dev tools are dev-only

// Dev tools routes (dev role only)
router.get('/health', getSystemHealth)
router.get('/stats', getDatabaseStats)
router.get('/logs/errors', getErrorLogs)
router.post('/logs/errors', storeErrorLog) // Store error logs from client
router.get('/logs/requests', getApiRequestLogs)
router.delete('/logs', clearLogs)

export default router


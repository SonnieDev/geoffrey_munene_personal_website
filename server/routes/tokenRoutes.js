import express from 'express'
import {
  getBalance,
  getTransactions,
  initializePayment,
  handleWebhook,
  verifyPayment,
} from '../controllers/tokenController.js'
import { protect } from '../middleware/userAuthMiddleware.js'

const router = express.Router()

// Protected routes (require authentication)
router.get('/balance', protect, getBalance)
router.get('/transactions', protect, getTransactions)
router.post('/initialize-payment', protect, initializePayment)
router.post('/verify-payment', protect, verifyPayment)

// Webhook route (public, handled in server.js)

export default router


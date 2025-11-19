import express from 'express'
import {
  getBalance,
  getTransactions,
  initializePayment,
  handleWebhook,
  verifyPayment,
} from '../controllers/tokenController.js'

const router = express.Router()

// Regular routes
router.get('/balance', getBalance)
router.get('/transactions', getTransactions)
router.post('/initialize-payment', initializePayment)
router.post('/verify-payment', verifyPayment)

export default router


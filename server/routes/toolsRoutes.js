import express from 'express'
import {
  generateResume,
  generateCoverLetter,
  generateEmail,
  generateInterviewPrep,
  generateSkillsAssessment,
  generateSalaryNegotiation,
} from '../controllers/toolsController.js'
import { checkTokens } from '../middleware/tokenMiddleware.js'
import { protect } from '../middleware/userAuthMiddleware.js'

const router = express.Router()

// Routes with authentication and token middleware
// protect ensures user is logged in, checkTokens verifies they have enough tokens
router.post('/resume', protect, checkTokens, generateResume)
router.post('/cover-letter', protect, checkTokens, generateCoverLetter)
router.post('/email', protect, checkTokens, generateEmail)
router.post('/interview-prep', protect, checkTokens, generateInterviewPrep)
router.post('/skills-assessment', protect, checkTokens, generateSkillsAssessment)
router.post('/salary-negotiation', protect, checkTokens, generateSalaryNegotiation)

export default router


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

const router = express.Router()

// Routes with token middleware
router.post('/resume', checkTokens, generateResume)
router.post('/cover-letter', checkTokens, generateCoverLetter)
router.post('/email', checkTokens, generateEmail)
router.post('/interview-prep', checkTokens, generateInterviewPrep)
router.post('/skills-assessment', checkTokens, generateSkillsAssessment)
router.post('/salary-negotiation', checkTokens, generateSalaryNegotiation)

export default router


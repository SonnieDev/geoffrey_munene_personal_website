import express from 'express'
import {
  generateResume,
  generateCoverLetter,
  generateEmail,
  generateInterviewPrep,
  generateSkillsAssessment,
  generateSalaryNegotiation,
} from '../controllers/toolsController.js'

const router = express.Router()

// Routes
router.post('/resume', generateResume)
router.post('/cover-letter', generateCoverLetter)
router.post('/email', generateEmail)
router.post('/interview-prep', generateInterviewPrep)
router.post('/skills-assessment', generateSkillsAssessment)
router.post('/salary-negotiation', generateSalaryNegotiation)

export default router


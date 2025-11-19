import express from 'express'
import { updatePreferences, getOnboardingStatus, updateOnboardingStep } from '../controllers/userOnboardingController.js'
import { protect } from '../middleware/userAuthMiddleware.js'

const router = express.Router()

// All routes require authentication
router.get('/onboarding', protect, getOnboardingStatus)
router.put('/preferences', protect, updatePreferences)
router.put('/onboarding/step', protect, updateOnboardingStep)

export default router


import express from 'express'
import {
  getRemoteJobs,
  getJobCategories,
} from '../controllers/jobsController.js'

const router = express.Router()

// Routes
router.get('/', getRemoteJobs)
router.get('/categories', getJobCategories)

export default router


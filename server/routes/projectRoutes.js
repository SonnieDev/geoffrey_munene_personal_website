import express from 'express'
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js'
import { body } from 'express-validator'

const router = express.Router()

// Validation rules
const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
]

// Routes
router.get('/', getProjects)
router.get('/:id', getProjectById)
router.post('/', projectValidation, createProject)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

export default router


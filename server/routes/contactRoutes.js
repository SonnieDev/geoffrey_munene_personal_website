import express from 'express'
import {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js'
import { body } from 'express-validator'

const router = express.Router()

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters'),
]

// Routes
router.post('/', contactValidation, createContact)
router.get('/', getContacts)
router.get('/:id', getContactById)
router.put('/:id', updateContactStatus)
router.delete('/:id', deleteContact)

export default router


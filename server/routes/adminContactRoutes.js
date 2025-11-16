import express from 'express'
import {
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes are protected
router.use(protect)

router.get('/', getContacts)
router.get('/:id', getContactById)
router.put('/:id', updateContactStatus)
router.delete('/:id', deleteContact)

export default router


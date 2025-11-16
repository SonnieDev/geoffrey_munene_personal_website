import Contact from '../models/Contact.js'
import { validationResult } from 'express-validator'

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const { name, email, subject, message } = req.body

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    })

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: contact,
    })
  } catch (error) {
    console.error('Error creating contact:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send contact message',
      error: error.message,
    })
  }
}

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (should be protected in production)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages',
      error: error.message,
    })
  }
}

// @desc    Get a single contact message
// @route   GET /api/contact/:id
// @access  Private (should be protected in production)
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      })
    }

    res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.error('Error fetching contact:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message',
      error: error.message,
    })
  }
}

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private (should be protected in production)
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact,
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status',
      error: error.message,
    })
  }
}

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private (should be protected in production)
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting contact:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message',
      error: error.message,
    })
  }
}


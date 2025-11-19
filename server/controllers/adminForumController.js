import Forum from '../models/Forum.js'
import ForumThread from '../models/ForumThread.js'
import { validationResult } from 'express-validator'

// @desc    Get all forums
// @route   GET /api/admin/forums
// @access  Private
export const getAdminForums = async (req, res) => {
  try {
    const forums = await Forum.find({})
      .sort({ category: 1, name: 1 })

    // Populate thread counts for each forum
    const forumsWithCounts = await Promise.all(
      forums.map(async (forum) => {
        const threadCount = await ForumThread.countDocuments({ forum: forum._id })
        return {
          ...forum.toObject(),
          threadCount,
        }
      })
    )

    res.status(200).json({
      success: true,
      count: forumsWithCounts.length,
      data: forumsWithCounts,
    })
  } catch (error) {
    console.error('Error fetching forums:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forums',
      error: error.message,
    })
  }
}

// @desc    Get single forum
// @route   GET /api/admin/forums/:id
// @access  Private
export const getAdminForumById = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id)

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found',
      })
    }

    res.status(200).json({
      success: true,
      data: forum,
    })
  } catch (error) {
    console.error('Error fetching forum:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum',
      error: error.message,
    })
  }
}

// @desc    Create new forum
// @route   POST /api/admin/forums
// @access  Private
export const createAdminForum = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const forum = await Forum.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Forum created successfully',
      data: forum,
    })
  } catch (error) {
    console.error('Error creating forum:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create forum',
      error: error.message,
    })
  }
}

// @desc    Update forum
// @route   PUT /api/admin/forums/:id
// @access  Private
export const updateAdminForum = async (req, res) => {
  try {
    const forum = await Forum.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Forum updated successfully',
      data: forum,
    })
  } catch (error) {
    console.error('Error updating forum:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update forum',
      error: error.message,
    })
  }
}

// @desc    Delete forum
// @route   DELETE /api/admin/forums/:id
// @access  Private
export const deleteAdminForum = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id)

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found',
      })
    }

    // Check if forum has threads
    const threadCount = await ForumThread.countDocuments({ forum: forum._id })
    if (threadCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete forum. It has ${threadCount} thread(s). Please delete or move threads first.`,
      })
    }

    await Forum.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Forum deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting forum:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete forum',
      error: error.message,
    })
  }
}


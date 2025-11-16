import Job from '../models/Job.js'
import { validationResult } from 'express-validator'

// @desc    Get all manual jobs
// @route   GET /api/admin/jobs
// @access  Private
export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ source: 'manual' }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    })
  } catch (error) {
    console.error('Error fetching admin jobs:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
    })
  }
}

// @desc    Get single job
// @route   GET /api/admin/jobs/:id
// @access  Private
export const getAdminJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    res.status(200).json({
      success: true,
      data: job,
    })
  } catch (error) {
    console.error('Error fetching job:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message,
    })
  }
}

// @desc    Create new job
// @route   POST /api/admin/jobs
// @access  Private
export const createAdminJob = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const job = await Job.create({
      ...req.body,
      source: 'manual',
    })

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    })
  } catch (error) {
    console.error('Error creating job:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message,
    })
  }
}

// @desc    Update job
// @route   PUT /api/admin/jobs/:id
// @access  Private
export const updateAdminJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    })
  } catch (error) {
    console.error('Error updating job:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message,
    })
  }
}

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private
export const deleteAdminJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting job:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message,
    })
  }
}


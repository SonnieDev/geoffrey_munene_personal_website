import axios from 'axios'
import Job from '../models/Job.js'

// @desc    Get remote jobs from Adzuna API and manual jobs
// @route   GET /api/jobs
// @access  Public
export const getRemoteJobs = async (req, res) => {
  try {
    const { 
      search = '', 
      location = 'us', 
      page = 1, 
      results_per_page = 20,
      category = '',
      sort_by = 'date'
    } = req.query

    // Get manual jobs from database
    let manualJobs = []
    try {
      const manualJobsData = await Job.find({ active: true, source: 'manual' }).sort({ createdAt: -1 })
      manualJobs = manualJobsData.map((job) => ({
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        salaryMin: job.salary ? parseInt(job.salary.match(/\d+/)?.[0]) : null,
        salaryMax: job.salary ? parseInt(job.salary.match(/\d+/g)?.[1] || job.salary.match(/\d+/)?.[0]) : null,
        salaryCurrency: 'USD',
        created: job.createdAt.toISOString(),
        url: job.applyUrl,
        category: job.category,
        contractType: job.contractType,
        source: 'manual',
      }))
    } catch (error) {
      console.error('Error fetching manual jobs:', error)
    }

    const apiKey = process.env.ADZUNA_API_KEY
    const appId = process.env.ADZUNA_APP_ID

    if (!apiKey || !appId) {
      // Return manual jobs + sample jobs if API not configured
      const allJobs = [...manualJobs, ...getSampleJobs()]
      return res.status(200).json({
        success: true,
        data: allJobs,
        message: 'Using manual and sample jobs. Add ADZUNA_API_KEY and ADZUNA_APP_ID to .env for real job listings.',
        pagination: {
          current: 1,
          total: 1,
        },
      })
    }

    try {
      // Build Adzuna API URL
      const baseUrl = `https://api.adzuna.com/v1/api/jobs/${location}/search/${page}`
      const params = {
        app_id: appId,
        app_key: apiKey,
        results_per_page: parseInt(results_per_page),
        what: search || 'remote',
        sort_by: sort_by,
      }

      // Add category if provided
      if (category) {
        params.category = category
      }

      const response = await axios.get(baseUrl, { params })

      // Transform Adzuna jobs to our format
      const adzunaJobs = response.data.results.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company?.display_name || 'Company not specified',
        location: job.location?.display_name || 'Remote',
        description: job.description || '',
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        salaryCurrency: job.salary_is_predicted ? 'USD' : (job.salary_currency || 'USD'),
        created: job.created,
        url: job.redirect_url,
        category: job.category?.label || 'General',
        contractType: job.contract_type || 'Full-time',
        source: 'adzuna',
      }))

      // Combine manual jobs with Adzuna jobs (manual jobs first)
      const allJobs = [...manualJobs, ...adzunaJobs]

      res.status(200).json({
        success: true,
        data: allJobs,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(response.data.count / results_per_page),
          count: response.data.count + manualJobs.length,
        },
      })
    } catch (apiError) {
      console.error('Adzuna API Error:', apiError.message)
      // Fallback to manual jobs + sample jobs
      const allJobs = [...manualJobs, ...getSampleJobs()]
      res.status(200).json({
        success: true,
        data: allJobs,
        message: 'API error. Using manual and sample jobs.',
        pagination: {
          current: 1,
          total: 1,
        },
      })
    }
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
    })
  }
}

// Sample jobs for when API is not configured
const getSampleJobs = () => {
  return [
    {
      id: 1,
      title: 'Remote Software Developer',
      company: 'Tech Solutions Inc.',
      location: 'Remote (US)',
      description: 'We are looking for an experienced software developer to join our remote team...',
      salaryMin: 80000,
      salaryMax: 120000,
      salaryCurrency: 'USD',
      created: new Date().toISOString(),
      url: 'https://example.com/job/1',
      category: 'IT & Software',
      contractType: 'Full-time',
    },
    {
      id: 2,
      title: 'Remote Customer Support Specialist',
      company: 'Customer First Co.',
      location: 'Remote (Global)',
      description: 'Join our customer support team and help customers from around the world...',
      salaryMin: 35000,
      salaryMax: 45000,
      salaryCurrency: 'USD',
      created: new Date().toISOString(),
      url: 'https://example.com/job/2',
      category: 'Customer Service',
      contractType: 'Full-time',
    },
  ]
}

// @desc    Get job categories
// @route   GET /api/jobs/categories
// @access  Public
export const getJobCategories = async (req, res) => {
  try {
    const categories = [
      { value: '', label: 'All Categories' },
      { value: 'it-jobs', label: 'IT & Software' },
      { value: 'sales-jobs', label: 'Sales' },
      { value: 'marketing-jobs', label: 'Marketing' },
      { value: 'customer-service-jobs', label: 'Customer Service' },
      { value: 'design-jobs', label: 'Design' },
      { value: 'writing-jobs', label: 'Writing & Content' },
      { value: 'accounting-jobs', label: 'Accounting & Finance' },
      { value: 'hr-jobs', label: 'Human Resources' },
      { value: 'project-management-jobs', label: 'Project Management' },
    ]

    res.status(200).json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    })
  }
}


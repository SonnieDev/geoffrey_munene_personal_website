import Job from '../models/Job.js'

// Cache duration: 30 minutes (1800000 ms)
const CACHE_DURATION = 30 * 60 * 1000

/**
 * Get cached jobs from database
 * @param {string} source - 'himalayas', 'adzuna', or 'all'
 * @returns {Promise<Array>} Cached jobs
 */
export const getCachedJobs = async (source = 'himalayas') => {
  try {
    const cacheExpiry = new Date(Date.now() - CACHE_DURATION)
    
    // Get jobs from cache that are still fresh
    const cachedJobs = await Job.find({
      source: source === 'all' ? { $in: ['himalayas', 'adzuna'] } : source,
      createdAt: { $gte: cacheExpiry },
      active: true,
    }).sort({ createdAt: -1 })

    return cachedJobs
  } catch (error) {
    console.error('Error getting cached jobs:', error)
    return []
  }
}

/**
 * Check if cache is fresh
 * @param {string} source - 'himalayas', 'adzuna', or 'all'
 * @returns {Promise<boolean>} True if cache exists and is fresh
 */
export const isCacheFresh = async (source = 'himalayas') => {
  try {
    const cacheExpiry = new Date(Date.now() - CACHE_DURATION)
    
    const count = await Job.countDocuments({
      source: source === 'all' ? { $in: ['himalayas', 'adzuna'] } : source,
      createdAt: { $gte: cacheExpiry },
      active: true,
    })

    return count > 0
  } catch (error) {
    console.error('Error checking cache freshness:', error)
    return false
  }
}

/**
 * Store jobs in cache (database)
 * @param {Array} jobs - Jobs to cache
 * @param {string} source - 'himalayas' or 'adzuna'
 * @returns {Promise<void>}
 */
export const cacheJobs = async (jobs, source) => {
  try {
    // Delete old cached jobs from this source (older than cache duration)
    const cacheExpiry = new Date(Date.now() - CACHE_DURATION)
    await Job.deleteMany({
      source,
      createdAt: { $lt: cacheExpiry },
    })

    // Insert new jobs
    const jobsToInsert = jobs.map((job) => ({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      salary: job.salaryMin && job.salaryMax 
        ? `${job.salaryCurrency} ${job.salaryMin} - ${job.salaryMax}`
        : job.salaryMin 
        ? `${job.salaryCurrency} ${job.salaryMin}+`
        : '',
      contractType: job.contractType || 'Full-time',
      category: job.category || 'General',
      applyUrl: job.url,
      source,
      externalId: job.id,
      companyLogo: job.companyLogo || null,
      pubDate: job.created ? new Date(job.created) : new Date(),
      active: true,
    }))

    // Use bulkWrite with upsert to avoid duplicates
    const bulkOps = jobsToInsert.map((job) => ({
      updateOne: {
        filter: { 
          externalId: job.externalId,
          source: job.source,
        },
        update: { $set: job },
        upsert: true,
      },
    }))

    if (bulkOps.length > 0) {
      await Job.bulkWrite(bulkOps)
      console.log(`✅ Cached ${jobs.length} jobs from ${source}`)
    }
  } catch (error) {
    console.error(`Error caching jobs from ${source}:`, error)
  }
}

/**
 * Clean up old cached jobs (older than 24 hours)
 * @returns {Promise<void>}
 */
export const cleanupOldCache = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const result = await Job.deleteMany({
      source: { $in: ['himalayas', 'adzuna'] },
      createdAt: { $lt: oneDayAgo },
    })
    console.log(`🧹 Cleaned up ${result.deletedCount} old cached jobs`)
  } catch (error) {
    console.error('Error cleaning up old cache:', error)
  }
}


import mongoose from 'mongoose'
import axios from 'axios'
import dotenv from 'dotenv'
import connectDB from '../config/database.js'
import Job from '../models/Job.js'

dotenv.config()

// Helper function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

// Fetch jobs from Himalayas API
const fetchHimalayasJobs = async (keywords = [], maxPages = 5) => {
  const allJobs = []
  const limit = 20 // Himalayas API max per request
  const seenIds = new Set()

  const apiUrl = 'https://himalayas.app/jobs/api'

  for (const keyword of keywords) {
    console.log(`\n🔍 Searching for: "${keyword}"`)
    
    for (let page = 1; page <= maxPages; page++) {
      const offset = (page - 1) * limit
      
      try {
        const response = await axios.get(apiUrl, {
          params: { limit, offset },
          timeout: 30000, // Increased timeout
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
          },
        })

        if (!response.data || !Array.isArray(response.data)) {
          console.log(`  ⚠️  No data returned for page ${page}`)
          break
        }

        // Filter jobs by keyword
        const filteredJobs = response.data.filter((job) => {
          const searchText = `${job.title || ''} ${job.description || ''} ${job.category || ''} ${job.companyName || ''}`.toLowerCase()
          return searchText.includes(keyword.toLowerCase())
        })

        console.log(`  📄 Page ${page}: Found ${filteredJobs.length} matching jobs (out of ${response.data.length} total)`)

        // Transform and add jobs
        for (const job of filteredJobs) {
          const externalId = `himalayas-${job.guid || job.title?.replace(/\s+/g, '-').toLowerCase()}`
          
          // Skip if we've already seen this job
          if (seenIds.has(externalId)) {
            continue
          }
          seenIds.add(externalId)

          const description = stripHtml(job.description || job.excerpt || '')
          
          allJobs.push({
            externalId,
            title: job.title || 'Job Title Not Available',
            company: job.companyName || 'Company Not Specified',
            location: job.locationRestrictions || 'Remote',
            description: description || 'No description available',
            salary: '', // Himalayas API doesn't provide salary in this endpoint
            contractType: mapEmploymentType(job.employmentType),
            category: job.category || 'General',
            applyUrl: job.applicationLink || '#',
            source: 'himalayas',
            active: true,
            featured: false,
            companyLogo: job.companyLogo || null,
            // Store additional metadata in description if needed
            pubDate: job.pubDate || new Date().toISOString(),
          })
        }

        // If we got less than limit, we've reached the end
        if (response.data.length < limit) {
          break
        }

        // Small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        const isConnectionError = 
          error.code === 'ECONNREFUSED' || 
          error.code === 'ETIMEDOUT' || 
          error.code === 'ENOTFOUND' ||
          error.code === 'ECONNRESET' ||
          error.message?.includes('timeout') || 
          error.message?.includes('Connection') ||
          error.message?.includes('Network Error') ||
          error.message?.includes('getaddrinfo')
        
        if (isConnectionError) {
          console.error(`  ❌ Connection error on page ${page} for "${keyword}":`, error.message || error.code)
          console.log(`  ⏳ Waiting 5 seconds before retrying...`)
          await new Promise(resolve => setTimeout(resolve, 5000))
          // Retry once
          try {
            const retryResponse = await axios.get(apiUrl, {
              params: { limit, offset },
              timeout: 30000, // Increased timeout for retry
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            })
            // Process response if retry succeeds
            if (retryResponse.data && Array.isArray(retryResponse.data)) {
              const filteredJobs = retryResponse.data.filter((job) => {
                const searchText = `${job.title || ''} ${job.description || ''} ${job.category || ''} ${job.companyName || ''}`.toLowerCase()
                return searchText.includes(keyword.toLowerCase())
              })
              console.log(`  📄 Page ${page} (retry): Found ${filteredJobs.length} matching jobs (out of ${retryResponse.data.length} total)`)
              
              // Transform and add jobs from retry
              for (const job of filteredJobs) {
                const externalId = `himalayas-${job.guid || job.title?.replace(/\s+/g, '-').toLowerCase()}`
                if (seenIds.has(externalId)) continue
                seenIds.add(externalId)

                const description = stripHtml(job.description || job.excerpt || '')
                allJobs.push({
                  externalId,
                  title: job.title || 'Job Title Not Available',
                  company: job.companyName || 'Company Not Specified',
                  location: job.locationRestrictions || 'Remote',
                  description: description || 'No description available',
                  salary: '',
                  contractType: mapEmploymentType(job.employmentType),
                  category: job.category || 'General',
                  applyUrl: job.applicationLink || '#',
                  source: 'himalayas',
                  active: true,
                  featured: false,
                  companyLogo: job.companyLogo || null,
                  pubDate: job.pubDate || new Date().toISOString(),
                })
              }
              
              if (retryResponse.data.length < limit) break
              continue
            }
          } catch (retryError) {
            console.error(`  ❌ Retry failed for page ${page}:`, retryError.message || retryError.code)
            console.log(`  ⏭️  Skipping to next page/keyword...`)
            // Continue to next page instead of breaking, to allow other pages to be fetched
            continue
          }
        } else {
          console.error(`  ❌ Error fetching page ${page} for "${keyword}":`, error.message)
          break
        }
      }
    }
  }

  return allJobs
}

// Map employment type from Himalayas to our schema
const mapEmploymentType = (employmentType) => {
  if (!employmentType) return 'Full-time'
  
  const type = employmentType.toLowerCase()
  if (type.includes('full')) return 'Full-time'
  if (type.includes('part')) return 'Part-time'
  if (type.includes('contract')) return 'Contract'
  if (type.includes('freelance')) return 'Freelance'
  if (type.includes('intern')) return 'Internship'
  
  return 'Full-time'
}

// Save jobs to database
const saveJobs = async (jobs) => {
  let saved = 0
  let skipped = 0
  let updated = 0

  for (const jobData of jobs) {
    try {
      // Check if job already exists by externalId
      const existingJob = await Job.findOne({ 
        externalId: jobData.externalId,
        source: 'himalayas'
      })

      if (existingJob) {
        // Update existing job
        await Job.findByIdAndUpdate(existingJob._id, {
          ...jobData,
          updatedAt: new Date(),
        })
        updated++
        console.log(`  ✅ Updated: ${jobData.title} at ${jobData.company}`)
      } else {
        // Create new job
        await Job.create(jobData)
        saved++
        console.log(`  ✨ Saved: ${jobData.title} at ${jobData.company}`)
      }
    } catch (error) {
      skipped++
      console.error(`  ⚠️  Error saving job "${jobData.title}":`, error.message)
    }
  }

  return { saved, updated, skipped }
}

// Test API connection
const testConnection = async () => {
  try {
    console.log('🔌 Testing connection to Himalayas API...')
    const response = await axios.get('https://himalayas.app/jobs/api', {
      params: { limit: 1, offset: 0 },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    if (response.data && Array.isArray(response.data)) {
      console.log('✅ API connection successful!\n')
      return true
    }
    return false
  } catch (error) {
    console.error('❌ API connection failed:', error.message || error.code)
    console.error('   Please check your internet connection or VPN settings.\n')
    return false
  }
}

// Main function
const main = async () => {
  try {
    console.log('🚀 Starting Himalayas Jobs Fetcher...\n')
    
    // Test API connection first
    const connectionOk = await testConnection()
    if (!connectionOk) {
      console.log('⚠️  Cannot proceed without API connection. Exiting...')
      process.exit(1)
    }
    
    // Connect to database
    await connectDB()
    console.log('✅ Connected to database\n')

    // Search keywords
    const keywords = [
      'AI Trainer',
      'AI Tutor',
      'Creative Writing',
      'AI Data Annotator',
      'Artificial Intelligence Trainer',
      'Machine Learning Trainer',
      'Content Writer',
      'Data Annotation',
    ]

    console.log(`📋 Searching for jobs with keywords: ${keywords.join(', ')}\n`)

    // Fetch jobs
    const jobs = await fetchHimalayasJobs(keywords, 3) // Search up to 3 pages per keyword

    console.log(`\n📊 Total unique jobs found: ${jobs.length}`)

    if (jobs.length === 0) {
      console.log('\n⚠️  No jobs found. Exiting...')
      process.exit(0)
    }

    // Save jobs to database
    console.log('\n💾 Saving jobs to database...\n')
    const results = await saveJobs(jobs)

    console.log('\n' + '='.repeat(50))
    console.log('📈 Summary:')
    console.log(`  ✨ New jobs saved: ${results.saved}`)
    console.log(`  🔄 Jobs updated: ${results.updated}`)
    console.log(`  ⚠️  Jobs skipped: ${results.skipped}`)
    console.log(`  📊 Total processed: ${jobs.length}`)
    console.log('='.repeat(50))

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
main()


import { useState, useEffect } from 'react'
import { jobsAPI } from '../services/api'
import SEO from '../components/SEO'
import '../styles/pages/remote-jobs.css'

function RemoteJobs() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ current: 1, total: 1, count: 0 })

  useEffect(() => {
    fetchCategories()
    fetchJobs()
  }, [])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchJobs()
      } else {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    fetchJobs()
  }, [currentPage])

  const fetchCategories = async () => {
    try {
      const response = await jobsAPI.getCategories()
      if (response.success) {
        setCategories(response.data)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = {
        search: searchTerm,
        category: selectedCategory,
        page: currentPage,
        results_per_page: 12,
        sort_by: 'date',
      }

      const response = await jobsAPI.getJobs(params)
      
      if (response.success) {
        setJobs(response.data)
        setPagination(response.pagination || { current: 1, total: 1, count: 0 })
        setError('')
      } else {
        setError('Failed to load jobs')
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError('Failed to load jobs. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Salary not specified'
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num)
    if (min && max) {
      return `${currency} ${formatNumber(min)} - ${formatNumber(max)}`
    }
    if (min) return `${currency} ${formatNumber(min)}+`
    if (max) return `Up to ${currency} ${formatNumber(max)}`
    return 'Salary not specified'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const jobPlatforms = [
    {
      id: 1,
      name: 'Remote.co',
      description: 'Curated remote job listings across various industries and skill levels.',
      category: 'General',
      link: 'https://remote.co',
      icon: '🌐',
    },
    {
      id: 2,
      name: 'We Work Remotely',
      description: 'The largest remote work community with jobs in design, programming, and more.',
      category: 'Tech & Design',
      link: 'https://weworkremotely.com',
      icon: '💻',
    },
    {
      id: 3,
      name: 'FlexJobs',
      description: 'Hand-screened remote and flexible job opportunities with premium features.',
      category: 'Premium',
      link: 'https://flexjobs.com',
      icon: '⭐',
    },
    {
      id: 4,
      name: 'Remote OK',
      description: 'Remote jobs in programming, design, marketing, and customer support.',
      category: 'Tech',
      link: 'https://remoteok.io',
      icon: '🚀',
    },
    {
      id: 5,
      name: 'AngelList',
      description: 'Startup jobs including many remote opportunities in tech and business.',
      category: 'Startups',
      link: 'https://angel.co',
      icon: '👼',
    },
    {
      id: 6,
      name: 'Upwork',
      description: 'Freelance marketplace for remote projects and long-term contracts.',
      category: 'Freelance',
      link: 'https://upwork.com',
      icon: '🤝',
    },
  ]

  return (
    <>
      <SEO
        title="Remote Jobs"
        description="Find your dream remote job. Browse curated remote work opportunities across various industries. Search and filter by category, location, and job type."
        keywords="remote jobs, work from home jobs, remote work opportunities, online jobs, remote job board, telecommute jobs"
        url="/remote-jobs"
      />
      <div className="remote-jobs-page">
      <section className="remote-jobs-hero">
        <div className="remote-jobs-container">
          <h1 className="page-title">Remote Job Listings</h1>
          <p className="page-subtitle">
            Find your next remote work opportunity from thousands of listings
          </p>
        </div>
      </section>

      <section className="remote-jobs-content">
        <div className="remote-jobs-wrapper">
          {/* Search and Filter Section */}
          <div className="jobs-search-section">
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search for jobs (e.g., 'developer', 'designer', 'marketing')..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="category-filter"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            {pagination.count > 0 && (
              <p className="results-count">
                {pagination.count} remote jobs found
              </p>
            )}
          </div>

          {/* Jobs Listings */}
          <div className="jobs-listings-section">
            {loading && (
              <div className="loading-state">
                <p>Loading remote jobs...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && jobs.length > 0 && (
              <>
                <div className="jobs-grid">
                  {jobs.map((job) => (
                    <div key={job.id} className="job-card">
                      <div className="job-header">
                        <h3 className="job-title">{job.title}</h3>
                        <span className="job-category">{job.category}</span>
                      </div>
                      <div className="job-company">
                        <strong>{job.company}</strong>
                      </div>
                      <div className="job-details">
                        <span className="job-location">📍 {job.location}</span>
                        <span className="job-type">{job.contractType}</span>
                      </div>
                      {job.salaryMin || job.salaryMax ? (
                        <div className="job-salary">
                          💰 {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                        </div>
                      ) : null}
                      <p className="job-description">
                        {job.description.substring(0, 150)}...
                      </p>
                      <div className="job-footer">
                        <span className="job-date">{formatDate(job.created)}</span>
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="job-apply-button"
                        >
                          Apply Now →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      ← Previous
                    </button>
                    <span className="pagination-info">
                      Page {pagination.current} of {pagination.total}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.total, prev + 1))}
                      disabled={currentPage === pagination.total}
                      className="pagination-button"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div className="no-jobs">
                <p>No jobs found. Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {/* Job Platforms Section */}
          <div className="platforms-section">
            <h2 className="section-title">Popular Remote Job Platforms</h2>
            <div className="platforms-grid">
              {jobPlatforms.map((platform) => (
                <div key={platform.id} className="platform-card">
                  <div className="platform-icon">{platform.icon}</div>
                  <div className="platform-category">{platform.category}</div>
                  <h3 className="platform-name">{platform.name}</h3>
                  <p className="platform-description">{platform.description}</p>
                  <a
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="platform-link"
                  >
                    Visit Platform →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="jobs-tips">
            <h2 className="section-title">Tips for Finding Remote Jobs</h2>
            <ul className="tips-list">
              <li>Set up job alerts on multiple platforms to never miss an opportunity</li>
              <li>Customize your resume and cover letter for each remote position</li>
              <li>Highlight your remote work experience and self-management skills</li>
              <li>Build a strong online presence on LinkedIn and professional networks</li>
              <li>Prepare for video interviews and remote work assessments</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default RemoteJobs

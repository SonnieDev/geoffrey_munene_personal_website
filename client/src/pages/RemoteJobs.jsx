import { useState, useEffect } from 'react'
import { jobsAPI } from '../services/api'
import SEO from '../components/SEO'
import SkeletonLoader from '../components/SkeletonLoader'
import {
  HiBriefcase,
  HiGlobeAlt,
  HiCurrencyDollar,
  HiCalendar,
  HiMagnifyingGlass,
  HiFunnel,
  HiArrowTopRightOnSquare,
  HiCheck,
  HiChevronLeft,
  HiChevronRight,
  HiMapPin
} from 'react-icons/hi2'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setError('')
      const params = {
        search: searchTerm,
        category: selectedCategory,
        page: currentPage,
        results_per_page: 12,
      }

      const response = await jobsAPI.getJobs(params)
      console.log('Jobs API response:', response)

      if (response.success) {
        const jobsData = response.data || []
        setJobs(Array.isArray(jobsData) ? jobsData : [])
        setPagination(response.pagination || { current: 1, total: 1, count: 0 })
        setError('')
      } else {
        setError('Failed to load jobs')
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError(err.response?.data?.message || err.message || 'Failed to load remote jobs. Please check your connection and try again.')
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
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300">

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-fade-in">
              <span className="text-neon-blue text-sm font-medium tracking-wider">GLOBAL OPPORTUNITIES</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              Remote Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Listings</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Find your next remote work opportunity from thousands of listings across the globe.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-24 relative z-10">
          {/* Search and Filter Section */}
          <div className="glass-panel p-6 rounded-2xl mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <HiMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for jobs (e.g., 'developer', 'designer', 'marketing')..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                />
              </div>
              <div className="relative md:w-72">
                <HiFunnel className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full pl-12 pr-10 py-4 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white appearance-none cursor-pointer transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-white dark:bg-space-800 text-gray-900 dark:text-white">
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            {pagination.count > 0 && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                {pagination.count} remote jobs found
              </div>
            )}
          </div>

          {/* Jobs Listings */}
          <div className="mb-20">
            {loading ? (
              <SkeletonLoader type="job-card" count={12} />
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4 text-lg">{error}</div>
                <button
                  onClick={fetchJobs}
                  className="px-6 py-2 bg-neon-blue/10 text-neon-blue rounded-lg hover:bg-neon-blue/20 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {jobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="glass-panel p-6 rounded-xl hover:border-neon-blue/30 hover:shadow-neon-blue/10 transition-all duration-300 group flex flex-col h-full animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-neon-blue transition-colors line-clamp-2">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-gray-200">{job.company}</span>
                            {job.source === 'himalayas' && (
                              <span className="text-xs bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400" title="Source: Himalayas">
                                🏔️
                              </span>
                            )}
                          </div>
                        </div>
                        {job.companyLogo && (
                          <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 ml-3">
                            <img
                              src={job.companyLogo}
                              alt={`${job.company} logo`}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-neon-blue/10 text-neon-blue text-xs font-medium border border-neon-blue/20">
                          {job.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-500 dark:text-purple-400 text-xs font-medium border border-purple-500/20">
                          {job.contractType}
                        </span>
                      </div>

                      <div className="space-y-2 mb-6 flex-grow">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <HiMapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        {(job.salaryMin || job.salaryMax) && (
                          <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                            <HiCurrencyDollar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <HiCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{formatDate(job.created)}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-white/10 mt-auto">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-space-900 font-medium py-2.5 px-4 rounded-lg hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 group/btn"
                        >
                          Apply Now
                          <HiArrowTopRightOnSquare className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-3 rounded-lg bg-white dark:bg-space-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Page {pagination.current} of {pagination.total}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.total, prev + 1))}
                      disabled={currentPage === pagination.total}
                      className="p-3 rounded-lg bg-white dark:bg-space-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <HiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No jobs found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or category filters.</p>
              </div>
            )}
          </div>

          {/* Job Platforms Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">Popular Remote Job Platforms</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore these trusted platforms to find even more remote opportunities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPlatforms.map((platform) => (
                <div key={platform.id} className="glass-panel p-6 rounded-xl hover:border-neon-purple/30 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{platform.icon}</div>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                      {platform.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{platform.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 h-10 line-clamp-2">
                    {platform.description}
                  </p>
                  <a
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-neon-purple font-medium hover:text-neon-purple/80 transition-colors"
                  >
                    Visit Platform <HiArrowTopRightOnSquare className="ml-1 w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-neon-green">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Tips for Finding Remote Jobs</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Set up job alerts on multiple platforms to never miss an opportunity',
                'Customize your resume and cover letter for each remote position',
                'Highlight your remote work experience and self-management skills',
                'Build a strong online presence on LinkedIn and professional networks',
                'Prepare for video interviews and remote work assessments'
              ].map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <div className="mt-1 w-5 h-5 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                    <HiCheck className="w-3 h-3 text-neon-green" />
                  </div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attribution Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Job listings powered by{' '}
              <a
                href="https://himalayas.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:underline"
              >
                Himalayas
              </a>
              {' '}and other sources.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default RemoteJobs

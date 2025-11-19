import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useTokens } from '../contexts/TokenContext'
import { userContentAPI, tokensAPI } from '../services/api'
import UserProtectedRoute from '../components/UserProtectedRoute'
import OnboardingModal from '../components/OnboardingModal'
import OnboardingChecklist from '../components/OnboardingChecklist'
import ServiceHighlights from '../components/ServiceHighlights'
import ProgressTracker from '../components/ProgressTracker'
import ResourceCenter from '../components/ResourceCenter'
import QuickAccessWidgets from '../components/QuickAccessWidgets'
import ReEngagementBanner from '../components/ReEngagementBanner'
import GuidedTour, { TourTrigger } from '../components/GuidedTour'
import SEO from '../components/SEO'
import toast from 'react-hot-toast'
import {
  HiDocumentText,
  HiEnvelope,
  HiTrash,
  HiEye,
  HiXMark,
  HiUser,
  HiKey,
  HiClock,
  HiHome,
  HiSparkles,
  HiArrowRight,
  HiWrenchScrewdriver,
  HiChartBar,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2'
import { Link } from 'react-router-dom'

const TOOL_TYPE_LABELS = {
  resume: 'Resume',
  'cover-letter': 'Cover Letter',
  email: 'Email',
  'interview-prep': 'Interview Prep',
  'skills-assessment': 'Skills Assessment',
  'salary-negotiation': 'Salary Negotiation',
}

const TOOL_TYPE_ICONS = {
  resume: HiDocumentText,
  'cover-letter': HiDocumentText,
  email: HiEnvelope,
  'interview-prep': HiDocumentText,
  'skills-assessment': HiDocumentText,
  'salary-negotiation': HiDocumentText,
}

function UserDashboard() {
  const { user, fetchUser } = useUser()
  const { tokens, refreshBalance } = useTokens()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam === 'content' ? 'content' : 'overview')
  const [contentHistory, setContentHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterType, setFilterType] = useState('')
  const [stats, setStats] = useState({
    totalContent: 0,
    contentByType: {},
    recentContent: [],
  })
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      setShowOnboarding(true)
    }
  }, [user])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'content') {
      setActiveTab('content')
    } else if (!tab) {
      setActiveTab('overview')
    }
  }, [searchParams])

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData()
    } else if (activeTab === 'content') {
      fetchContentHistory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, filterType])

  const fetchOverviewData = async () => {
    try {
      setLoading(true)
      const [contentRes, transactionsRes] = await Promise.all([
        userContentAPI.getContentHistory(1, 100, null),
        tokensAPI.getTransactions(10),
      ])

      if (contentRes.success) {
        const allContent = contentRes.data.content
        const contentByType = {}
        allContent.forEach((item) => {
          contentByType[item.toolType] = (contentByType[item.toolType] || 0) + 1
        })

        setStats({
          totalContent: contentRes.data.pagination.total || allContent.length,
          contentByType,
          recentContent: allContent.slice(0, 5),
        })
        setContentHistory(allContent)
      }

      if (transactionsRes.success) {
        setTransactions(transactionsRes.data.transactions.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching overview data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchContentHistory = async () => {
    try {
      setLoading(true)
      const response = await userContentAPI.getContentHistory(page, 20, filterType || null)
      if (response.success) {
        setContentHistory(response.data.content)
        setTotalPages(response.data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching content history:', error)
      toast.error('Failed to load content history')
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await tokensAPI.getTransactions(50)
      if (response.success) {
        setTransactions(response.data.transactions)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Failed to load transactions')
    }
  }

  const handleViewContent = async (id) => {
    try {
      const response = await userContentAPI.getContentById(id)
      if (response.success) {
        setSelectedContent(response.data.content)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to load content')
    }
  }

  const handleDeleteContent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return
    }

    try {
      const response = await userContentAPI.deleteContent(id)
      if (response.success) {
        toast.success('Content deleted successfully')
        fetchContentHistory()
        if (selectedContent && selectedContent._id === id) {
          setSelectedContent(null)
        }
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      toast.error('Failed to delete content')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <UserProtectedRoute>
      <SEO
        title="My Dashboard - AI Career Tools"
        description="Manage your profile, view generated content history, and track your tokens"
        url="/user/dashboard"
      />
      {showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}
      <GuidedTour />
      <TourTrigger />
      <ReEngagementBanner />
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="glass-panel p-6 rounded-2xl mb-8 relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 dark:from-neon-blue/10 dark:to-neon-purple/10"></div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Here's what's happening with your account
                </p>
              </div>
              <Link to="/user/tools" className="bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-3 px-6 rounded-xl hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20 hover:-translate-y-0.5 flex items-center gap-2">
                <HiWrenchScrewdriver className="w-5 h-5" /> Use Tools
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass-panel p-6 rounded-xl hover:border-neon-blue/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-neon-blue">
                  <HiSparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{tokens}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Available Tokens</div>
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:border-neon-green/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-neon-green">
                  <HiDocumentText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalContent}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Generated Content</div>
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:border-neon-purple/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-neon-purple">
                  <HiChartBar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{user?.totalTokensUsed || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tokens Used</div>
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:border-neon-pink/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-neon-pink">
                  <HiKey className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{user?.totalTokensPurchased || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tokens Purchased</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="glass-panel p-2 rounded-xl mb-8 overflow-x-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex space-x-2 min-w-max">
              <button
                onClick={() => {
                  setActiveTab('overview')
                  setSearchParams({})
                }}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
                  ${activeTab === 'overview'
                    ? 'bg-white dark:bg-white/10 shadow-sm text-neon-blue dark:text-white ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <HiHome className="w-5 h-5" /> Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab('content')
                  setSearchParams({ tab: 'content' })
                }}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
                  ${activeTab === 'content'
                    ? 'bg-white dark:bg-white/10 shadow-sm text-neon-purple dark:text-white ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <HiDocumentText className="w-5 h-5" /> Content History
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {!user?.onboardingCompleted && (
                <div className="mb-6">
                  <OnboardingChecklist />
                </div>
              )}

              <div className="mb-6">
                <ProgressTracker />
              </div>

              <div className="mb-6">
                <QuickAccessWidgets />
              </div>

              <div className="mb-6">
                <ServiceHighlights />
              </div>

              <div className="mb-6">
                <ResourceCenter />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Content */}
                <div className="glass-panel p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Content</h2>
                    <button onClick={() => setActiveTab('content')} className="text-neon-blue hover:text-neon-blue/80 flex items-center gap-1 text-sm font-medium">
                      View All <HiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {loading ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
                  ) : stats.recentContent.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No content generated yet.</p>
                      <Link to="/user/tools" className="inline-flex items-center gap-2 px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-neon-blue/80 transition-colors">
                        <HiWrenchScrewdriver className="w-5 h-5" /> Start Creating
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentContent.map((item) => {
                        const Icon = TOOL_TYPE_ICONS[item.toolType] || HiDocumentText
                        return (
                          <div key={item._id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div className="text-neon-blue">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</h3>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">{TOOL_TYPE_LABELS[item.toolType]}</span>
                                <span>{formatDate(item.createdAt)}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleViewContent(item._id)}
                              className="p-2 text-neon-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            >
                              <HiEye className="w-5 h-5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Content by Type */}
                <div className="glass-panel p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Content by Type</h2>
                  {Object.keys(stats.contentByType).length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No content generated yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(stats.contentByType).map(([type, count]) => {
                        const Icon = TOOL_TYPE_ICONS[type] || HiDocumentText
                        return (
                          <div key={type} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                            <div className="text-neon-blue">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white">{TOOL_TYPE_LABELS[type]}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{count} {count === 1 ? 'item' : 'items'}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Transactions */}
                <div className="glass-panel p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                    <Link to="/user/billing" className="text-neon-purple hover:text-neon-purple/80 flex items-center gap-1 text-sm font-medium">
                      View All <HiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((transaction) => (
                        <div key={transaction._id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                          <div>
                            {transaction.amount >= 0 ? (
                              <HiSparkles className="w-5 h-5 text-green-500" />
                            ) : (
                              <HiChartBar className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{transaction.type}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(transaction.createdAt)}</div>
                          </div>
                          <div className={`text-lg font-bold ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="glass-panel p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link to="/user/tools" className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-white/10 rounded-lg hover:border-neon-blue dark:hover:border-neon-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer group">
                      <HiWrenchScrewdriver className="w-6 h-6 text-neon-blue flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Use AI Tools</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Generate resumes, cover letters, and more</p>
                      </div>
                      <HiArrowRight className="w-5 h-5 text-gray-400" />
                    </Link>
                    <Link to="/user/billing" className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-white/10 rounded-lg hover:border-neon-purple dark:hover:border-neon-purple hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer group">
                      <HiSparkles className="w-6 h-6 text-neon-purple flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Buy Tokens</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Purchase more tokens to continue using tools</p>
                      </div>
                      <HiArrowRight className="w-5 h-5 text-gray-400" />
                    </Link>
                    <button onClick={() => setActiveTab('content')} className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-white/10 rounded-lg hover:border-neon-green dark:hover:border-neon-green hover:bg-green-50 dark:hover:bg-green-900/20 transition-all cursor-pointer group">
                      <HiDocumentText className="w-6 h-6 text-neon-green flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">View History</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">See all your generated content</p>
                      </div>
                      <HiArrowRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="glass-panel p-6 rounded-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Content</h2>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value)
                    setPage(1)
                  }}
                  className="px-4 py-2 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-purple/50 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  {Object.entries(TOOL_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key} className="bg-white dark:bg-space-800">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
              ) : contentHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No generated content yet. Start using the tools to see your history here!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {contentHistory.map((item) => {
                      const Icon = TOOL_TYPE_ICONS[item.toolType] || HiDocumentText
                      return (
                        <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:shadow-md transition-shadow">
                          <div className="text-neon-blue">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">{item.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">{TOOL_TYPE_LABELS[item.toolType]}</span>
                              <span className="flex items-center gap-1">
                                <HiClock className="w-4 h-4" /> {formatDate(item.createdAt)}
                              </span>
                              <span>{item.tokensUsed} tokens</span>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleViewContent(item._id)}
                              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <HiEye className="w-4 h-4" /> View
                            </button>
                            <button
                              onClick={() => handleDeleteContent(item._id)}
                              className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <HiTrash className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="p-3 rounded-lg bg-white dark:bg-space-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="p-3 rounded-lg bg-white dark:bg-space-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>

        {/* Content View Modal */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedContent(null)}>
            <div className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col rounded-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedContent.title}</h2>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{TOOL_TYPE_LABELS[selectedContent.toolType]}</span>
                  <span>{formatDate(selectedContent.createdAt)}</span>
                  <span>{selectedContent.tokensUsed} tokens</span>
                </div>
                <div className="bg-gray-50 dark:bg-space-800/50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-mono text-sm">{selectedContent.content}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserProtectedRoute>
  )
}

export default UserDashboard

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
} from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import '../styles/pages/user-dashboard.css'

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
  const [activeTab, setActiveTab] = useState(tabParam === 'content' ? 'content' : 'overview') // 'overview', 'content'
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

  // Check if onboarding should be shown
  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      setShowOnboarding(true)
    }
  }, [user])

  // Handle URL tab parameter
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
      <div className="user-dashboard">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <div className="welcome-content">
              <h1 className="welcome-title">
                Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
              </h1>
              <p className="welcome-subtitle">
                Here's what's happening with your account
              </p>
            </div>
            <div className="welcome-actions">
              <Link to="/user/tools" className="welcome-action-btn primary">
                <HiWrenchScrewdriver /> Use Tools
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-stats-grid">
            <div className="stat-card tokens-stat">
              <div className="stat-icon">
                <HiSparkles />
              </div>
              <div className="stat-content">
                <div className="stat-value">{tokens}</div>
                <div className="stat-label">Available Tokens</div>
              </div>
            </div>
            <div className="stat-card content-stat">
              <div className="stat-icon">
                <HiDocumentText />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalContent}</div>
                <div className="stat-label">Generated Content</div>
              </div>
            </div>
            <div className="stat-card used-stat">
              <div className="stat-icon">
                <HiChartBar />
              </div>
              <div className="stat-content">
                <div className="stat-value">{user?.totalTokensUsed || 0}</div>
                <div className="stat-label">Tokens Used</div>
              </div>
            </div>
            <div className="stat-card purchased-stat">
              <div className="stat-icon">
                <HiKey />
              </div>
              <div className="stat-content">
                <div className="stat-value">{user?.totalTokensPurchased || 0}</div>
                <div className="stat-label">Tokens Purchased</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="dashboard-tabs">
            <button
              className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('overview')
                setSearchParams({})
              }}
            >
              <HiHome /> Overview
            </button>
            <button
              className={`dashboard-tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('content')
                setSearchParams({ tab: 'content' })
              }}
            >
              <HiDocumentText /> Content History
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="dashboard-content">
              {/* Onboarding Checklist */}
              {!user?.onboardingCompleted && (
                <div className="onboarding-checklist-wrapper">
                  <OnboardingChecklist />
                </div>
              )}
              
              {/* Progress Tracker */}
              <div className="progress-tracker-wrapper">
                <ProgressTracker />
              </div>
              
              {/* Quick Access Widgets */}
              <div className="quick-access-widgets-wrapper">
                <QuickAccessWidgets />
              </div>
              
              {/* Service Highlights */}
              <div className="service-highlights-wrapper">
                <ServiceHighlights />
              </div>
              
              {/* Resource Center */}
              <div className="resource-center-wrapper">
                <ResourceCenter />
              </div>
              
              <div className="overview-grid">
                {/* Recent Content */}
                <div className="overview-section">
                  <div className="section-header">
                    <h2>Recent Content</h2>
                    <Link to="/user/dashboard" onClick={() => setActiveTab('content')} className="section-link">
                      View All <HiArrowRight />
                    </Link>
                  </div>
                  {loading ? (
                    <div className="loading-state">Loading...</div>
                  ) : stats.recentContent.length === 0 ? (
                    <div className="empty-state">
                      <p>No content generated yet.</p>
                      <Link to="/user/tools" className="empty-state-link">
                        <HiWrenchScrewdriver /> Start Creating
                      </Link>
                    </div>
                  ) : (
                    <div className="recent-content-list">
                      {stats.recentContent.map((item) => {
                        const Icon = TOOL_TYPE_ICONS[item.toolType] || HiDocumentText
                        return (
                          <div key={item._id} className="recent-content-item">
                            <div className="recent-content-icon">
                              <Icon />
                            </div>
                            <div className="recent-content-info">
                              <h3>{item.title}</h3>
                              <div className="recent-content-meta">
                                <span className="content-type-badge">{TOOL_TYPE_LABELS[item.toolType]}</span>
                                <span className="content-date-small">{formatDate(item.createdAt)}</span>
                              </div>
                            </div>
                            <button
                              className="btn-view-small"
                              onClick={() => handleViewContent(item._id)}
                            >
                              <HiEye />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Content by Type */}
                <div className="overview-section">
                  <div className="section-header">
                    <h2>Content by Type</h2>
                  </div>
                  {Object.keys(stats.contentByType).length === 0 ? (
                    <div className="empty-state">
                      <p>No content generated yet.</p>
                    </div>
                  ) : (
                    <div className="content-type-stats">
                      {Object.entries(stats.contentByType).map(([type, count]) => (
                        <div key={type} className="content-type-stat">
                          <div className="content-type-stat-icon">
                            {(() => {
                              const Icon = TOOL_TYPE_ICONS[type] || HiDocumentText
                              return <Icon />
                            })()}
                          </div>
                          <div className="content-type-stat-info">
                            <div className="content-type-stat-label">{TOOL_TYPE_LABELS[type]}</div>
                            <div className="content-type-stat-count">{count} {count === 1 ? 'item' : 'items'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Transactions */}
                <div className="overview-section">
                  <div className="section-header">
                    <h2>Recent Transactions</h2>
                    <Link to="/user/billing" className="section-link">
                      View All <HiArrowRight />
                    </Link>
                  </div>
                  {transactions.length === 0 ? (
                    <div className="empty-state">
                      <p>No transactions yet.</p>
                    </div>
                  ) : (
                    <div className="recent-transactions-list">
                      {transactions.map((transaction) => (
                        <div key={transaction._id} className="recent-transaction-item">
                          <div className="transaction-icon">
                            {transaction.amount >= 0 ? (
                              <HiSparkles className="text-green-500" />
                            ) : (
                              <HiChartBar className="text-blue-500" />
                            )}
                          </div>
                          <div className="transaction-info-compact">
                            <div className="transaction-type-compact">{transaction.type}</div>
                            <div className="transaction-date-compact">{formatDate(transaction.createdAt)}</div>
                          </div>
                          <div className={`transaction-amount-compact ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                            {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="overview-section">
                  <div className="section-header">
                    <h2>Quick Actions</h2>
                  </div>
                  <div className="quick-actions-grid">
                    <Link to="/user/tools" className="quick-action-card">
                      <HiWrenchScrewdriver className="quick-action-icon" />
                      <div className="quick-action-content">
                        <h3>Use AI Tools</h3>
                        <p>Generate resumes, cover letters, and more</p>
                      </div>
                      <HiArrowRight className="quick-action-arrow" />
                    </Link>
                    <Link to="/user/billing" className="quick-action-card">
                      <HiSparkles className="quick-action-icon" />
                      <div className="quick-action-content">
                        <h3>Buy Tokens</h3>
                        <p>Purchase more tokens to continue using tools</p>
                      </div>
                      <HiArrowRight className="quick-action-arrow" />
                    </Link>
                    <Link to="/user/dashboard?tab=content" onClick={() => setActiveTab('content')} className="quick-action-card">
                      <HiDocumentText className="quick-action-icon" />
                      <div className="quick-action-content">
                        <h3>View History</h3>
                        <p>See all your generated content</p>
                      </div>
                      <HiArrowRight className="quick-action-arrow" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="dashboard-content">
              <div className="content-header">
                <h2>Generated Content</h2>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value)
                    setPage(1)
                  }}
                  className="content-filter"
                >
                  <option value="">All Types</option>
                  {Object.entries(TOOL_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : contentHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No generated content yet. Start using the tools to see your history here!</p>
                </div>
              ) : (
                <>
                  <div className="content-list">
                    {contentHistory.map((item) => {
                      const Icon = TOOL_TYPE_ICONS[item.toolType] || HiDocumentText
                      return (
                        <div key={item._id} className="content-item">
                          <div className="content-item-icon">
                            <Icon />
                          </div>
                          <div className="content-item-info">
                            <h3>{item.title}</h3>
                            <div className="content-item-meta">
                              <span className="content-type">{TOOL_TYPE_LABELS[item.toolType]}</span>
                              <span className="content-date">
                                <HiClock /> {formatDate(item.createdAt)}
                              </span>
                              <span className="content-tokens">{item.tokensUsed} tokens</span>
                            </div>
                          </div>
                          <div className="content-item-actions">
                            <button
                              className="btn-view"
                              onClick={() => handleViewContent(item._id)}
                            >
                              <HiEye /> View
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteContent(item._id)}
                            >
                              <HiTrash /> Delete
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="pagination-btn"
                      >
                        Previous
                      </button>
                      <span className="pagination-info">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="pagination-btn"
                      >
                        Next
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
          <div className="content-modal-overlay" onClick={() => setSelectedContent(null)}>
            <div className="content-modal" onClick={(e) => e.stopPropagation()}>
              <div className="content-modal-header">
                <h2>{selectedContent.title}</h2>
                <button
                  className="content-modal-close"
                  onClick={() => setSelectedContent(null)}
                >
                  <HiXMark />
                </button>
              </div>
              <div className="content-modal-body">
                <div className="content-modal-meta">
                  <span>{TOOL_TYPE_LABELS[selectedContent.toolType]}</span>
                  <span>{formatDate(selectedContent.createdAt)}</span>
                  <span>{selectedContent.tokensUsed} tokens</span>
                </div>
                <div className="content-modal-content">
                  <pre>{selectedContent.content}</pre>
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


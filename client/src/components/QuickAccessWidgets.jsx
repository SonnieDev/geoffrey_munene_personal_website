import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiClock, HiWrenchScrewdriver, HiDocumentText, HiCalendar, HiArrowRight } from 'react-icons/hi2'
import { useUser } from '../contexts/UserContext'
import { userContentAPI } from '../services/api'
import '../styles/components/quick-access-widgets.css'

function QuickAccessWidgets() {
  const { user } = useUser()
  const [recentTools, setRecentTools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRecentContent()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchRecentContent = async () => {
    try {
      const response = await userContentAPI.getContentHistory(1, 5, null)
      if (response.success) {
        setRecentTools(response.data.content || [])
      }
    } catch (error) {
      console.error('Error fetching recent content:', error)
    } finally {
      setLoading(false)
    }
  }

  const getToolIcon = (toolType) => {
    return HiWrenchScrewdriver
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="quick-access-widgets">
      {/* Next Session Widget */}
      <div className="widget next-session-widget">
        <div className="widget-header">
          <div className="widget-icon">
            <HiCalendar />
          </div>
          <div className="widget-content">
            <h4 className="widget-title">Coaching Sessions</h4>
            <p className="widget-description">
              {user?.signupPurpose === 'coaching' || user?.signupPurpose === 'all'
                ? 'Get personalized remote work guidance'
                : 'Explore our coaching services'}
            </p>
          </div>
        </div>
        {user?.signupPurpose === 'coaching' || user?.signupPurpose === 'all' ? (
          <Link to="/contact" className="widget-action">
            Book Session
            <HiArrowRight />
          </Link>
        ) : (
          <div className="widget-info">
            <p className="widget-info-text">
              Interested in 1-on-1 coaching? Book a session to get personalized guidance for your remote career journey.
            </p>
            <Link to="/contact" className="widget-action secondary">
              Learn More
              <HiArrowRight />
            </Link>
          </div>
        )}
      </div>

      {/* Recent Tools Widget */}
      <div className="widget recent-tools-widget">
        <div className="widget-header">
          <div className="widget-icon">
            <HiWrenchScrewdriver />
          </div>
          <div className="widget-content">
            <h4 className="widget-title">Recent Tools</h4>
            <p className="widget-description">Your latest generated content</p>
          </div>
        </div>
        {loading ? (
          <div className="widget-loading">Loading...</div>
        ) : recentTools.length > 0 ? (
          <div className="widget-list">
            {recentTools.slice(0, 3).map((item) => {
              const ToolIcon = getToolIcon(item.toolType)
              return (
                <Link
                  key={item._id}
                  to={`/user/dashboard?tab=content`}
                  className="widget-list-item"
                >
                  <ToolIcon className="widget-item-icon" />
                  <div className="widget-item-content">
                    <div className="widget-item-title">{item.title}</div>
                    <div className="widget-item-meta">{formatDate(item.createdAt)}</div>
                  </div>
                  <HiArrowRight className="widget-item-arrow" />
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="widget-empty">
            <HiDocumentText />
            <p>No content yet. Start using our tools!</p>
            <Link to="/user/tools" className="widget-empty-link">
              Explore Tools
            </Link>
          </div>
        )}
        {recentTools.length > 0 && (
          <Link to="/dashboard?tab=content" className="widget-footer-link">
            View All
            <HiArrowRight />
          </Link>
        )}
      </div>

      {/* Quick Actions Widget */}
      <div className="widget quick-actions-widget">
        <div className="widget-header">
          <div className="widget-icon">
            <HiClock />
          </div>
          <div className="widget-content">
            <h4 className="widget-title">Quick Actions</h4>
            <p className="widget-description">Get things done faster</p>
          </div>
        </div>
        <div className="widget-actions">
          <Link to="/user/tools" className="widget-action-btn primary">
            <HiWrenchScrewdriver />
            Use AI Tools
          </Link>
          <Link to="/user/learn" className="widget-action-btn">
            <HiDocumentText />
            View Resources
          </Link>
        </div>
      </div>
    </div>
  )
}

export default QuickAccessWidgets


import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiXMark, HiSparkles, HiArrowRight } from 'react-icons/hi2'
import { useUser } from '../contexts/UserContext'
import '../styles/components/re-engagement-banner.css'

function ReEngagementBanner() {
  const { user } = useUser()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!user) return

    // Check if user has been inactive (no activity in last 7 days)
    const lastActivity = user.lastActivity ? new Date(user.lastActivity) : new Date(user.createdAt)
    const daysSinceActivity = Math.floor((new Date() - lastActivity) / (1000 * 60 * 60 * 24))

    // Show banner if inactive for 7+ days and hasn't been dismissed
    const dismissed = localStorage.getItem(`reengagement-dismissed-${user.id}`)
    if (daysSinceActivity >= 7 && !dismissed) {
      setShow(true)
    }
  }, [user])

  const handleDismiss = () => {
    if (user) {
      localStorage.setItem(`reengagement-dismissed-${user.id}`, 'true')
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="re-engagement-banner">
      <div className="re-engagement-content">
        <div className="re-engagement-icon">
          <HiSparkles />
        </div>
        <div className="re-engagement-text">
          <h4 className="re-engagement-title">Welcome back! 👋</h4>
          <p className="re-engagement-message">
            We've missed you! Check out what's new and continue your remote career journey.
          </p>
        </div>
        <div className="re-engagement-actions">
          <Link to="/tools" className="re-engagement-btn primary">
            Explore Tools
            <HiArrowRight />
          </Link>
          <Link to="/user/dashboard" className="re-engagement-btn">
            Go to Dashboard
          </Link>
        </div>
      </div>
      <button className="re-engagement-close" onClick={handleDismiss}>
        <HiXMark />
      </button>
    </div>
  )
}

export default ReEngagementBanner


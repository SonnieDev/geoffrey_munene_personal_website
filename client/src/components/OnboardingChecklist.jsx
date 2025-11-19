import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiCheckCircle, HiCircleStack, HiSparkles, HiWrenchScrewdriver, HiDocumentText, HiKey, HiBookOpen, HiArrowRight } from 'react-icons/hi2'
import { useUser } from '../contexts/UserContext'
import { userContentAPI } from '../services/api'
import '../styles/components/onboarding-checklist.css'

const CHECKLIST_ITEMS = [
  {
    id: 'profileSetup',
    title: 'Complete your profile',
    description: 'Add your preferences and goals',
    icon: HiCircleStack,
    completedIcon: HiCheckCircle,
    link: '/user/dashboard?tab=profile',
    points: 10,
  },
  {
    id: 'firstToolUsed',
    title: 'Try your first AI tool',
    description: 'Generate a resume, cover letter, or email',
    icon: HiWrenchScrewdriver,
    completedIcon: HiCheckCircle,
    link: '/tools',
    points: 20,
  },
  {
    id: 'firstContentGenerated',
    title: 'Generate your first content',
    description: 'Create something with our AI tools',
    icon: HiDocumentText,
    completedIcon: HiCheckCircle,
    link: '/tools',
    points: 15,
  },
  {
    id: 'tokensPurchased',
    title: 'Purchase tokens',
    description: 'Buy tokens to keep using our tools',
    icon: HiKey,
    completedIcon: HiCheckCircle,
    link: '/tools',
    points: 25,
  },
  {
    id: 'resourcesViewed',
    title: 'Explore resources',
    description: 'Check out guides, videos, and FAQs',
    icon: HiBookOpen,
    completedIcon: HiCheckCircle,
    link: '/learn',
    points: 10,
  },
]

function OnboardingChecklist() {
  const { user } = useUser()
  const [contentCount, setContentCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContentCount()
  }, [])

  const fetchContentCount = async () => {
    try {
      const response = await userContentAPI.getContentHistory(1, 1, null)
      if (response.success) {
        setContentCount(response.data.pagination.total || 0)
      }
    } catch (error) {
      console.error('Error fetching content count:', error)
    } finally {
      setLoading(false)
    }
  }

  const getChecklistStatus = () => {
    if (!user) return {}
    
    return {
      profileSetup: user.onboardingSteps?.profileSetup || false,
      firstToolUsed: user.onboardingSteps?.firstToolUsed || false,
      firstContentGenerated: (user.onboardingSteps?.firstContentGenerated || contentCount > 0),
      tokensPurchased: (user.onboardingSteps?.tokensPurchased || (user.totalTokensPurchased || 0) > 0),
      resourcesViewed: user.onboardingSteps?.resourcesViewed || false,
    }
  }

  const status = getChecklistStatus()
  const completedCount = Object.values(status).filter(Boolean).length
  const totalCount = CHECKLIST_ITEMS.length
  const progressPercentage = (completedCount / totalCount) * 100

  if (loading) {
    return (
      <div className="onboarding-checklist">
        <div className="checklist-loading">Loading...</div>
      </div>
    )
  }

  if (completedCount === totalCount) {
    return null // Hide checklist when all items are completed
  }

  return (
    <div className="onboarding-checklist">
      <div className="checklist-header">
        <div className="checklist-title-section">
          <h3 className="checklist-title">Getting Started</h3>
          <p className="checklist-subtitle">Complete these steps to unlock your full potential</p>
        </div>
        <div className="checklist-progress-circle">
          <svg className="progress-ring" width="60" height="60">
            <circle
              className="progress-ring-background"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              r="26"
              cx="30"
              cy="30"
            />
            <circle
              className="progress-ring-progress"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              r="26"
              cx="30"
              cy="30"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - progressPercentage / 100)}`}
            />
          </svg>
          <div className="progress-text">
            <span className="progress-number">{completedCount}</span>
            <span className="progress-total">/{totalCount}</span>
          </div>
        </div>
      </div>

      <div className="checklist-items">
        {CHECKLIST_ITEMS.map((item) => {
          const isCompleted = status[item.id]
          const Icon = isCompleted ? item.completedIcon : item.icon
          
          return (
            <Link
              key={item.id}
              to={item.link}
              className={`checklist-item ${isCompleted ? 'completed' : ''}`}
            >
              <div className="checklist-item-icon">
                <Icon className={isCompleted ? 'text-green-500' : 'text-gray-400'} />
              </div>
              <div className="checklist-item-content">
                <div className="checklist-item-title">{item.title}</div>
                <div className="checklist-item-description">{item.description}</div>
              </div>
              {isCompleted ? (
                <div className="checklist-item-badge completed">
                  <HiCheckCircle /> Done
                </div>
              ) : (
                <div className="checklist-item-badge">
                  <HiArrowRight />
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {progressPercentage === 100 && (
        <div className="checklist-completion">
          <HiSparkles className="completion-icon" />
          <p className="completion-message">🎉 Congratulations! You've completed the onboarding checklist!</p>
        </div>
      )}
    </div>
  )
}

export default OnboardingChecklist


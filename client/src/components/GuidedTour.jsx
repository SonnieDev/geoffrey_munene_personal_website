import { useState, useEffect } from 'react'
import Joyride, { STATUS } from 'react-joyride'
import { useUser } from '../contexts/UserContext'
import '../styles/components/guided-tour.css'

const TOUR_STEPS = [
  {
    target: '.dashboard-welcome',
    content: 'Welcome to your dashboard! This is your command center for managing your remote career journey.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.dashboard-stats-grid',
    content: 'Track your progress at a glance: tokens, generated content, and usage statistics.',
    placement: 'top',
  },
  {
    target: '.onboarding-checklist-wrapper, .onboarding-checklist',
    content: 'Complete your onboarding checklist to unlock all features and earn points!',
    placement: 'right',
  },
  {
    target: '.progress-tracker-wrapper, .progress-tracker',
    content: 'Watch your progress grow! Earn points, maintain streaks, and unlock achievements.',
    placement: 'left',
  },
  {
    target: '.service-highlights-wrapper, .service-highlights',
    content: 'Explore our core services: AI Tools, Remote Work Coaching, and Learning Resources.',
    placement: 'top',
  },
  {
    target: '.quick-access-widgets-wrapper, .quick-access-widgets',
    content: 'Quick access to your recent tools, upcoming sessions, and common actions.',
    placement: 'top',
  },
  {
    target: '.resource-center-wrapper, .resource-center',
    content: 'Access guides, videos, FAQs, and blog posts to help you succeed.',
    placement: 'top',
  },
  {
    target: '.dashboard-tabs',
    content: 'Navigate between Overview, Content History, Profile, and Tokens using these tabs.',
    placement: 'bottom',
  },
]

function GuidedTour() {
  const { user } = useUser()
  const [run, setRun] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding and hasn't seen the tour
    if (user && user.onboardingCompleted) {
      const tourCompleted = localStorage.getItem(`tour-completed-${user.id}`)
      const shouldShowTour = !tourCompleted

      if (shouldShowTour) {
        // Wait a bit for the page to fully load
        const timer = setTimeout(() => {
          setRun(true)
        }, 1000)

        return () => clearTimeout(timer)
      }
    }
  }, [user])

  const handleJoyrideCallback = (data) => {
    const { status } = data

    // Handle tour completion
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      // Mark tour as completed
      if (user) {
        localStorage.setItem(`tour-completed-${user.id}`, 'true')
      }
      setRun(false)
    }
  }

  // Don't render if user hasn't completed onboarding
  if (!user || !user.onboardingCompleted) {
    return null
  }

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      disableOverlayClose={false}
      hideCloseButton={false}
      styles={{
        options: {
          primaryColor: '#667eea',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '12px',
          fontSize: '16px',
          padding: '20px',
          maxWidth: '400px',
          minWidth: '300px',
        },
        tooltipContainer: {
          padding: '10px',
        },
        tooltipContent: {
          padding: '10px 0',
          lineHeight: '1.6',
        },
        buttonNext: {
          backgroundColor: '#667eea',
          fontSize: '14px',
          padding: '10px 20px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '600',
        },
        buttonBack: {
          color: '#667eea',
          fontSize: '14px',
          marginRight: '10px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '600',
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: '14px',
          border: 'none',
          cursor: 'pointer',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  )
}

// Component to manually trigger the tour
export const TourTrigger = () => {
  const { user } = useUser()
  const [run, setRun] = useState(false)

  const handleStartTour = () => {
    setRun(true)
  }

  if (!user) return null

  return (
    <>
      <button
        onClick={handleStartTour}
        className="tour-trigger-btn"
        title="Take a guided tour of your dashboard"
      >
        🎯 Take Tour
      </button>
      <Joyride
        steps={TOUR_STEPS}
        run={run}
        continuous
        showProgress
        showSkipButton
        callback={(data) => {
          if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
            setRun(false)
            if (user) {
              localStorage.setItem(`tour-completed-${user.id}`, 'true')
            }
          }
        }}
        styles={{
          options: {
            primaryColor: '#667eea',
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: '12px',
            fontSize: '16px',
            padding: '20px',
            maxWidth: '400px',
            minWidth: '300px',
          },
          tooltipContainer: {
            padding: '10px',
          },
          tooltipContent: {
            padding: '10px 0',
            lineHeight: '1.6',
          },
          buttonNext: {
            backgroundColor: '#667eea',
            fontSize: '14px',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
          },
          buttonBack: {
            color: '#667eea',
            fontSize: '14px',
            marginRight: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
          },
          buttonSkip: {
            color: '#6b7280',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip Tour',
        }}
      />
    </>
  )
}

export default GuidedTour


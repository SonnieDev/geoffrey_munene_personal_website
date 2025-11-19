import { useState } from 'react'
import { HiXMark, HiSparkles, HiUser, HiBookOpen, HiWrenchScrewdriver, HiCheckCircle, HiArrowRight } from 'react-icons/hi2'
import { useUser } from '../contexts/UserContext'
import { userAPI } from '../services/api'
import toast from 'react-hot-toast'
import '../styles/components/onboarding-modal.css'

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Your Remote Career Journey! 🎉',
    description: 'We\'re excited to help you succeed. Let\'s get you set up in just a few steps.',
    icon: HiSparkles,
  },
  {
    id: 'purpose',
    title: 'What\'s Your Main Goal?',
    description: 'This helps us personalize your experience and show you the most relevant resources.',
    icon: HiUser,
    options: [
      { value: 'tools', label: 'AI Tools & Productivity', icon: HiWrenchScrewdriver, description: 'Generate resumes, cover letters, and more' },
      { value: 'coaching', label: 'Remote Work Coaching', icon: HiUser, description: 'Get personalized guidance and support' },
      { value: 'content', label: 'Content & Learning', icon: HiBookOpen, description: 'Access guides, videos, and resources' },
      { value: 'all', label: 'Everything!', icon: HiSparkles, description: 'I want to explore all features' },
    ],
  },
  {
    id: 'experience',
    title: 'What\'s Your Experience Level?',
    description: 'This helps us tailor content to your needs.',
    icon: HiUser,
    options: [
      { value: 'beginner', label: 'Beginner', description: 'Just starting my remote work journey' },
      { value: 'intermediate', label: 'Intermediate', description: 'Some experience with remote work' },
      { value: 'advanced', label: 'Advanced', description: 'Experienced remote worker' },
    ],
  },
]

function OnboardingModal({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const { fetchUser } = useUser()

  const step = ONBOARDING_STEPS[currentStep]
  const StepIcon = step.icon

  const handleNext = async () => {
    console.log('handleNext called', { currentStep, selectedPurpose, selectedExperience })
    
    if (currentStep === 1 && !selectedPurpose) {
      toast.error('Please select your main goal')
      return
    }
    if (currentStep === 2 && !selectedExperience) {
      toast.error('Please select your experience level')
      return
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      await handleComplete()
    }
  }

  const handleComplete = async () => {
    try {
      setLoading(true)
      // Update user preferences via API
      const token = localStorage.getItem('userToken')
      if (!token) {
        console.warn('No auth token found, skipping API call')
        onComplete()
        return
      }

      const response = await userAPI.updatePreferences({
        signupPurpose: selectedPurpose || null,
        experienceLevel: selectedExperience || null,
        onboardingCompleted: true,
      })

      if (response.success) {
        await fetchUser()
        toast.success('Welcome! Your experience is now personalized.')
      } else {
        toast.error(response.message || 'Failed to save preferences')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save preferences'
      toast.error(errorMessage)
      // Continue anyway - don't block user from using the app
    } finally {
      setLoading(false)
      onComplete() // Always close modal, even on error
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="onboarding-overlay" onClick={handleSkip}>
      <div className="onboarding-modal" onClick={(e) => e.stopPropagation()}>
        <div className="onboarding-header">
          <div className="onboarding-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">Step {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
          </div>
          <button 
            className="onboarding-skip" 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleSkip()
            }}
            type="button"
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            Skip for now
          </button>
        </div>

        <div className="onboarding-content">
          <div className="onboarding-icon">
            <StepIcon />
          </div>
          <h2 className="onboarding-title">{step.title}</h2>
          <p className="onboarding-description">{step.description}</p>

          {step.id === 'purpose' && (
            <div className="onboarding-options">
              {step.options.map((option) => {
                const OptionIcon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`onboarding-option ${selectedPurpose === option.value ? 'selected' : ''}`}
                    onClick={() => setSelectedPurpose(option.value)}
                  >
                    <div className="option-icon">
                      <OptionIcon />
                    </div>
                    <div className="option-content">
                      <div className="option-label">{option.label}</div>
                      <div className="option-description">{option.description}</div>
                    </div>
                    {selectedPurpose === option.value && (
                      <HiCheckCircle className="option-check" />
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {step.id === 'experience' && (
            <div className="onboarding-options">
              {step.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`onboarding-option ${selectedExperience === option.value ? 'selected' : ''}`}
                  onClick={() => setSelectedExperience(option.value)}
                >
                  <div className="option-content">
                    <div className="option-label">{option.label}</div>
                    <div className="option-description">{option.description}</div>
                  </div>
                  {selectedExperience === option.value && (
                    <HiCheckCircle className="option-check" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="onboarding-footer">
          {currentStep > 0 && (
            <button
              type="button"
              className="onboarding-btn secondary"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={loading}
            >
              Back
            </button>
          )}
          <button
            type="button"
            className="onboarding-btn primary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Next button clicked!')
              handleNext()
            }}
            disabled={loading}
            style={{ pointerEvents: 'auto', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Saving...' : currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started!' : 'Next'}
            {!loading && <HiArrowRight />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal


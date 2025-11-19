import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toolsAPI } from '../services/api'
import { useTokens } from '../contexts/TokenContext'
import SEO from '../components/SEO'
import TokenBalance from '../components/TokenBalance'
import TokenPurchaseModal from '../components/TokenPurchaseModal'
import toast from 'react-hot-toast'
import { 
  HiDocumentText,
  HiEnvelope,
  HiChatBubbleLeftRight,
  HiMicrophone,
  HiChartBar,
  HiCurrencyDollar
} from 'react-icons/hi2'
import '../styles/pages/tools.css'

// Token costs per tool
const TOKEN_COSTS = {
  resume: 5,
  'cover-letter': 4,
  email: 2,
  'interview-prep': 6,
  'skills-assessment': 5,
  'salary-negotiation': 5,
}

function Tools() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { sessionId, tokens, refreshBalance } = useTokens()
  const [activeTool, setActiveTool] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const tools = [
    {
      id: 'resume',
      name: 'AI Resume Builder',
      description: 'Create professional, ATS-friendly resumes tailored for remote positions.',
      icon: HiDocumentText,
      category: 'Resume Tools',
      cost: TOKEN_COSTS.resume,
    },
    {
      id: 'cover-letter',
      name: 'Cover Letter Generator',
      description: 'Generate compelling cover letters that highlight your remote work readiness.',
      icon: HiEnvelope,
      category: 'Application Tools',
      cost: TOKEN_COSTS['cover-letter'],
    },
    {
      id: 'email',
      name: 'Email Template Generator',
      description: 'Professional email templates for networking, follow-ups, and job applications.',
      icon: HiChatBubbleLeftRight,
      category: 'Communication',
      cost: TOKEN_COSTS.email,
    },
    {
      id: 'interview-prep',
      name: 'Interview Prep Assistant',
      description: 'Practice common remote work interview questions with AI-powered feedback.',
      icon: HiMicrophone,
      category: 'Interview Prep',
      cost: TOKEN_COSTS['interview-prep'],
    },
    {
      id: 'skills-assessment',
      name: 'Remote Work Skills Assessment',
      description: 'Evaluate your remote work readiness and identify areas for improvement.',
      icon: HiChartBar,
      category: 'Assessment',
      cost: TOKEN_COSTS['skills-assessment'],
    },
    {
      id: 'salary-negotiation',
      name: 'Salary Negotiation Guide',
      description: 'Tools and templates to help you negotiate remote work compensation.',
      icon: HiCurrencyDollar,
      category: 'Career Tools',
      cost: TOKEN_COSTS['salary-negotiation'],
    },
  ]

  useEffect(() => {
    const toolParam = searchParams.get('tool')
    if (toolParam) {
      // Map footer link names to tool IDs
      const toolMap = {
        'resume-builder': 'resume',
        'resume': 'resume',
        'email-templates': 'email',
        'email': 'email',
        'interview-tips': 'interview-prep',
        'interview-prep': 'interview-prep',
        'interview': 'interview-prep',
      }
      
      const toolId = toolMap[toolParam.toLowerCase()] || toolParam
      // Check if tool exists (valid tool IDs: 'resume', 'email', 'interview-prep', etc.)
      const validToolIds = ['resume', 'cover-letter', 'email', 'interview-prep', 'skills-assessment', 'salary-negotiation']
      if (validToolIds.includes(toolId)) {
        setActiveTool(toolId)
        // Clear the URL parameter after setting the tool
        setSearchParams({})
      }
    }
  }, [searchParams, setSearchParams])

  const handleToolClick = (toolId) => {
    setActiveTool(toolId)
    setResult('')
    setError('')
  }

  const closeModal = () => {
    setActiveTool(null)
    setResult('')
    setError('')
  }

  const handleSubmit = async (e, toolId) => {
    e.preventDefault()
    
    // Check if user has enough tokens
    const tokenCost = TOKEN_COSTS[toolId] || 5
    if (tokens < tokenCost) {
      setError(`Insufficient tokens. This tool requires ${tokenCost} tokens. You have ${tokens} tokens.`)
      setShowPurchaseModal(true)
      return
    }

    setLoading(true)
    setError('')
    setResult('')

    try {
      const formData = new FormData(e.target)
      const data = Object.fromEntries(formData.entries())

      let response
      switch (toolId) {
        case 'resume':
          response = await toolsAPI.generateResume(data, sessionId)
          setResult(response.data.resume)
          break
        case 'cover-letter':
          response = await toolsAPI.generateCoverLetter(data, sessionId)
          setResult(response.data.coverLetter)
          break
        case 'email':
          response = await toolsAPI.generateEmail(data, sessionId)
          setResult(response.data.email)
          break
        case 'interview-prep':
          response = await toolsAPI.generateInterviewPrep(data, sessionId)
          setResult(response.data.interviewPrep)
          break
        case 'skills-assessment':
          response = await toolsAPI.generateSkillsAssessment(data, sessionId)
          setResult(response.data.assessment)
          break
        case 'salary-negotiation':
          response = await toolsAPI.generateSalaryNegotiation(data, sessionId)
          setResult(response.data.guide)
          break
        default:
          throw new Error('Unknown tool')
      }
      
      // Refresh token balance after successful generation
      if (response.data.tokensRemaining !== undefined) {
        await refreshBalance()
        toast.success(`Generated successfully! ${response.data.tokensRemaining} tokens remaining.`)
      }
    } catch (err) {
      // Handle token errors (402 Payment Required)
      if (err.response?.status === 402) {
        setError(err.response.data.message)
        setShowPurchaseModal(true)
      } else {
        setError(err.response?.data?.message || 'Failed to generate content. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const renderToolForm = (toolId) => {
    switch (toolId) {
      case 'resume':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'resume')} className="tool-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" />
            </div>
            <div className="form-group">
              <label>Target Job Title</label>
              <input type="text" name="jobTitle" />
            </div>
            <div className="form-group">
              <label>Professional Summary</label>
              <textarea name="summary" rows="3" placeholder="Brief summary of your professional background"></textarea>
            </div>
            <div className="form-group">
              <label>Work Experience *</label>
              <textarea name="experience" rows="5" required placeholder="List your work experience, including company names, job titles, dates, and key responsibilities"></textarea>
            </div>
            <div className="form-group">
              <label>Skills *</label>
              <textarea name="skills" rows="3" required placeholder="List your key skills (e.g., JavaScript, Project Management, Remote Collaboration)"></textarea>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Generating...' : 'Generate Resume'}
            </button>
          </form>
        )

      case 'cover-letter':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'cover-letter')} className="tool-form">
            <div className="form-group">
              <label>Your Name *</label>
              <input type="text" name="name" required />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input type="text" name="companyName" required />
            </div>
            <div className="form-group">
              <label>Job Title *</label>
              <input type="text" name="jobTitle" required />
            </div>
            <div className="form-group">
              <label>Relevant Experience</label>
              <textarea name="experience" rows="4" placeholder="Describe your relevant work experience"></textarea>
            </div>
            <div className="form-group">
              <label>Key Skills</label>
              <textarea name="skills" rows="3" placeholder="List your relevant skills"></textarea>
            </div>
            <div className="form-group">
              <label>Why You're Interested</label>
              <textarea name="whyInterested" rows="3" placeholder="Why are you interested in this position?"></textarea>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </button>
          </form>
        )

      case 'email':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'email')} className="tool-form">
            <div className="form-group">
              <label>Email Type *</label>
              <select name="emailType" required>
                <option value="">Select type...</option>
                <option value="networking">Networking Email</option>
                <option value="followup">Follow-up Email</option>
                <option value="application">Job Application Inquiry</option>
                <option value="thankYou">Thank You Email</option>
              </select>
            </div>
            <div className="form-group">
              <label>Recipient Name</label>
              <input type="text" name="recipientName" placeholder="Hiring Manager" />
            </div>
            <div className="form-group">
              <label>Purpose *</label>
              <textarea name="purpose" rows="3" required placeholder="What is the purpose of this email?"></textarea>
            </div>
            <div className="form-group">
              <label>Additional Context</label>
              <textarea name="context" rows="3" placeholder="Any additional information or context"></textarea>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Generating...' : 'Generate Email'}
            </button>
          </form>
        )

      case 'interview-prep':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'interview-prep')} className="tool-form">
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" name="jobTitle" placeholder="Remote Software Developer" />
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select name="experience">
                <option value="">Select level...</option>
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div className="form-group">
              <label>Key Skills</label>
              <textarea name="skills" rows="3" placeholder="List your key skills relevant to the position"></textarea>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Generating...' : 'Generate Interview Prep'}
            </button>
          </form>
        )

      case 'skills-assessment':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'skills-assessment')} className="tool-form">
            <div className="form-group">
              <label>Current Skills</label>
              <textarea name="currentSkills" rows="4" placeholder="List your current skills and experience"></textarea>
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select name="experience">
                <option value="">Select level...</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label>Career Goals</label>
              <textarea name="goals" rows="3" placeholder="What are your remote work career goals?"></textarea>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Generating...' : 'Get Assessment'}
            </button>
          </form>
        )

      case 'salary-negotiation':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'salary-negotiation')} className="tool-form">
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" name="jobTitle" placeholder="Remote Product Manager" />
            </div>
            <div className="form-group">
              <label>Location/Time Zone</label>
              <input type="text" name="location" placeholder="Remote, EST timezone" />
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select name="experience">
                <option value="">Select level...</option>
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div className="form-group">
              <label>Current Salary (Optional)</label>
              <input type="text" name="currentSalary" placeholder="$XX,XXX" />
            </div>
            <div className="form-group">
              <label>Offer Amount (Optional)</label>
              <input type="text" name="offerAmount" placeholder="$XX,XXX" />
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Generating...' : 'Generate Guide'}
            </button>
          </form>
        )

      default:
        return null
    }
  }

  return (
    <>
      <SEO
        title="AI-Powered Career Tools"
        description="Free AI-powered tools to help you build your remote career. Generate resumes, cover letters, emails, interview prep, and more. All tools powered by advanced AI technology."
        keywords="resume builder, cover letter generator, AI tools, career tools, job search tools, interview prep, email writer"
        url="/tools"
      />
      <div className="tools-page">
      <section className="tools-hero">
        <div className="tools-container">
          <h1 className="page-title">AI-Powered Tools</h1>
          <p className="page-subtitle">
            Professional AI tools to help you land remote jobs and grow your digital career
          </p>
          <div className="tools-token-balance-wrapper">
            <TokenBalance />
          </div>
        </div>
      </section>

      <section className="tools-content">
        <div className="tools-wrapper">
          <div className="tools-grid">
            {tools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <div key={tool.id} className="tool-card">
                  <div className="tool-icon">
                    <IconComponent />
                  </div>
                  <div className="tool-category">{tool.category}</div>
                  <h3 className="tool-name">{tool.name}</h3>
                  <p className="tool-description">{tool.description}</p>
                  <div className="tool-cost">Cost: {tool.cost} tokens</div>
                  <button onClick={() => handleToolClick(tool.id)} className="tool-button">
                    Use Tool
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {activeTool && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2 className="modal-title">{tools.find(t => t.id === activeTool)?.name}</h2>
            
            {!result && !error && (
              <div className="modal-form">
                {renderToolForm(activeTool)}
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <p>Generating content... This may take a moment.</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={() => { setError(''); setResult('') }} className="back-button">
                  Try Again
                </button>
              </div>
            )}

            {result && (
              <div className="result-container">
                <div className="result-header">
                  <h3>Generated Content</h3>
                  <button onClick={() => copyToClipboard(result)} className="copy-button">
                    Copy
                  </button>
                </div>
                <div className="result-content">
                  <pre>{result}</pre>
                </div>
                <button onClick={() => { setResult(''); setError('') }} className="back-button">
                  Generate Another
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showPurchaseModal && (
        <TokenPurchaseModal onClose={() => setShowPurchaseModal(false)} />
      )}
    </div>
    </>
  )
}

export default Tools

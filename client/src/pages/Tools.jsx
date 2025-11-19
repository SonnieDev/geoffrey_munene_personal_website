import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { toolsAPI } from '../services/api'
import { useTokens } from '../contexts/TokenContext'
import { useUser } from '../contexts/UserContext'
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
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading: userLoading } = useUser()

  // Redirect authenticated users to /user/tools for consistency
  useEffect(() => {
    if (!userLoading && isAuthenticated && location.pathname === '/tools') {
      navigate('/user/tools', { replace: true })
    }
  }, [isAuthenticated, userLoading, navigate, location.pathname])
  const { tokens, refreshBalance } = useTokens()
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
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login or sign up to use this tool')
      navigate('/login', { state: { from: { pathname: '/tools', search: `?tool=${toolId}` } } })
      return
    }

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

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login or sign up to use this tool')
      navigate('/login', { state: { from: { pathname: '/tools', search: `?tool=${toolId}` } } })
      return
    }

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
          response = await toolsAPI.generateResume(data)
          setResult(response.data.resume)
          break
        case 'cover-letter':
          response = await toolsAPI.generateCoverLetter(data)
          setResult(response.data.coverLetter)
          break
        case 'email':
          response = await toolsAPI.generateEmail(data)
          setResult(response.data.email)
          break
        case 'interview-prep':
          response = await toolsAPI.generateInterviewPrep(data)
          setResult(response.data.interviewPrep)
          break
        case 'skills-assessment':
          response = await toolsAPI.generateSkillsAssessment(data)
          setResult(response.data.assessment)
          break
        case 'salary-negotiation':
          response = await toolsAPI.generateSalaryNegotiation(data)
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
      // Handle authentication errors
      if (err.response?.status === 401) {
        setError('Please login to use tools')
        navigate('/login', { state: { from: { pathname: '/tools' } } })
      }
      // Handle token errors (402 Payment Required)
      else if (err.response?.status === 402) {
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
      <div className="tools-page min-h-screen pt-20 pb-12">
        {/* Hero Section */}
        <section className="tools-hero relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-fade-in">
              <span className="text-neon-blue text-sm font-medium tracking-wider">AI POWERED</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Accelerator</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Professional AI tools to help you land remote jobs and grow your digital career.
            </p>

            {isAuthenticated ? (
              <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <TokenBalance />
              </div>
            ) : (
              <div className="mt-8 p-6 glass-panel rounded-xl inline-block max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <p className="text-gray-700 dark:text-gray-300">
                  <Link to="/signup" className="text-neon-blue hover:text-neon-purple font-semibold hover:underline transition-colors">Sign up</Link> or{' '}
                  <Link to="/login" className="text-neon-blue hover:text-neon-purple font-semibold hover:underline transition-colors">login</Link> to use these tools and get 10 free trial tokens!
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="tools-content py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => {
                const IconComponent = tool.icon
                return (
                  <div key={tool.id} className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center group hover:transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-white/5 hover:border-neon-blue/30 dark:hover:border-neon-blue/30 hover:shadow-neon-blue/10">
                    <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-medium text-neon-blue mb-4 border border-gray-200 dark:border-white/5">
                      {tool.category}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{tool.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow text-sm leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
                      Cost: <span className="text-neon-purple">{tool.cost} tokens</span>
                    </div>
                    <button
                      onClick={() => handleToolClick(tool.id)}
                      className="w-full py-3 px-6 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20"
                    >
                      Use Tool
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {activeTool && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="bg-white dark:bg-space-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-200 dark:border-white/10 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-2"
                onClick={closeModal}
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-8">
                <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                  {(() => {
                    const tool = tools.find(t => t.id === activeTool)
                    const Icon = tool?.icon
                    return (
                      <>
                        {Icon && <Icon className="text-neon-blue" />}
                        {tool?.name}
                      </>
                    )
                  })()}
                </h2>

                {!result && !error && (
                  <div className="space-y-6">
                    {renderToolForm(activeTool)}
                  </div>
                )}

                {loading && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 animate-pulse">Generating content with AI...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-8">
                    <div className="text-red-500 bg-red-500/10 px-6 py-4 rounded-lg inline-block border border-red-500/20 mb-4">
                      {error}
                    </div>
                    <button
                      onClick={() => { setError(''); setResult('') }}
                      className="block mx-auto px-6 py-2 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Generated Content</h3>
                      <button
                        onClick={() => copyToClipboard(result)}
                        className="px-4 py-2 rounded-lg bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-colors font-medium text-sm"
                      >
                        Copy to Clipboard
                      </button>
                    </div>
                    <div className="bg-gray-50 dark:bg-space-900/50 border border-gray-200 dark:border-white/10 rounded-xl p-6">
                      <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans text-sm leading-relaxed">{result}</pre>
                    </div>
                    <button
                      onClick={() => { setResult(''); setError('') }}
                      className="w-full py-3 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-colors font-medium"
                    >
                      Generate Another
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showPurchaseModal && isAuthenticated && (
          <TokenPurchaseModal onClose={() => setShowPurchaseModal(false)} />
        )}
      </div>
    </>
  )
}

export default Tools

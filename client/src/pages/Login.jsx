import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import SEO from '../components/SEO'
import toast from 'react-hot-toast'
import { HiEnvelope, HiLockClosed, HiArrowRight } from 'react-icons/hi2'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/user/dashboard'
      const search = location.state?.from?.search || ''
      navigate(`${from}${search}`, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        toast.success('Login successful!')
        const from = location.state?.from?.pathname || '/user/dashboard'
        const search = location.state?.from?.search || ''
        navigate(`${from}${search}`, { replace: true })
      } else {
        toast.error(result.message || 'Login failed')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Login - AI Career Tools"
        description="Login to access AI-powered career tools and manage your tokens"
        url="/login"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
              <span className="text-neon-blue text-sm font-medium tracking-wider">WELCOME BACK</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
              Login to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Account</span>
            </h1>
          </div>

          <div className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <HiEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    minLength={8}
                    className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-3 px-6 rounded-xl hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
              >
                {loading ? 'Logging in...' : (
                  <>
                    Login
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-neon-blue hover:text-neon-blue/80 font-medium transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login

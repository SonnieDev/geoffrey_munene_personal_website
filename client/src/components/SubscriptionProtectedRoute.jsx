import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import toast from 'react-hot-toast'
import { HiLockClosed, HiSparkles } from 'react-icons/hi2'

/**
 * Component to protect routes that require subscription or course access
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if access granted
 * @param {string} props.requiredTier - Required subscription tier ('free', 'basic', 'premium', 'lifetime')
 * @param {string} props.courseId - Required course ID if checking for specific course access
 * @param {string} props.redirectTo - Where to redirect if access denied (default: '/user/learn')
 * @param {string} props.message - Custom message to show when access denied
 */
function SubscriptionProtectedRoute({ 
  children, 
  requiredTier = 'free',
  courseId = null,
  redirectTo = '/user/learn',
  message = null
}) {
  const { isAuthenticated, user, loading } = useUser()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    toast.error('Please login to access this content')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check subscription tier
  const tierHierarchy = { free: 0, basic: 1, premium: 2, lifetime: 3 }
  const userTier = user?.subscriptions?.subscriptionTier || 'free'
  const userTierLevel = tierHierarchy[userTier] || 0
  const requiredTierLevel = tierHierarchy[requiredTier] || 0

  // Check if subscription is active
  const isSubscriptionActive = 
    user?.subscriptions?.subscriptionStatus === 'active' ||
    user?.subscriptions?.subscriptionStatus === 'trial' ||
    user?.subscriptions?.subscriptionTier === 'lifetime'

  // Check subscription expiration
  const subscriptionExpired = user?.subscriptions?.subscriptionExpiresAt 
    ? new Date(user.subscriptions.subscriptionExpiresAt) < new Date()
    : false

  // Check course-specific access
  let hasCourseAccess = true
  if (courseId) {
    hasCourseAccess = user?.subscriptions?.activeCourses?.some(
      course => course.courseId === courseId || course.courseSlug === courseId
    ) || false
  }

  // Determine if access should be granted
  const hasAccess = 
    isSubscriptionActive && 
    !subscriptionExpired && 
    userTierLevel >= requiredTierLevel &&
    hasCourseAccess

  if (!hasAccess) {
    const defaultMessage = message || 
      (courseId 
        ? 'You need to enroll in this course to access it'
        : `This content requires a ${requiredTier} subscription or higher`)
    
    toast.error(defaultMessage, { duration: 5000 })
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <HiLockClosed className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Restricted
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {defaultMessage}
            </p>
            <div className="space-y-3">
              <a
                href={redirectTo}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                View Available Courses
              </a>
              <a
                href="/user/dashboard"
                className="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
            {requiredTier !== 'free' && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Upgrade to unlock this content:
                </p>
                <div className="flex items-center justify-center gap-2 text-yellow-500">
                  <HiSparkles className="w-5 h-5" />
                  <span className="font-medium capitalize">{requiredTier} Plan</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default SubscriptionProtectedRoute


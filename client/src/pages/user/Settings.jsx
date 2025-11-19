import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { userAPI } from '../../services/api'
import UserProtectedRoute from '../../components/UserProtectedRoute'
import SEO from '../../components/SEO'
import toast from 'react-hot-toast'
import {
  HiCog6Tooth,
  HiBell,
  HiShieldCheck,
  HiKey,
  HiCheck,
  HiXMark,
  HiEye,
  HiEyeSlash,
} from 'react-icons/hi2'

function Settings() {
  const { user, fetchUser } = useUser()
  const [activeSection, setActiveSection] = useState('account')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [accountData, setAccountData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    marketingEmails: false,
    productUpdates: true,
    weeklyDigest: true,
  })

  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  useEffect(() => {
    if (user) {
      setAccountData({
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setNotifications({
        emailNotifications: user.preferences?.emailNotifications !== false,
        marketingEmails: user.preferences?.marketingEmails === true,
        productUpdates: user.preferences?.productUpdates !== false,
        weeklyDigest: user.preferences?.weeklyDigest !== false,
      })
    }
  }, [user])

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (accountData.newPassword !== accountData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (accountData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const response = await userAPI.changePassword(
        accountData.currentPassword,
        accountData.newPassword
      )

      if (response.success) {
        toast.success('Password changed successfully!')
        setAccountData({
          ...accountData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        toast.error(response.message || 'Failed to change password')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationSave = async () => {
    setLoading(true)
    try {
      const response = await userAPI.updatePreferences({
        emailNotifications: notifications.emailNotifications,
        marketingEmails: notifications.marketingEmails,
        productUpdates: notifications.productUpdates,
        weeklyDigest: notifications.weeklyDigest,
      })

      if (response.success) {
        toast.success('Notification preferences saved!')
        await fetchUser()
      } else {
        toast.error(response.message || 'Failed to save preferences')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceSave = async () => {
    setLoading(true)
    try {
      const response = await userAPI.updatePreferences({
        theme: preferences.theme,
        language: preferences.language,
        timezone: preferences.timezone,
      })

      if (response.success) {
        toast.success('Preferences saved!')
        await fetchUser()
      } else {
        toast.error(response.message || 'Failed to save preferences')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserProtectedRoute>
      <SEO
        title="Settings"
        description="Manage your account settings, notifications, and preferences"
        url="/user/settings"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-4 rounded-xl sticky top-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveSection('account')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'account'
                        ? 'bg-neon-blue/10 text-neon-blue dark:text-neon-blue'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                  >
                    <HiCog6Tooth className="w-5 h-5" /> Account
                  </button>
                  <button
                    onClick={() => setActiveSection('notifications')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'notifications'
                        ? 'bg-neon-purple/10 text-neon-purple dark:text-neon-purple'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                  >
                    <HiBell className="w-5 h-5" /> Notifications
                  </button>
                  <button
                    onClick={() => setActiveSection('preferences')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'preferences'
                        ? 'bg-neon-green/10 text-neon-green dark:text-neon-green'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                  >
                    <HiCog6Tooth className="w-5 h-5" /> Preferences
                  </button>
                  <button
                    onClick={() => setActiveSection('security')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'security'
                        ? 'bg-neon-pink/10 text-neon-pink dark:text-neon-pink'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                  >
                    <HiShieldCheck className="w-5 h-5" /> Security
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Account Settings */}
              {activeSection === 'account' && (
                <div className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <input type="email" value={accountData.email} disabled className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white opacity-60 cursor-not-allowed" />
                      <small className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Email cannot be changed. Contact support if you need to update it.</small>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Created</label>
                      <input
                        type="text"
                        value={
                          user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                            : 'N/A'
                        }
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive important account-related emails' },
                      { key: 'productUpdates', label: 'Product Updates', desc: 'Get notified about new features and improvements' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive a weekly summary of your activity' },
                      { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional emails and special offers' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-white/10 text-neon-purple focus:ring-neon-purple/50"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors">{item.label}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                        </div>
                      </label>
                    ))}
                    <button onClick={handleNotificationSave} disabled={loading} className="bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-3 px-6 rounded-xl hover:bg-neon-purple dark:hover:bg-neon-purple hover:text-white transition-all duration-300 flex items-center gap-2 disabled:opacity-50">
                      <HiCheck className="w-5 h-5" /> Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeSection === 'preferences' && (
                <div className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-gray-900 dark:text-white appearance-none cursor-pointer"
                      >
                        <option value="system" className="bg-white dark:bg-space-800">System Default</option>
                        <option value="light" className="bg-white dark:bg-space-800">Light</option>
                        <option value="dark" className="bg-white dark:bg-space-800">Dark</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-gray-900 dark:text-white appearance-none cursor-pointer"
                      >
                        <option value="en" className="bg-white dark:bg-space-800">English</option>
                        <option value="es" className="bg-white dark:bg-space-800">Spanish</option>
                        <option value="fr" className="bg-white dark:bg-space-800">French</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-gray-900 dark:text-white appearance-none cursor-pointer"
                      >
                        <option value={Intl.DateTimeFormat().resolvedOptions().timeZone} className="bg-white dark:bg-space-800">
                          {Intl.DateTimeFormat().resolvedOptions().timeZone}
                        </option>
                      </select>
                    </div>
                    <button onClick={handlePreferenceSave} disabled={loading} className="bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-3 px-6 rounded-xl hover:bg-neon-green dark:hover:bg-neon-green hover:text-white transition-all duration-300 flex items-center gap-2 disabled:opacity-50">
                      <HiCheck className="w-5 h-5" /> Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security & Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={accountData.currentPassword}
                          onChange={(e) => setAccountData({ ...accountData, currentPassword: e.target.value })}
                          required
                          className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-pink/50 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={accountData.newPassword}
                          onChange={(e) => setAccountData({ ...accountData, newPassword: e.target.value })}
                          required
                          minLength={8}
                          className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-pink/50 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                      </div>
                      <small className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Password must be at least 8 characters</small>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={accountData.confirmPassword}
                          onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                          required
                          minLength={8}
                          className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-pink/50 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-3 px-6 rounded-xl hover:bg-neon-pink dark:hover:bg-neon-pink hover:text-white transition-all duration-300 flex items-center gap-2 disabled:opacity-50">
                      <HiKey className="w-5 h-5" /> Change Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserProtectedRoute>
  )
}

export default Settings

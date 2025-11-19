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
import '../../styles/pages/user-settings.css'

function Settings() {
  const { user, fetchUser } = useUser()
  const [activeSection, setActiveSection] = useState('account')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Account settings
  const [accountData, setAccountData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    marketingEmails: false,
    productUpdates: true,
    weeklyDigest: true,
  })

  // Preferences
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
      <div className="user-settings-page">
        <div className="settings-container">
          {/* Header */}
          <div className="settings-header">
            <h1>Settings</h1>
            <p>Manage your account settings and preferences</p>
          </div>

          <div className="settings-layout">
            {/* Sidebar Navigation */}
            <div className="settings-sidebar">
              <button
                className={`settings-nav-item ${activeSection === 'account' ? 'active' : ''}`}
                onClick={() => setActiveSection('account')}
              >
                <HiCog6Tooth /> Account
              </button>
              <button
                className={`settings-nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveSection('notifications')}
              >
                <HiBell /> Notifications
              </button>
              <button
                className={`settings-nav-item ${activeSection === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveSection('preferences')}
              >
                <HiCog6Tooth /> Preferences
              </button>
              <button
                className={`settings-nav-item ${activeSection === 'security' ? 'active' : ''}`}
                onClick={() => setActiveSection('security')}
              >
                <HiShieldCheck /> Security
              </button>
            </div>

            {/* Settings Content */}
            <div className="settings-content">
              {/* Account Settings */}
              {activeSection === 'account' && (
                <div className="settings-section">
                  <h2>Account Information</h2>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" value={accountData.email} disabled />
                      <small>Email cannot be changed. Contact support if you need to update it.</small>
                    </div>
                    <div className="form-group">
                      <label>Account Created</label>
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
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div className="settings-section">
                  <h2>Notification Preferences</h2>
                  <div className="settings-form">
                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={notifications.emailNotifications}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              emailNotifications: e.target.checked,
                            })
                          }
                        />
                        <span>Email Notifications</span>
                      </label>
                      <small>Receive important account-related emails</small>
                    </div>

                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={notifications.productUpdates}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              productUpdates: e.target.checked,
                            })
                          }
                        />
                        <span>Product Updates</span>
                      </label>
                      <small>Get notified about new features and improvements</small>
                    </div>

                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyDigest}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              weeklyDigest: e.target.checked,
                            })
                          }
                        />
                        <span>Weekly Digest</span>
                      </label>
                      <small>Receive a weekly summary of your activity</small>
                    </div>

                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={notifications.marketingEmails}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              marketingEmails: e.target.checked,
                            })
                          }
                        />
                        <span>Marketing Emails</span>
                      </label>
                      <small>Receive promotional emails and special offers</small>
                    </div>

                    <button className="btn-primary" onClick={handleNotificationSave} disabled={loading}>
                      <HiCheck /> Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeSection === 'preferences' && (
                <div className="settings-section">
                  <h2>Preferences</h2>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Theme</label>
                      <select
                        value={preferences.theme}
                        onChange={(e) =>
                          setPreferences({ ...preferences, theme: e.target.value })
                        }
                      >
                        <option value="system">System Default</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) =>
                          setPreferences({ ...preferences, language: e.target.value })
                        }
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Timezone</label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) =>
                          setPreferences({ ...preferences, timezone: e.target.value })
                        }
                      >
                        <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                          {Intl.DateTimeFormat().resolvedOptions().timeZone}
                        </option>
                      </select>
                    </div>

                    <button className="btn-primary" onClick={handlePreferenceSave} disabled={loading}>
                      <HiCheck /> Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="settings-section">
                  <h2>Security & Password</h2>
                  <form className="settings-form" onSubmit={handlePasswordChange}>
                    <div className="form-group">
                      <label>Current Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={accountData.currentPassword}
                          onChange={(e) =>
                            setAccountData({ ...accountData, currentPassword: e.target.value })
                          }
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <HiEyeSlash /> : <HiEye />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={accountData.newPassword}
                          onChange={(e) =>
                            setAccountData({ ...accountData, newPassword: e.target.value })
                          }
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <HiEyeSlash /> : <HiEye />}
                        </button>
                      </div>
                      <small>Password must be at least 8 characters</small>
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={accountData.confirmPassword}
                          onChange={(e) =>
                            setAccountData({ ...accountData, confirmPassword: e.target.value })
                          }
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <HiEyeSlash /> : <HiEye />}
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                      <HiKey /> Change Password
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


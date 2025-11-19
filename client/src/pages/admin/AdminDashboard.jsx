import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { adminAPI } from '../../services/api'
import { HiBookOpen, HiBriefcase, HiEnvelope, HiStar, HiArrowRight, HiUserGroup, HiShieldCheck, HiSun, HiMoon, HiCodeBracket, HiChatBubbleLeftRight } from 'react-icons/hi2'
import '../../styles/pages/admin-dashboard.css'

function AdminDashboard() {
  const { logout, admin } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [stats, setStats] = useState({
    blogs: 0,
    jobs: 0,
    contacts: 0,
    testimonials: 0,
    forums: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [blogsRes, jobsRes, contactsRes, testimonialsRes, forumsRes] = await Promise.all([
        adminAPI.getAllBlogs(),
        adminAPI.getAllJobs(),
        adminAPI.getAllContacts(),
        adminAPI.getAllTestimonials(),
        adminAPI.getAllForums(),
      ])

      setStats({
        blogs: blogsRes.data?.length || 0,
        jobs: jobsRes.data?.length || 0,
        contacts: contactsRes.data?.length || 0,
        testimonials: testimonialsRes.data?.length || 0,
        forums: forumsRes.data?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {admin?.username || 'Admin'}! 
            {admin?.role && (
              <span className="admin-role-badge" style={{ 
                marginLeft: '10px', 
                padding: '4px 12px', 
                borderRadius: '12px', 
                fontSize: '14px',
                backgroundColor: admin.role === 'super_admin' ? '#fbbf24' : admin.role === 'admin' ? '#3b82f6' : '#10b981',
                color: 'white',
                fontWeight: '500'
              }}>
                {admin.role === 'super_admin' && <HiShieldCheck style={{ display: 'inline', marginRight: '4px' }} />}
                {admin.role.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={toggleTheme}
            className="admin-theme-toggle"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <HiSun /> : <HiMoon />}
          </button>
          <button onClick={logout} className="admin-logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-stats-grid">
        <Link to="/admin/blogs" className="admin-stat-card">
          <div className="stat-icon blogs">
            <HiBookOpen />
          </div>
          <div className="stat-content">
            <h3>{loading ? '...' : stats.blogs}</h3>
            <p>Blog Posts</p>
          </div>
          <HiArrowRight className="stat-arrow" />
        </Link>

        <Link to="/admin/jobs" className="admin-stat-card">
          <div className="stat-icon jobs">
            <HiBriefcase />
          </div>
          <div className="stat-content">
            <h3>{loading ? '...' : stats.jobs}</h3>
            <p>Remote Jobs</p>
          </div>
          <HiArrowRight className="stat-arrow" />
        </Link>

        <Link to="/admin/contacts" className="admin-stat-card">
          <div className="stat-icon contacts">
            <HiEnvelope />
          </div>
          <div className="stat-content">
            <h3>{loading ? '...' : stats.contacts}</h3>
            <p>Contact Messages</p>
          </div>
          <HiArrowRight className="stat-arrow" />
        </Link>

        <Link to="/admin/testimonials" className="admin-stat-card">
          <div className="stat-icon testimonials">
            <HiStar />
          </div>
          <div className="stat-content">
            <h3>{loading ? '...' : stats.testimonials}</h3>
            <p>Testimonials</p>
          </div>
          <HiArrowRight className="stat-arrow" />
        </Link>

        <Link to="/admin/forums" className="admin-stat-card">
          <div className="stat-icon forums">
            <HiChatBubbleLeftRight />
          </div>
          <div className="stat-content">
            <h3>{loading ? '...' : stats.forums}</h3>
            <p>Forums</p>
          </div>
          <HiArrowRight className="stat-arrow" />
        </Link>

        {admin?.role === 'super_admin' && (
          <Link to="/admin/admins" className="admin-stat-card">
            <div className="stat-icon admins">
              <HiUserGroup />
            </div>
            <div className="stat-content">
              <h3>Manage</h3>
              <p>Admins</p>
            </div>
            <HiArrowRight className="stat-arrow" />
          </Link>
        )}
      </div>

      <div className="admin-quick-actions">
        <h2>Quick Actions</h2>
        <div className="admin-actions-grid">
          <Link to="/admin/blogs/new" className="admin-action-btn">
            <HiBookOpen />
            <span>Create New Blog Post</span>
          </Link>
          <Link to="/admin/jobs/new" className="admin-action-btn">
            <HiBriefcase />
            <span>Add New Job</span>
          </Link>
          <Link to="/admin/testimonials/new" className="admin-action-btn">
            <HiStar />
            <span>Add New Testimonial</span>
          </Link>
          <Link to="/admin/forums/new" className="admin-action-btn">
            <HiChatBubbleLeftRight />
            <span>Create New Forum</span>
          </Link>
        </div>
      </div>

      {admin?.role === 'dev' && (
        <div className="admin-dev-tools-section">
          <h2>Developer Tools</h2>
          <div className="admin-actions-grid">
            <Link to="/admin/dev-tools" className="admin-action-btn" style={{ backgroundColor: '#10b981' }}>
              <HiCodeBracket />
              <span>Open Dev Tools</span>
            </Link>
          </div>
          <p className="dev-tools-description">
            Access system health, database stats, error logs, and API request logs
          </p>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard


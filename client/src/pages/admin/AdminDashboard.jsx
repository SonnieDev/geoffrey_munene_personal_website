import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiBookOpen, HiBriefcase, HiEnvelope, HiStar, HiArrowRight } from 'react-icons/hi2'
import '../../styles/pages/admin-dashboard.css'

function AdminDashboard() {
  const { logout, admin } = useAuth()
  const [stats, setStats] = useState({
    blogs: 0,
    jobs: 0,
    contacts: 0,
    testimonials: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [blogsRes, jobsRes, contactsRes, testimonialsRes] = await Promise.all([
        adminAPI.getAllBlogs(),
        adminAPI.getAllJobs(),
        adminAPI.getAllContacts(),
        adminAPI.getAllTestimonials(),
      ])

      setStats({
        blogs: blogsRes.data?.length || 0,
        jobs: jobsRes.data?.length || 0,
        contacts: contactsRes.data?.length || 0,
        testimonials: testimonialsRes.data?.length || 0,
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
          <p>Welcome back, {admin?.username || 'Admin'}!</p>
        </div>
        <button onClick={logout} className="admin-logout-btn">
          Logout
        </button>
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
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard


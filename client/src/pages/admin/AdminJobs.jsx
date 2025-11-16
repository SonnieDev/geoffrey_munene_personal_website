import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi2'
import '../../styles/pages/admin-jobs.css'

function AdminJobs() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    fetchJobs()
  }, [isAuthenticated, navigate])

  const fetchJobs = async () => {
    try {
      const response = await adminAPI.getAllJobs()
      if (response.success) {
        setJobs(response.data || [])
      }
    } catch (error) {
      setError('Failed to fetch jobs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return
    }

    try {
      const response = await adminAPI.deleteJob(id)
      if (response.success) {
        setJobs(jobs.filter((job) => job._id !== id))
      }
    } catch (error) {
      alert('Failed to delete job')
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading jobs...</div>
  }

  return (
    <div className="admin-jobs">
      <div className="admin-page-header">
        <h1>Job Management</h1>
        <Link to="/admin/jobs/new" className="admin-add-btn">
          <HiPlus /> Add New Job
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Category</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-empty">
                  No jobs found. <Link to="/admin/jobs/new">Add your first job</Link>
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id}>
                  <td className="admin-title-cell">{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td>{job.category}</td>
                  <td>{job.contractType}</td>
                  <td>
                    <span className={`admin-badge ${job.active ? 'active' : 'inactive'}`}>
                      {job.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/admin/jobs/edit/${job._id}`}
                        className="admin-action-btn edit"
                        title="Edit"
                      >
                        <HiPencil />
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="admin-action-btn delete"
                        title="Delete"
                      >
                        <HiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminJobs


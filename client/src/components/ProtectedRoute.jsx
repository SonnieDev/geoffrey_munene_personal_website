import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/components/protected-route.css'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute


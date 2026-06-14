import { Navigate } from 'react-router-dom'
import useAuth from '../context/useAuth'

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Verifying access...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (role !== 'admin') return <Navigate to="/" replace />

  return children
}
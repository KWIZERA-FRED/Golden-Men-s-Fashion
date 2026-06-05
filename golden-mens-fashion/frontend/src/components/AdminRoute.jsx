import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth()

  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (role !== 'admin') return <Navigate to="/" replace />

  return children
}

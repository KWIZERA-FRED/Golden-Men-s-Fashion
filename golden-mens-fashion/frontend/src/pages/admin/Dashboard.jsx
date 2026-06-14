import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../context/useAuth'
import '../../styles/admin/admin.css'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default function Dashboard() {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to load stats')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [token])

  const cards = [
    { label: 'Total Users',    value: stats.total_users,    icon: '👤', path: '/admin/users'    },
    { label: 'Total Products', value: stats.total_products, icon: '📦', path: '/admin/products' },
    { label: 'Total Orders',   value: stats.total_orders,   icon: '🧾', path: '/admin/orders'   },
    { label: 'Revenue',        value: `RWF ${Number(stats.total_revenue).toLocaleString()}`, icon: '💰', path: '/admin/orders' },
  ]

  if (loading) return (
    <div className="admin-loading">
      <div className="admin-spinner" />
      <p>Loading dashboard...</p>
    </div>
  )

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card" onClick={() => navigate(card.path)}>
            <div className="stat-icon">{card.icon}</div>
            <div>
              <p className="stat-label">{card.label}</p>
              <p className="stat-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-shortcuts">
        <h2>Quick Actions</h2>
        <div className="shortcut-grid">
          <button onClick={() => navigate('/admin/products')}>+ Add Product</button>
          <button onClick={() => navigate('/admin/orders')}>View Orders</button>
          <button onClick={() => navigate('/admin/users')}>Manage Users</button>
        </div>
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import useAuth from '../../context/useAuth'
import '../../styles/admin/admin.css'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function ManageOrders() {
  const { token } = useAuth()

  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch]   = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to load orders')
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [token])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update status')
      setOrders(prev =>
        prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o)
      )
      setSuccess('Order status updated')
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(null)
    }
  }

  const statusColor = (status) => ({
    pending:   'badge-pending',
    confirmed: 'badge-confirmed',
    shipped:   'badge-shipped',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
  }[status] || 'badge-pending')

  const filtered = orders.filter(o =>
    String(o.order_id).includes(search) ||
    (o.user_name || o.user_email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Manage Orders</h1>
          <p>{orders.length} orders total</p>
        </div>
      </div>

      {error   && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading-inline">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">No orders found</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.order_id}>
                  <td>#{o.order_id}</td>
                  <td>{o.user_name || o.user_email || '—'}</td>
                  <td>RWF {Number(o.total).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={o.status}
                      disabled={updating === o.order_id}
                      onChange={e => handleStatusChange(o.order_id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1.5px solid #e0e0e0',
                        fontSize: '0.82rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
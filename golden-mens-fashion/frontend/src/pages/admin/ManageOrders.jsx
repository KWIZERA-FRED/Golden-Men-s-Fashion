import { useEffect, useState } from 'react'
import useAuth from '../../context/useAuth'
import '../../styles/admin/admin.css'

const API_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const STATUS_OPTIONS = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]

export default function ManageOrders() {
  const { token } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [token])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch(`${API_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to load orders')
      }

      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(orderId)
      setError('')
      setSuccess('')

      const res = await fetch(`${API_URL}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update order status')
      }

      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      )

      setSuccess(`Order #${orderId} updated successfully`)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(null)

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    }
  }

  const statusColor = status =>
    ({
      pending: 'badge-pending',
      paid: 'badge-confirmed',
      processing: 'badge-processing',
      shipped: 'badge-shipped',
      delivered: 'badge-delivered',
      cancelled: 'badge-cancelled'
    }[status] || 'badge-pending')

  const filteredOrders = orders.filter(order => {
    const query = search.toLowerCase()

    return (
      String(order.order_id).includes(query) ||
      (order.customer_name || '')
        .toLowerCase()
        .includes(query) ||
      (order.customer_email || '')
        .toLowerCase()
        .includes(query) ||
      (order.phone || '')
        .toLowerCase()
        .includes(query)
    )
  })

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Manage Orders</h1>
          <p>{orders.length} Orders Found</p>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-success">
          {success}
        </div>
      )}

      <div className="admin-toolbar">
        <input
          type="text"
          className="admin-search"
          placeholder="Search by Order ID, Customer, Email or Phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading-inline">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty">
          No orders found
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.order_id}>
                  <td>
                    <strong>#{order.order_id}</strong>
                  </td>

                  <td>
                    <div>
                      <strong>
                        {order.customer_name || 'Unknown User'}
                      </strong>
                      <br />
                      <small>
                        {order.customer_email || 'No Email'}
                      </small>
                    </div>
                  </td>

                  <td>
                    {order.phone || 'N/A'}
                  </td>

                  <td
                    style={{
                      maxWidth: '220px',
                      whiteSpace: 'normal'
                    }}
                  >
                    {order.address || 'N/A'}
                  </td>

                  <td>
                    <strong>
                      RWF {Number(order.total).toLocaleString()}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`badge ${statusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    {order.created_at
                      ? new Date(
                          order.created_at
                        ).toLocaleString()
                      : 'N/A'}
                  </td>

                  <td>
                    <select
                      value={order.status}
                      disabled={updating === order.order_id}
                      onChange={e =>
                        handleStatusChange(
                          order.order_id,
                          e.target.value
                        )
                      }
                      className="status-select"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status.charAt(0).toUpperCase() +
                            status.slice(1)}
                        </option>
                      ))}
                    </select>

                    {updating === order.order_id && (
                      <div
                        style={{
                          marginTop: '6px',
                          fontSize: '0.75rem',
                          color: '#666'
                        }}
                      >
                        Updating...
                      </div>
                    )}
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
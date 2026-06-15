import { useState, useEffect, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/orders.css'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const STATUS_META = {
  pending:    { label: 'Pending',    color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
  paid:       { label: 'Paid',       color: '#0369a1', bg: '#e0f2fe', border: '#bae6fd' },
  processing: { label: 'Processing', color: '#7c3aed', bg: '#ede9fe', border: '#ddd6fe' },
  shipped:    { label: 'Shipped',    color: '#0891b2', bg: '#cffafe', border: '#a5f3fc' },
  delivered:  { label: 'Delivered',  color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
  cancelled:  { label: 'Cancelled',  color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' },
}

const fmt = (n) => `RWF ${Number(n).toLocaleString()}`

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, color: '#6b6b6b', bg: '#f3f4f6', border: '#e5e7eb' }
  return (
    <span
      className="status-badge"
      style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
    >
      {meta.label}
    </span>
  )
}

function OrderCard({ order, expanded, onToggle }) {
  return (
    <div className={`order-card ${expanded ? 'expanded' : ''}`}>

      {/* ── Summary row ── */}
      <div className="order-summary" onClick={onToggle}>
        <div className="order-meta">
          <span className="order-id">Order #{order.order_id}</span>
          <span className="order-date">{fmtDate(order.created_at)}</span>
        </div>

        <div className="order-right">
          <StatusBadge status={order.status} />
          <span className="order-total">{fmt(order.total)}</span>
          <span className={`chevron ${expanded ? 'open' : ''}`}>›</span>
        </div>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="order-detail">

          {/* Items */}
          <div className="order-items">
            {order.items?.length ? order.items.map(item => (
              <div key={item.order_item_id} className="order-item-row">
                <div className="item-image-wrap">
                  {item.image_url
                    ? <img
                        src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`}
                        alt={item.name}
                        onError={e => e.target.style.display = 'none'}
                      />
                    : <div className="item-image-placeholder">📦</div>
                  }
                </div>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">Qty: {item.quantity}</span>
                </div>
                <span className="item-subtotal">{fmt(item.subtotal)}</span>
              </div>
            )) : (
              <p className="no-items">No item details available</p>
            )}
          </div>

          {/* Delivery info */}
          <div className="order-info-grid">
            <div className="info-block">
              <span className="info-label">Delivery Address</span>
              <span className="info-value">{order.address}</span>
            </div>
            <div className="info-block">
              <span className="info-label">Phone</span>
              <span className="info-value">{order.phone}</span>
            </div>
            <div className="info-block">
              <span className="info-label">Order Total</span>
              <span className="info-value total-value">{fmt(order.total)}</span>
            </div>
            <div className="info-block">
              <span className="info-label">Status</span>
              <StatusBadge status={order.status} />
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const { token } = useContext(AuthContext)
  const navigate  = useNavigate()

  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter]   = useState('all')

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.status === 401) { navigate('/login'); return }
      if (!res.ok) throw new Error('Failed to load orders')

      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchOrders()
  }, [token, fetchOrders, navigate])

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  // ── Loading ──────────────────────────────────────────────
  if (loading) return (
    <div className="orders-page">
      <div className="orders-loading">
        <div className="loading-spinner" />
        <p>Loading your orders...</p>
      </div>
    </div>
  )

  // ── Error ────────────────────────────────────────────────
  if (error) return (
    <div className="orders-page">
      <div className="orders-error">
        <p>{error}</p>
        <button onClick={fetchOrders}>Try Again</button>
      </div>
    </div>
  )

  // ── Empty ────────────────────────────────────────────────
  if (!orders.length) return (
    <div className="orders-page">
      <div className="orders-empty">
        <div className="empty-icon">🧾</div>
        <h2>No orders yet</h2>
        <p>When you place an order it will appear here.</p>
        <button onClick={() => navigate('/products')}>Start Shopping</button>
      </div>
    </div>
  )

  return (
    <div className="orders-page">

      {/* Header */}
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'} total</p>
        </div>
        <button className="btn-shop-more" onClick={() => navigate('/products')}>
          + Shop More
        </button>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {['all', ...Object.keys(STATUS_META)].map(s => (
          <button
            key={s}
            className={`filter-tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : STATUS_META[s].label}
            {s === 'all'
              ? <span className="tab-count">{orders.length}</span>
              : orders.filter(o => o.status === s).length > 0
                ? <span className="tab-count">{orders.filter(o => o.status === s).length}</span>
                : null
            }
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="no-filtered">No {filter} orders found.</div>
      ) : (
        <div className="orders-list">
          {filtered.map(order => (
            <OrderCard
              key={order.order_id}
              order={order}
              expanded={expanded === order.order_id}
              onToggle={() => toggle(order.order_id)}
            />
          ))}
        </div>
      )}

    </div>
  )
}
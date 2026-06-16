import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/checkout.css' //fixed checkout.css so it can easily commit


const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const PAYMENT_METHODS = [
  { id: 'momo',        label: 'MTN Mobile Money',    icon: '📱' },
  { id: 'airtel',      label: 'Airtel Money',         icon: '📲' },
  { id: 'card',        label: 'Credit / Debit Card',  icon: '💳' },
  { id: 'bank',        label: 'Bank Transfer',        icon: '🏦' },
]

const STEPS = ['Delivery', 'Payment', 'Confirm']

export default function Checkout() {
  const { token } = useContext(AuthContext)
  const navigate   = useNavigate()

  const [step, setStep]               = useState(0)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [orderId, setOrderId]         = useState(null)
  const [transactionId, setTransactionId] = useState('')

  const [delivery, setDelivery] = useState({ address: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState('momo')
  const [momoNumber, setMomoNumber]       = useState('')

  const setField = (key, val) => setDelivery(prev => ({ ...prev, [key]: val }))

  // ── Step 0: submit delivery → create order ──────────────
  const handleDeliverySubmit = async () => {
    if (!delivery.address.trim() || !delivery.phone.trim()) {
      setError('Address and phone number are required')
      return
    }
    setError('')
    setStep(1)
  }

  // ── Step 1: submit payment → pay order ──────────────────
  const handlePayment = async () => {
    if ((paymentMethod === 'momo' || paymentMethod === 'airtel') && !momoNumber.trim()) {
      setError('Please enter your mobile money number')
      return
    }

    try {
      setLoading(true)
      setError('')

      // 1. Create order
      const orderRes = await fetch(`${API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          address: delivery.address,
          phone:   delivery.phone
        })
      })

      const orderData = await orderRes.json().catch(() => ({}))
      if (!orderRes.ok) throw new Error(orderData.message || 'Checkout failed')

      const newOrderId = orderData.order_id
      setOrderId(newOrderId)

      // 2. Pay order
      const payRes = await fetch(`${API_URL}/payments/pay/${newOrderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ payment_method: paymentMethod })
      })

      const payData = await payRes.json().catch(() => ({}))
      if (!payRes.ok) throw new Error(payData.message || 'Payment failed')

      setTransactionId(payData.transaction_id)
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="checkout-page">

      {/* Progress bar */}
      <div className="checkout-progress">
        {STEPS.map((s, i) => (
          <div key={s} className={`progress-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="step-circle">{i < step ? '✓' : i + 1}</div>
            <span className="step-label">{s}</span>
            {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      <div className="checkout-body">

        {/* ── STEP 0: Delivery ── */}
        {step === 0 && (
          <div className="checkout-card">
            <h2>Delivery Details</h2>
            <p className="card-subtitle">Where should we deliver your order?</p>

            {error && <div className="checkout-error">{error}</div>}

            <div className="form-group">
              <label>Delivery Address</label>
              <input
                type="text"
                placeholder="Street, District, City"
                value={delivery.address}
                onChange={e => setField('address', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+250 7XX XXX XXX"
                value={delivery.phone}
                onChange={e => setField('phone', e.target.value)}
              />
            </div>

            <button className="btn-primary" onClick={handleDeliverySubmit}>
              Continue to Payment →
            </button>
          </div>
        )}

        {/* ── STEP 1: Payment ── */}
        {step === 1 && (
          <div className="checkout-card">
            <h2>Payment Method</h2>
            <p className="card-subtitle">Choose how you'd like to pay</p>

            {error && <div className="checkout-error">{error}</div>}

            <div className="payment-methods">
              {PAYMENT_METHODS.map(m => (
                <label
                  key={m.id}
                  className={`payment-option ${paymentMethod === m.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => { setPaymentMethod(m.id); setError('') }}
                  />
                  <span className="payment-icon">{m.icon}</span>
                  <span className="payment-label">{m.label}</span>
                  {paymentMethod === m.id && (
                    <span className="payment-check">✓</span>
                  )}
                </label>
              ))}
            </div>

            {(paymentMethod === 'momo' || paymentMethod === 'airtel') && (
              <div className="form-group momo-input">
                <label>
                  {paymentMethod === 'momo' ? 'MTN MoMo' : 'Airtel Money'} Number
                </label>
                <input
                  type="tel"
                  placeholder="+250 7XX XXX XXX"
                  value={momoNumber}
                  onChange={e => setMomoNumber(e.target.value)}
                />
              </div>
            )}

            <div className="checkout-actions">
              <button className="btn-ghost" onClick={() => { setStep(0); setError('') }}>
                ← Back
              </button>
              <button className="btn-primary" onClick={handlePayment} disabled={loading}>
                {loading ? <span className="btn-spinner" /> : 'Pay Now'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Success ── */}
        {step === 2 && (
          <div className="checkout-card success-card">
            <div className="success-icon">✓</div>
            <h2>Order Placed!</h2>
            <p className="card-subtitle">Thank you for your purchase. A confirmation email has been sent.</p>

            <div className="order-details">
              <div className="detail-row">
                <span>Order ID</span>
                <strong>#{orderId}</strong>
              </div>
              <div className="detail-row">
                <span>Payment</span>
                <strong className="paid-badge">Paid</strong>
              </div>
              <div className="detail-row">
                <span>Transaction</span>
                <strong className="txn-id">{transactionId.slice(0, 18)}…</strong>
              </div>
              <div className="detail-row">
                <span>Delivery to</span>
                <strong>{delivery.address}</strong>
              </div>
            </div>

            <div className="checkout-actions">
              <button className="btn-ghost" onClick={() => navigate('/products')}>
                Continue Shopping
              </button>
              <button className="btn-primary" onClick={() => navigate('/orders')}>
                View Orders
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
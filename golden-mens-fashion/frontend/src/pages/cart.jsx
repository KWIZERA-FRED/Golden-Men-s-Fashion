import { useState, useEffect, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/cart.css'   
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default function Cart() {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  const [cart, setCart] = useState({ cart_items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)
  const [updating, setUpdating] = useState(null)

  const fetchCart = useCallback(async () => {
    if (!token) return
    
    try {
      setLoading(true)
      setError('')

      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/login')
          return
        }
        throw new Error('Failed to load cart')
      }

      const data = await res.json()
      setCart({
        cart_items: data.cart_items || [],
        total: data.total || 0
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [token, fetchCart, navigate])

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    setUpdating(itemId)
    
    // Optimistic update
    setCart(prev => {
      const updatedItems = prev.cart_items.map(item => 
        item.cart_item_id === itemId 
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
          : item
      )
      const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
      return { cart_items: updatedItems, total }
    })

    try {
      const res = await fetch(`${API_URL}/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      })

      if (!res.ok) throw new Error('Failed to update quantity')
      
      await fetchCart()
    } catch (err) {
      setError(err.message)
      fetchCart()
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId) => {
    setRemoving(itemId)

    setCart(prev => {
      const updated = prev.cart_items.filter(i => i.cart_item_id !== itemId)
      const total = updated.reduce((sum, i) => sum + i.subtotal, 0)
      return { cart_items: updated, total }
    })

    try {
      const res = await fetch(`${API_URL}/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to remove item')
      
      await fetchCart()
    } catch (err) {
      setError(err.message)
      fetchCart()
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="cart-error">
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchCart}>Try Again</button>
        </div>
      </div>
    )
  }

  if (!cart.cart_items.length) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="empty-cart-icon">🛒</div>
          <h1>Your Cart is Empty</h1>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="btn-shop" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{cart.cart_items.length} {cart.cart_items.length === 1 ? 'item' : 'items'}</p>
      </div>

      {error && <div className="cart-error-message">{error}</div>}

      <div className="cart-layout">
        <div className="cart-items">
          {cart.cart_items.map((item) => (
            <div key={item.cart_item_id} className="cart-item">
              {item.image_url && (
                <div className="cart-item-image">
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              
              <div className="cart-item-details">
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">
                    RWF {Number(item.price).toLocaleString()}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                      disabled={updating === item.cart_item_id || item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                      disabled={updating === item.cart_item_id}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-subtotal">
                    <span>Subtotal:</span>
                    <strong>RWF {Number(item.subtotal).toLocaleString()}</strong>
                  </div>

                  <button
                    className="btn-remove"
                    onClick={() => removeItem(item.cart_item_id)}
                    disabled={removing === item.cart_item_id}
                  >
                    {removing === item.cart_item_id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-breakdown">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>RWF {Number(cart.total).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>Included</span>
            </div>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>RWF {Number(cart.total).toLocaleString()}</span>
          </div>
          
          <button
            className="btn-checkout"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          
          <button
            className="btn-continue"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
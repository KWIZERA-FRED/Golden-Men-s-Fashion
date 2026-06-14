import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/ProductDetail.css'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding]   = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid product ID')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        })
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    return () => controller.abort()
  }, [id])

  // Auto-clear success/error banners
  useEffect(() => {
    if (!success && !error) return
    const t = setTimeout(() => { setSuccess(''); setError('') }, 4000)
    return () => clearTimeout(t)
  }, [success, error])

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login', { state: { from: `/products/${id}` } })
      return
    }

    try {
      setAdding(true)
      setError('')
      setSuccess('')

      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: Number(id), quantity })
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to add to cart')

      // Redirect to cart after successful add
      navigate('/cart')
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const imageUrl = product?.image_url
    ? product.image_url.startsWith('http')
      ? product.image_url
      : `http://localhost:5000${product.image_url}`
    : '/placeholder.jpg'

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="product-detail-page">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="error">Product not found</div>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">

        <div className="product-image">
          <img src={imageUrl} alt={product.name} />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>

          <p className="price">RWF {Number(product.price).toLocaleString()}</p>

          {product.description && (
            <p className="description">{product.description}</p>
          )}

          <div className="qty">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(product.stock ?? 99, q + 1))}
              disabled={product.stock != null && quantity >= product.stock}
            >
              +
            </button>
          </div>

          {product.stock === 0 ? (
            <p className="out-of-stock">Out of stock</p>
          ) : (
            <button
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          )}

          {success && <p className="success">{success}</p>}
          {error   && <p className="error">{error}</p>}

          <button className="btn-secondary" onClick={() => navigate('/products')}>
            ← Back to Products
          </button>
        </div>

      </div>
    </div>
  )
}
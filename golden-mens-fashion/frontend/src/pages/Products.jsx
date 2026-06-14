import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import ProductCard from '../components/ProductCard'
import '../styles/Products.css'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default function Products() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const selectedCategory = useMemo(() => {
    const c = searchParams.get('category')
    return c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All'
  }, [searchParams])

  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await fetch(`${API_URL}/products`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        })

        if (!res.ok) throw new Error(`Server error: ${res.status}`)

        const data = await res.json()
        setProducts(Array.isArray(data.products) ? data.products : [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load products')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    return () => controller.abort()
  }, [])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return products.filter((p) => {
      const matchSearch = !term || (p.name || '').toLowerCase().includes(term)
      const matchCategory =
        selectedCategory === 'All' ||
        (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
      return matchSearch && matchCategory
    })
  }, [products, searchTerm, selectedCategory])

  const handleViewDetails = (product) => {
    const id = product.product_id ?? product.id

    if (!id) {
      console.error('Missing product id:', product)
      return
    }

    if (!token) {
      navigate('/login', { state: { from: `/products/${id}` } })
      return
    }

    navigate(`/products/${id}`)
  }

  if (loading) {
    return (
      <div className="products-page">
        <div className="no-products">Loading products...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="no-products">{error}</div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <section className="products-hero">
        <h1>Our Collection</h1>
        <p>Premium menswear crafted for modern elegance</p>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      <div className="section-container">
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.product_id ?? product.id}
                product={product}
                onViewDetails={() => handleViewDetails(product)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
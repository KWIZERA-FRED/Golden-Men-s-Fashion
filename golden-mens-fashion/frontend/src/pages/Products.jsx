import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import ProductCard from '../components/ProductCard'
import '../styles/Products.css'

// --- Constants ---
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const CATEGORIES = ["All", "Suits", "Shirts", "Trousers", "Shoes", "Accessories"]

export default function Products() {
  // --- Hooks & Navigation ---
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // --- State Hooks ---
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // --- Memoized Values ---
  const selectedCategory = useMemo(() => {
    return searchParams.get("category") || "All"
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase()

    return products.filter(product => {
      const matchSearch = !term || product.name?.toLowerCase().includes(term)
      const matchCategory = selectedCategory === "All" || product.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [products, searchTerm, selectedCategory])

  // --- Side Effects ---
  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/products?per_page=100`, {
          signal: controller.signal,
          headers: { Accept: "application/json" }
        })

        if (!res.ok) throw new Error("Failed loading products")

        const data = await res.json()
        setProducts(data.products || [])
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    return () => controller.abort()
  }, [])

  // --- Handlers ---
  const changeCategory = (category) => {
    if (category === "All") {
      navigate("/products")
    } else {
      navigate(`/products?category=${category}`)
    }
  }

  const handleViewDetails = (product) => {
    const id = product.product_id ?? product.id

    if (!token) {
      navigate("/login", { state: { from: `/products/${id}` } })
      return
    }
    navigate(`/products/${id}`)
  }

  // --- Early Returns for Statuses ---
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

  // --- Render ---
  return (
    <div className="products-page">
      
      {/* HERO & SEARCH */}
      <section className="products-hero">
        <h1>Our Collection</h1>
        <p>Premium menswear crafted for modern elegance</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div className="category-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => changeCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS DISPLAY */}
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
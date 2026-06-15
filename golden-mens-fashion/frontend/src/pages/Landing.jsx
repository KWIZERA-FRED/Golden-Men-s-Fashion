import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import '../styles/Landing.css'

const API_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const UPLOADS_URL =
  import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads'

const categories = ['Suits', 'Shirts', 'Trousers', 'Shoes', 'Accessories']

export default function Landing() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [email, setEmail] = useState('')

  const { user, token } = useAuth()
  const navigate = useNavigate()

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_URL}/products`)
        const data = await res.json()

        const products = Array.isArray(data)
          ? data
          : data.products || []

        setFeaturedProducts(products.slice(0, 6)) // more items for smooth loop
      } catch (err) {
        console.error(err)
      }
    }

    fetchFeatured()
  }, [])

  // ---------------- NAVIGATION ----------------
  const handleProtectedView = (id) => {
    if (!user || !token) {
      navigate('/login', { state: { from: `/products/${id}` } })
      return
    }
    navigate(`/products/${id}`)
  }

  // ---------------- IMAGE ----------------
  const getImage = (p) =>
    p.image_url ||
    (p.image ? `${UPLOADS_URL}/${p.image}` : '/placeholder.jpg')

  // ---------------- NEWSLETTER ----------------
  const handleSubscribe = (e) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">New Season 2026</p>

          <h1 className="hero-title">
            Dressed for the <span className="hero-accent">Bold Man.</span>
          </h1>

          <p className="hero-subtitle">
            Premium menswear crafted for modern identity.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/about" className="btn-secondary">Our Story</Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-placeholder">♛</div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <div className="section-container">
          <h2 className="section-title">Shop by Category</h2>

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat.toLowerCase()}`}
                className="category-card"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BESTSELLERS CAROUSEL ================= */}
      <section className="featured">
        <div className="section-container">

          <h2 className="section-title">Bestsellers</h2>

          <div className="carousel-wrapper">

            <div className="carousel-track">

              {/* DUPLICATED LIST FOR INFINITE LOOP */}
              {featuredProducts.concat(featuredProducts).map((p, i) => {
                const id = p.product_id || p.id
                const name = p.name || p.product_name

                return (
                  <div key={`${id}-${i}`} className="carousel-card">

                    <div className="carousel-img">
                      <img
                        src={getImage(p)}
                        alt={name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg'
                        }}
                      />
                    </div>

                    <div className="carousel-info">
                      <h3>{name}</h3>

                      <p className="carousel-cat">
                        {p.category || 'Uncategorized'}
                      </p>

                      <p className="carousel-price">
                        RWF {Number(p.price || 0).toLocaleString()}
                      </p>

                      <button
                        onClick={() => handleProtectedView(id)}
                        className="btn-primary btn-small"
                      >
                        View
                      </button>
                    </div>

                  </div>
                )
              })}

            </div>
          </div>

          <div className="section-cta">
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
          </div>

        </div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <div className="section-container">
          <h2 className="section-title">Why Choose Us</h2>

          <div className="trust-grid">
            <div className="trust-item">
              🚚 <h4>Fast Delivery</h4><p>Across Rwanda</p>
            </div>
            <div className="trust-item">
              💎 <h4>Premium Quality</h4><p>Modern menswear</p>
            </div>
            <div className="trust-item">
              🔒 <h4>Secure Payments</h4><p>Trusted checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>Up to 30% Off End of Season Sale</h2>
          <p>Limited time only</p>
          <Link to="/products" className="btn-primary">
            Claim Offer
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <div className="section-container">
          <h2>Join Our Newsletter</h2>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

    </div>
  )
}
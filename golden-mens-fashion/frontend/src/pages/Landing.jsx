import { Link } from 'react-router-dom'
import '../styles/Landing.css'

const featuredProducts = [
  { id: 1, name: 'Classic Suit', category: 'Suits', price: 85000 },
  { id: 2, name: 'Linen Shirt', category: 'Shirts', price: 28000 },
  { id: 3, name: 'Oxford Shoes', category: 'Shoes', price: 55000 },
  { id: 4, name: 'Leather Watch', category: 'Accessories', price: 42000 },
]

const categories = ['Suits', 'Shirts', 'Trousers', 'Shoes', 'Accessories']

export default function Landing() {
  return (
    <div className="landing">

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">New Season 2025</p>
          <h1 className="hero-title">Dressed for the <span className="hero-accent">Bold Man.</span></h1>
          <p className="hero-subtitle">Premium menswear. Delivered with pride across Rwanda.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/about" className="btn-secondary">Our Story</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">♛</div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="section-container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.toLowerCase()}`} key={cat} className="category-card">
                <span>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <div className="section-container">
          <h2 className="section-title">Bestsellers</h2>
          <div className="featured-grid">
            {featuredProducts.map((p) => (
              <div key={p.id} className="featured-card">
                <div className="featured-card-img">
                  <div className="featured-card-placeholder">♛</div>
                </div>
                <div className="featured-card-info">
                  <h3>{p.name}</h3>
                  <p className="featured-card-cat">{p.category}</p>
                  <p className="featured-card-price">RWF {p.price.toLocaleString()}</p>
                  <Link to={`/products/${p.id}`} className="btn-primary btn-small">View</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/products" className="btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>Up to 30% off — End of Season Sale</h2>
          <p>Limited time. Selected styles only.</p>
          <Link to="/products" className="btn-primary">Claim Offer</Link>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="trust">
        <div className="section-container">
          <div className="trust-grid">
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <h4>Free Delivery</h4>
              <p>Orders over RWF 50,000</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔄</span>
              <h4>Easy Returns</h4>
              <p>30-day return policy</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <h4>Secure Checkout</h4>
              <p>SSL encrypted payments</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⭐</span>
              <h4>4.9 / 5 Rating</h4>
              <p>From 800+ happy customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="section-container">
          <h2>Stay in the Know</h2>
          <p>New drops, style tips and exclusive offers.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

    </div>
  )
}

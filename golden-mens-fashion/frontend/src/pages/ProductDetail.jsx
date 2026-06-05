import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import '../styles/ProductDetail.css'

const allProducts = [
  { id: 1, name: 'Classic Suit', category: 'Suits', price: 85000, rating: 4.8, reviews: 124, image: '👔', badge: 'Bestseller', inStock: true, sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Navy', 'Charcoal'], description: 'Our signature classic suit crafted from premium wool blend. Features a tailored fit with notch lapels, flap pockets, and side vents. Perfect for boardroom meetings and formal occasions.', features: ['Premium wool blend fabric', 'Notch lapels', 'Flap pockets', 'Side vents', 'Fully lined', 'Dry clean only'], fabric: 'Wool Blend', fit: 'Tailored Fit', occasion: 'Formal / Business' },
  { id: 2, name: 'Linen Shirt', category: 'Shirts', price: 28000, rating: 4.6, reviews: 89, image: '👕', badge: null, inStock: true, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Beige', 'Light Blue'], description: 'Lightweight and breathable linen shirt perfect for warm weather. Features a spread collar, mother-of-pearl buttons, and a relaxed yet polished silhouette.', features: ['100% linen', 'Spread collar', 'Mother-of-pearl buttons', 'Chest pocket', 'Relaxed fit', 'Machine washable'], fabric: '100% Linen', fit: 'Relaxed Fit', occasion: 'Casual / Smart Casual' },
  { id: 3, name: 'Oxford Shoes', category: 'Shoes', price: 55000, rating: 4.9, reviews: 256, image: '👞', badge: 'Top Rated', inStock: true, sizes: ['40', '41', '42', '43', '44'], colors: ['Brown', 'Black'], description: 'Handcrafted Oxford shoes made from full-grain leather. Goodyear welted construction ensures durability and comfort. A timeless addition to any gentleman\'s wardrobe.', features: ['Full-grain leather', 'Goodyear welted', 'Leather sole', 'Calfskin lining', 'Hand-polished finish', 'Dust bag included'], fabric: 'Full-Grain Leather', fit: 'True to Size', occasion: 'Formal / Business' },
  { id: 4, name: 'Leather Watch', category: 'Accessories', price: 42000, rating: 4.7, reviews: 67, image: '⌚', badge: 'Limited', inStock: true, sizes: ['One Size'], colors: ['Brown Leather', 'Black Leather'], description: 'Elegant timepiece with genuine leather strap and Japanese quartz movement. Features a minimalist dial with date display and sapphire-coated glass.', features: ['Japanese quartz movement', 'Genuine leather strap', 'Sapphire-coated glass', 'Date display', 'Water resistant 30m', '2-year warranty'], fabric: 'Stainless Steel / Leather', fit: 'Adjustable Strap', occasion: 'Everyday / Formal' },
]

const relatedProducts = [
  { id: 5, name: 'Wool Blazer', price: 95000, image: '🤵', rating: 4.5 },
  { id: 6, name: 'Silk Tie', price: 15000, image: '👔', rating: 4.4 },
  { id: 11, name: 'Slim Fit Suit', price: 78000, image: '👔', rating: 4.9 },
  { id: 12, name: 'Leather Belt', price: 25000, image: '🪢', rating: 4.5 },
]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [activeImage, setActiveImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const foundProduct = allProducts.find(p => p.id === Number(id))
    if (foundProduct) {
      setProduct(foundProduct)
      setSelectedSize(foundProduct.sizes[0] || '')
      setSelectedColor(foundProduct.colors[0] || '')
    }
    window.scrollTo(0, 0)
  }, [id])

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="loading">Loading product...</div>
      </div>
    )
  }

  const handleAddToCart = () => {
    console.log('Added to cart:', { ...product, selectedSize, selectedColor, quantity })
    // Add your cart logic here
    alert(`${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="section-container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category.toLowerCase()}`}>{product.category}</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="section-container">
        <div className="product-detail-grid">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <span className="product-emoji-large">{product.image}</span>
              {product.badge && (
                <span className={`product-detail-badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
                  {product.badge}
                </span>
              )}
            </div>
            <div className="image-thumbnails">
              {[0, 1, 2, 3].map((thumb) => (
                <button
                  key={thumb}
                  className={`thumbnail ${activeImage === thumb ? 'active' : ''}`}
                  onClick={() => setActiveImage(thumb)}
                >
                  <span className="product-emoji-small">{product.image}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-info-header">
              <span className="product-category-tag">{product.category}</span>
              <h1>{product.name}</h1>
              <div className="product-detail-rating">
                <span className="stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}>★</span>
                  ))}
                </span>
                <span className="rating-value">{product.rating}</span>
                <span className="review-link">({product.reviews} reviews)</span>
              </div>
              <div className="product-detail-price">RWF {product.price.toLocaleString()}</div>
            </div>

            <p className="product-short-desc">{product.description}</p>

            {/* Size Selection */}
            <div className="product-option">
              <div className="option-header">
                <label>Size</label>
                <button className="size-guide-btn">Size Guide</button>
              </div>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="product-option">
              <label>Color: <strong>{selectedColor}</strong></label>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  >
                    <span className={`color-swatch color-${color.toLowerCase().replace(/\s+/g, '-')}`}></span>
                    <span className="color-name">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="product-option">
              <label>Quantity</label>
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions-row">
              <button className="btn-primary btn-add-to-cart" onClick={handleAddToCart}>
                Add to Cart — RWF {(product.price * quantity).toLocaleString()}
              </button>
              <button className="btn-buy-now" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button
                className={`btn-wishlist ${isWishlisted ? 'wishlisted' : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
                title="Add to Wishlist"
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="product-trust">
              <div className="trust-badge">
                <span>🚚</span> Free delivery over RWF 50,000
              </div>
              <div className="trust-badge">
                <span>🔄</span> 30-day easy returns
              </div>
              <div className="trust-badge">
                <span>🔒</span> Secure checkout
              </div>
            </div>

            {/* Product Meta */}
            <div className="product-meta-info">
              <div className="meta-item">
                <span className="meta-label">Fabric</span>
                <span className="meta-value">{product.fabric}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Fit</span>
                <span className="meta-value">{product.fit}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Occasion</span>
                <span className="meta-value">{product.occasion}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="section-container">
        <div className="product-tabs">
          <div className="tabs-header">
            {['description', 'features', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && ` (${product.reviews})`}
              </button>
            ))}
          </div>
          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Product Description</h3>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'features' && (
              <div className="tab-panel">
                <h3>Key Features</h3>
                <ul className="features-list">
                  {product.features.map((feature, i) => (
                    <li key={i}>
                      <span className="feature-check">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <h3>Customer Reviews</h3>
                <div className="reviews-summary">
                  <div className="reviews-average">
                    <span className="reviews-big-number">{product.rating}</span>
                    <div className="stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}>★</span>
                      ))}
                    </div>
                    <span>Based on {product.reviews} reviews</span>
                  </div>
                  <div className="reviews-bars">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="review-bar-row">
                        <span>{star} ★</span>
                        <div className="review-bar">
                          <div
                            className="review-bar-fill"
                            style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="section-container">
        <section className="related-products">
          <h2>You May Also Like</h2>
          <div className="related-grid">
            {relatedProducts.map((rp) => (
              <Link to={`/products/${rp.id}`} key={rp.id} className="related-card">
                <div className="related-card-image">
                  <span className="product-emoji">{rp.image}</span>
                </div>
                <div className="related-card-body">
                  <h3>{rp.name}</h3>
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < Math.floor(rp.rating) ? 'star-filled' : 'star-empty'}>★</span>
                    ))}
                  </div>
                  <span className="related-price">RWF {rp.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
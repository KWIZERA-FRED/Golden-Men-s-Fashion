import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import '../styles/Products.css'

const allProducts = [
  { id: 1, name: 'Classic Suit', category: 'Suits', price: 85000, rating: 4.8, reviews: 124, image: '👔', badge: 'Bestseller', inStock: true, sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Navy', 'Charcoal'] },
  { id: 2, name: 'Linen Shirt', category: 'Shirts', price: 28000, rating: 4.6, reviews: 89, image: '👕', badge: null, inStock: true, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Beige', 'Light Blue'] },
  { id: 3, name: 'Oxford Shoes', category: 'Shoes', price: 55000, rating: 4.9, reviews: 256, image: '👞', badge: 'Top Rated', inStock: true, sizes: ['40', '41', '42', '43', '44'], colors: ['Brown', 'Black'] },
  { id: 4, name: 'Leather Watch', category: 'Accessories', price: 42000, rating: 4.7, reviews: 67, image: '⌚', badge: 'Limited', inStock: true, sizes: ['One Size'], colors: ['Brown Leather', 'Black Leather'] },
  { id: 5, name: 'Wool Blazer', category: 'Suits', price: 95000, rating: 4.5, reviews: 45, image: '🤵', badge: 'New', inStock: true, sizes: ['M', 'L', 'XL'], colors: ['Navy', 'Grey', 'Burgundy'] },
  { id: 6, name: 'Silk Tie', category: 'Accessories', price: 15000, rating: 4.4, reviews: 198, image: '👔', badge: null, inStock: true, sizes: ['One Size'], colors: ['Red', 'Blue', 'Gold', 'Black'] },
  { id: 7, name: 'Chino Trousers', category: 'Trousers', price: 35000, rating: 4.6, reviews: 112, image: '👖', badge: 'Bestseller', inStock: true, sizes: ['30', '32', '34', '36', '38'], colors: ['Khaki', 'Navy', 'Olive', 'Black'] },
  { id: 8, name: 'Loafer Shoes', category: 'Shoes', price: 48000, rating: 4.7, reviews: 89, image: '👞', badge: null, inStock: true, sizes: ['40', '41', '42', '43', '44', '45'], colors: ['Brown', 'Black', 'Burgundy'] },
  { id: 9, name: 'Cashmere Sweater', category: 'Shirts', price: 65000, rating: 4.8, reviews: 56, image: '🧥', badge: 'Premium', inStock: true, sizes: ['M', 'L', 'XL'], colors: ['Camel', 'Navy', 'Grey'] },
  { id: 10, name: 'Cufflinks Set', category: 'Accessories', price: 22000, rating: 4.3, reviews: 143, image: '💎', badge: 'Gift Idea', inStock: true, sizes: ['One Size'], colors: ['Silver', 'Gold', 'Rose Gold'] },
  { id: 11, name: 'Slim Fit Suit', category: 'Suits', price: 78000, rating: 4.9, reviews: 78, image: '👔', badge: 'New', inStock: true, sizes: ['S', 'M', 'L', 'XL'], colors: ['Charcoal', 'Navy', 'Black'] },
  { id: 12, name: 'Leather Belt', category: 'Accessories', price: 25000, rating: 4.5, reviews: 201, image: '🪢', badge: null, inStock: true, sizes: ['32', '34', '36', '38', '40'], colors: ['Brown', 'Black'] },
]

const categories = ['All', 'Suits', 'Shirts', 'Trousers', 'Shoes', 'Accessories']
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategory(category.charAt(0).toUpperCase() + category.slice(1))
    }
  }, [searchParams])

  const filteredProducts = allProducts
    .filter(product => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) return false
      if (product.price < priceRange.min || product.price > priceRange.max) return false
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'newest': return b.id - a.id
        default: return 0
      }
    })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    if (category === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category: category.toLowerCase() })
    }
  }

  return (
    <div className="products-page">
      {/* Hero Banner */}
      <section className="products-hero">
        <div className="products-hero-content">
          <p className="hero-breadcrumb">
            <Link to="/">Home</Link> / Products
            {selectedCategory !== 'All' && ` / ${selectedCategory}`}
          </p>
          <h1>{selectedCategory === 'All' ? 'Our Collection' : selectedCategory}</h1>
          <p>Discover premium menswear crafted for the modern gentleman</p>
        </div>
      </section>

      <div className="section-container">
        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className={`products-sidebar ${showFilters ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button 
                className="sidebar-close" 
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="filter-section">
              <h4>Search</h4>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            {/* Categories */}
            <div className="filter-section">
              <h4>Categories</h4>
              <div className="category-list">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                    {cat !== 'All' && (
                      <span className="category-count">
                        ({allProducts.filter(p => p.category === cat).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-range">
                <div className="range-inputs">
                  <div className="range-input-group">
                    <label>Min</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))
                        setCurrentPage(1)
                      }}
                    />
                  </div>
                  <span className="range-separator">-</span>
                  <div className="range-input-group">
                    <label>Max</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))
                        setCurrentPage(1)
                      }}
                    />
                  </div>
                </div>
                <div className="price-presets">
                  <button onClick={() => setPriceRange({ min: 0, max: 25000 })}>Under 25K</button>
                  <button onClick={() => setPriceRange({ min: 25000, max: 50000 })}>25K-50K</button>
                  <button onClick={() => setPriceRange({ min: 50000, max: 100000 })}>50K+</button>
                  <button onClick={() => setPriceRange({ min: 0, max: 100000 })}>All</button>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              className="btn-clear-filters"
              onClick={() => {
                setSelectedCategory('All')
                setPriceRange({ min: 0, max: 100000 })
                setSearchTerm('')
                setSortBy('featured')
                setSearchParams({})
                setCurrentPage(1)
              }}
            >
              Clear All Filters
            </button>
          </aside>

          {/* Overlay for mobile sidebar */}
          {showFilters && (
            <div className="sidebar-overlay" onClick={() => setShowFilters(false)}></div>
          )}

          {/* Products Grid */}
          <main className="products-main">
            {/* Top Bar */}
            <div className="products-topbar">
              <button 
                className="btn-filter-toggle"
                onClick={() => setShowFilters(true)}
              >
                ☰ Filters
              </button>
              <p className="products-count">
                Showing <strong>{paginatedProducts.length}</strong> of <strong>{filteredProducts.length}</strong> products
              </p>
              <div className="sort-wrapper">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="products-grid">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-card-image">
                      <span className="product-emoji">{product.image}</span>
                      {product.badge && (
                        <span className={`product-badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
                          {product.badge}
                        </span>
                      )}
                      <div className="product-actions">
                        <button className="action-btn" title="Add to Wishlist">♡</button>
                        <button className="action-btn" title="Quick View">👁</button>
                      </div>
                    </div>
                    <div className="product-card-body">
                      <span className="product-category">{product.category}</span>
                      <h3>
                        <Link to={`/products/${product.id}`}>{product.name}</Link>
                      </h3>
                      <div className="product-rating">
                        <span className="stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}>
                              ★
                            </span>
                          ))}
                        </span>
                        <span className="review-count">({product.reviews})</span>
                      </div>
                      <div className="product-meta">
                        <span className="product-sizes">
                          Sizes: {product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? '...' : ''}
                        </span>
                      </div>
                      <div className="product-price-row">
                        <span className="product-price">RWF {product.price.toLocaleString()}</span>
                        <Link to={`/products/${product.id}`} className="btn-add-cart">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <span className="no-products-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setSelectedCategory('All')
                    setPriceRange({ min: 0, max: 100000 })
                    setSearchTerm('')
                    setSortBy('featured')
                    setSearchParams({})
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  ← Previous
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
import { Link } from 'react-router-dom'
import '../styles/ProductCard.css'

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-card-img">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">No Image</div>
        )}
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-category">{product.category}</p>
        <p className="product-card-price">RWF {product.price?.toLocaleString()}</p>
        <Link to={`/products/${product.id}`} className="product-card-btn">
          View Details
        </Link>
      </div>
    </div>
  )
}

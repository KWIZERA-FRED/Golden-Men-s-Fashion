import { Link } from 'react-router-dom'
import '../styles/ProductCard.css'

export default function ProductCard({ product }) {
  const imageSrc = product?.image_url || product?.image || '/placeholder.png'
  const price = Number(product?.price || 0)

  return (
    <article className="product-card">

      <div className="product-card-image-wrapper">
        <img
          src={imageSrc}
          alt={product?.name || 'Product image'}
          loading="lazy"
          className="product-card-image"
          onError={(e) => { e.target.src = '/placeholder.png' }}
        />
      </div>

      <div className="product-card-content">

        <div className="product-card-header">
          <h3 className="product-card-title">{product?.name}</h3>
          <span className="product-card-category">
            {product?.category || 'Uncategorized'}
          </span>
        </div>

        <div className="product-card-footer">
          <p className="product-card-price">
            RWF {price.toLocaleString()}
          </p>

          <Link
            to={`/products/${product?.product_id}`}
            className="product-card-button"
          >
            View Details
          </Link>
        </div>

      </div>
    </article>
  )
}
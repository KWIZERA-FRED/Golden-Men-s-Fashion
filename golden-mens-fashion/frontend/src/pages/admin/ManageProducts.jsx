import { useEffect, useState, useCallback } from 'react'
import useAuth from '../../context/useAuth'
import '../../styles/admin/admin.css'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const EMPTY_FORM = {
  name: '', description: '', price: '', stock: '', image_url: '',
  is_featured: false, is_active: true
}

const FIELDS = [
  { label: 'Name',      key: 'name',      type: 'text'   },
  { label: 'Price',     key: 'price',     type: 'number' },
  { label: 'Stock',     key: 'stock',     type: 'number' },
  { label: 'Image URL', key: 'image_url', type: 'text'   },
]

export default function ManageProducts() {
  const { token } = useAuth()

  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [search, setSearch]     = useState('')
  const [deleting, setDeleting] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API_URL}/products?per_page=100&include_inactive=true`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load products')
      const data = await res.json()
      setProducts(Array.isArray(data.products) ? data.products : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Auto-clear success message after 3s
  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => setSuccess(''), 3000)
    return () => clearTimeout(t)
  }, [success])

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name:        p.name,
      description: p.description || '',
      price:       p.price,
      stock:       p.stock,
      image_url:   p.image_url || '',
      is_featured: p.is_featured,
      is_active:   p.is_active
    })
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setError('')
  }

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      setError('Name and price are required')
      return
    }
    try {
      setSaving(true)
      setError('')

      const url    = editing ? `${API_URL}/products/${editing.product_id}` : `${API_URL}/products`
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) })
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Failed to save product')
      }

      setSuccess(editing ? 'Product updated' : 'Product created')
      closeModal()
      fetchProducts()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return
    setDeleting(productId)
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete')
      setProducts(prev => prev.filter(p => p.product_id !== productId))
      setSuccess('Product deleted')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  // Filter products based on search
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filtered.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Manage Products</h1>
          <p>{products.length} products total</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      {error   && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="table-section">
        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search products by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="table-info">
            <span>{filtered.length} / {products.length} records</span>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-inline">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No products found.</div>
        ) : (
          <div className="admin-table-wrapper">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map(p => (
                    <tr key={p.product_id}>
                      <td>#{p.product_id}</td>
                      <td>
                        <div className="product-name-cell">
                          {p.image_url && (
                            <img 
                              src={p.image_url} 
                              alt={p.name}
                              className="product-thumbnail"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td className="price-cell">RWF {Number(p.price).toLocaleString()}</td>
                      <td className={`stock-cell ${p.stock <= 5 ? 'low-stock' : ''}`}>
                        {p.stock}
                        {p.stock <= 5 && p.stock > 0 && <span className="stock-warning">⚠️</span>}
                        {p.stock === 0 && <span className="stock-out"> Out of stock</span>}
                      </td>
                      <td className="featured-cell">
                        {p.is_featured ? '⭐ Yes' : '—'}
                      </td>
                      <td>
                        <span className={`badge ${p.is_active ? 'badge-active' : 'badge-inactive'}`}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-cell">
                          <button className="btn-edit" onClick={() => openEdit(p)}>
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(p.product_id)}
                            disabled={deleting === p.product_id}
                          >
                            {deleting === p.product_id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="table-footer">
                <p>
                  Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} products
                </p>
                <div className="pagination">
                  <button 
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={currentPage === pageNum ? 'active-page' : ''}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button 
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>

            {error && <div className="admin-error">{error}</div>}

            {FIELDS.map(f => (
              <div className="modal-field" key={f.key}>
                <label>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setField(f.key, e.target.value)}
                  step={f.type === 'number' ? '1' : undefined}
                />
              </div>
            ))}

            <div className="modal-field">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                rows="4"
              />
            </div>

            <div className="modal-field">
              <label>Status</label>
              <select
                value={form.is_active ? 'active' : 'inactive'}
                onChange={e => setField('is_active', e.target.value === 'active')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="modal-field">
              <label>Featured Product</label>
              <select
                value={form.is_featured ? 'yes' : 'no'}
                onChange={e => setField('is_featured', e.target.value === 'yes')}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
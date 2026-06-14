import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Login.css'

const API_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default function Login() {
  const { login } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  // where user came from (important for protected routes)
  const from = location.state?.from?.pathname || '/products'

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      // normalize backend response safely
      const user = data.user || null
      const role = data.role || data.user?.role || 'user'
      const token = data.access_token || data.token

      if (!token) {
        throw new Error('Authentication token missing from server response')
      }

      // store via context (this also writes localStorage in your provider)
      login(user, role, token)

      // redirect user back to intended page
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-header">
          <div className="auth-icon">♛</div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your experience</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="input-group">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing you in...' : 'Login'}
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Don’t have an account?{' '}
            <Link className="auth-link" to="/register">Create one</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
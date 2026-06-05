import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import '../styles/Navbar.css'

export default function Navbar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <span className="logo-icon">♛</span>
          <span className="logo-text">Golden <span className="logo-accent">MF</span></span>
        </Link>

        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Shop</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {role === 'admin' && (
            <li><Link to="/admin" className="admin-link">Dashboard</Link></li>
          )}
        </ul>

        <div className="navbar-auth">
          {user ? (
            <div className="navbar-user">
              <span className="navbar-username">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <div className="navbar-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}

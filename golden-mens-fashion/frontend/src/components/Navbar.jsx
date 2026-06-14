import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../context/useAuth'
import '../styles/Navbar.css'

export default function Navbar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">♛</span>
          <span className="logo-text">
            Golden <span className="logo-accent">MF</span>
          </span>
        </Link>

        {/* LINKS */}
        <ul className="navbar-links">

          <li>
            <Link className={isActive('/') ? 'active-link' : ''} to="/">
              Home
            </Link>
          </li>

          <li>
            <Link className={isActive('/products') ? 'active-link' : ''} to="/products">
              Shop
            </Link>
          </li>

          <li>
            <Link className={isActive('/about') ? 'active-link' : ''} to="/about">
              About
            </Link>
          </li>

          <li>
            <Link className={isActive('/contact') ? 'active-link' : ''} to="/contact">
              Contact
            </Link>
          </li>

          {role === 'admin' && (
            <li>
              <Link className="admin-link" to="/admin">
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* AUTH SECTION */}
        <div className="navbar-auth">

          {user ? (
            <div className="navbar-user">
              <span className="navbar-username">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="btn-logout"
              >
                Logout
              </button>
            </div>

          ) : (
            <div className="navbar-buttons">
              <Link to="/login" className="btn-login">
                Login
              </Link>

              <Link to="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}

        </div>

      </div>
    </nav>
  )
}
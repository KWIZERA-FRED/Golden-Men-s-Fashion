import { Link } from 'react-router-dom'
import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <span className="footer-logo">♛ Golden MF</span>
          <p>Premium menswear for the bold African man.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Kigali, Rwanda</p>
          <p>info@goldenmf.com</p>
          <p>+250 700 000 000</p>
        </div>

      </div>
      <div className="footer-bottom">
        <p>© 2025 Golden Men's Fashion. All rights reserved.</p>
      </div>
    </footer>
  )
}

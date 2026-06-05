import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Register.css'

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }
    return newErrors
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Must be at least 8 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Must contain uppercase, lowercase & number'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms'
    return newErrors
  }

  const handleNext = (e) => {
    e.preventDefault()
    const validationErrors = validateStep1()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setStep(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateStep2()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    // Add your registration logic here
    console.log('Register:', formData)
    navigate('/login')
  }

  const passwordStrength = () => {
    const { password } = formData
    if (password.length === 0) return 0
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/(?=.*[a-z])(?=.*[A-Z])/.test(password)) strength += 25
    if (/(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) strength += 25
    return strength
  }

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-header">
          <div className="auth-icon">♛</div>
          <h1>Create Account</h1>
          <p>Join the exclusive club</p>
        </div>

        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'step-active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Personal</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'step-active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Security</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={step === 1 ? handleNext : handleSubmit}>
          {step === 1 ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={errors.firstName ? 'input-error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={errors.lastName ? 'input-error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={errors.email ? 'input-error' : ''}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <div className="input-wrapper">
                  <span className="input-icon">📞</span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+250 700 000 000"
                    className={errors.phone ? 'input-error' : ''}
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <button type="submit" className="btn-primary btn-full">
                Continue
                <span className="btn-arrow">→</span>
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={errors.password ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁' : '👁‍🗨'}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
                
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-fill strength-${passwordStrength()}`} 
                      style={{ width: `${passwordStrength()}%` }}
                    ></div>
                  </div>
                  <span className="strength-label">
                    {passwordStrength() <= 25 && 'Weak'}
                    {passwordStrength() > 25 && passwordStrength() <= 50 && 'Fair'}
                    {passwordStrength() > 50 && passwordStrength() <= 75 && 'Good'}
                    {passwordStrength() > 75 && 'Strong'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'input-error' : ''}
                  />
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <span>I agree to the <Link to="/terms" className="auth-link">Terms of Service</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link></span>
                </label>
                {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
              </div>

              <div className="step-buttons">
                <button 
                  type="button" 
                  className="btn-back"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button type="submit" className="btn-primary btn-full">
                  Create Account
                </button>
              </div>
            </>
          )}
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
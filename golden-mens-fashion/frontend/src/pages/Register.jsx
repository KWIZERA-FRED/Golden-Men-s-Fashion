import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Register.css'

export default function Register() {
  const navigate = useNavigate()

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
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const API_URL = "http://localhost:5000/api/auth/register";

  // -------------------------
  // HANDLE INPUT CHANGE
  // -------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // clear field error on typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  // -------------------------
  // VALIDATION STEP 1
  // -------------------------
  const validateStep1 = () => {
    const err = {}

    if (!formData.firstName.trim()) err.firstName = "First name is required"
    if (!formData.lastName.trim()) err.lastName = "Last name is required"

    if (!formData.email.trim()) err.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = "Invalid email format"

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      err.phone = "Invalid phone number"
    }

    return err
  }

  // -------------------------
  // VALIDATION STEP 2
  // -------------------------
  const validateStep2 = () => {
    const err = {}

    if (!formData.password) err.password = "Password is required"
    else if (formData.password.length < 8) err.password = "Minimum 8 characters"

    if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      err.agreeTerms = "You must accept terms"
    }

    return err
  }

  // -------------------------
  // NEXT STEP
  // -------------------------
  const handleNext = (e) => {
    e.preventDefault()

    const validation = validateStep1()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setStep(2)
  }

  // -------------------------
  // SUBMIT TO FLASK API
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateStep2()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
        role: "user"
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Registration failed")
      }

      navigate('/login')

    } catch (error) {
      setErrors({ api: error.message })
    } finally {
      setLoading(false)
    }
  }

  // -------------------------
  // PASSWORD STRENGTH
  // -------------------------
  const passwordStrength = () => {
    const p = formData.password
    let score = 0

    if (p.length >= 8) score += 25
    if (p.length >= 12) score += 25
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score += 25
    if (/\d/.test(p) && /[!@#$%^&*]/.test(p)) score += 25

    return score
  }

  // -------------------------
  // UI LABEL
  // -------------------------
  const getStrengthLabel = (score) => {
    if (score <= 25) return "Weak"
    if (score <= 50) return "Fair"
    if (score <= 75) return "Good"
    return "Strong"
  }

  return (
    <div className="auth-page">
      <div className="auth-container register-container">

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the platform</p>
        </div>

        {errors.api && <p className="error-message">{errors.api}</p>}

        {/* STEP INDICATOR */}
        <div className="step-indicator">
          <span className={step === 1 ? "active" : ""}>1. Info</span>
          <span className={step === 2 ? "active" : ""}>2. Security</span>
        </div>

        <form onSubmit={step === 1 ? handleNext : handleSubmit}>

          {/* ---------------- STEP 1 ---------------- */}
          {step === 1 && (
            <>
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <span>{errors.firstName}</span>

              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <span>{errors.lastName}</span>

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <span>{errors.email}</span>

              <input
                name="phone"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={handleChange}
              />
              <span>{errors.phone}</span>

              <button type="submit">Continue</button>
            </>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 2 && (
            <>
              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {/* {showPassword ? "🙈" : "👁"} */}
                </button>
              </div>
              <span>{errors.password}</span>

              {/* Strength */}
              <div className="strength">
                <div
                  className="bar"
                  style={{ width: `${passwordStrength()}%` }}
                />
                <small>{getStrengthLabel(passwordStrength())}</small>
              </div>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span>{errors.confirmPassword}</span>

              <label>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                I agree to the{" "}
                <Link to="/terms">Terms</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
              <span>{errors.agreeTerms}</span>

              <div className="buttons">
                <button type="button" onClick={() => setStep(1)}>
                  Back
                </button>

                <button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </>
          )}

        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  )
}
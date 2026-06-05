import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    // Add your contact form submission logic here
    console.log('Contact form:', formData)
    setSubmitted(true)
  }

  const contactInfo = [
    { icon: '📍', title: 'Visit Us', lines: ['KG 123 Street, Kigali', 'Rwanda, East Africa'] },
    { icon: '📞', title: 'Call Us', lines: ['+250 788 000 000', 'Mon-Sat, 9AM-7PM'] },
    { icon: '✉', title: 'Email Us', lines: ['info@dapper.rw', 'support@dapper.rw'] },
    { icon: '🕐', title: 'Business Hours', lines: ['Monday - Saturday', '9:00 AM - 7:00 PM'] },
  ]

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="contact-success">
          <div className="success-icon">✓</div>
          <h1>Message Sent!</h1>
          <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="section-container">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Our team is always here to help.</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="section-container">
          <div className="contact-grid">
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={errors.name ? 'input-error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+250 700 000 000"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? 'input-error' : ''}
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="return">Returns & Exchange</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className={errors.message ? 'input-error' : ''}
                  ></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button type="submit" className="btn-primary btn-full">
                  Send Message ✉
                </button>
              </form>
            </div>

            <div className="contact-info-section">
              <h2>Contact Information</h2>
              <div className="info-cards">
                {contactInfo.map((info, index) => (
                  <div key={index} className="info-card">
                    <span className="info-icon">{info.icon}</span>
                    <div className="info-content">
                      <h3>{info.title}</h3>
                      {info.lines.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-map">
                <div className="map-placeholder">
                  <span>📍</span>
                  <p>KG 123 Street, Kigali, Rwanda</p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary btn-small"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-faq">
        <div className="section-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {[
              { q: 'What are your delivery times?', a: 'We deliver within Kigali in 1-2 business days, and nationwide within 3-5 business days.' },
              { q: 'How can I track my order?', a: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS.' },
              { q: 'What is your return policy?', a: 'We offer 30-day returns for unworn items with original tags. Free returns on orders over RWF 50,000.' },
              { q: 'Do you offer alterations?', a: 'Yes! We provide complimentary basic alterations on all suits purchased from us.' },
            ].map((faq, index) => (
              <details key={index} className="faq-item">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
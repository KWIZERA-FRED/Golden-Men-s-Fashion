import { Link } from 'react-router-dom'
import '../styles/AboutUs.css'

const teamMembers = [
  { name: 'Jean de Dieu', role: 'Founder & CEO', initials: 'JD' },
  { name: 'Alice Mukamana', role: 'Head of Design', initials: 'AM' },
  { name: 'Eric Habimana', role: 'Master Tailor', initials: 'EH' },
  { name: 'Grace Keza', role: 'Customer Experience', initials: 'GK' },
]

const milestones = [
  { year: '2019', title: 'The Beginning', description: 'Started as a small tailoring shop in Kigali with a vision to redefine menswear in Rwanda.' },
  { year: '2020', title: 'Going Digital', description: 'Launched our online store, making premium fashion accessible across the country.' },
  { year: '2022', title: '1000+ Customers', description: 'Reached a milestone of serving over 1,000 satisfied gentlemen.' },
  { year: '2024', title: 'Expansion', description: 'Opened our flagship showroom and introduced bespoke tailoring services.' },
  { year: '2025', title: 'New Horizon', description: 'Launching new collections and partnerships with international designers.' },
]

const values = [
  { icon: '👔', title: 'Quality Craftsmanship', description: 'Every piece is crafted with attention to detail, using premium fabrics and time-honored techniques.' },
  { icon: '🌍', title: 'African Pride', description: 'We celebrate Rwandan and African heritage through modern, sophisticated designs.' },
  { icon: '🤝', title: 'Customer First', description: 'Your satisfaction is our priority. From fitting to delivery, we ensure a seamless experience.' },
  { icon: '♻️', title: 'Sustainable Fashion', description: 'We embrace ethical production practices and sustainable materials.' },
]

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="section-container">
          <div className="about-hero-content">
            <p className="about-tag">Our Story</p>
            <h1>Crafting Confidence Since 2019</h1>
            <p className="about-hero-text">
              Dapper was born from a simple belief: every man deserves to look and feel his best. 
              What started as a passion for fine tailoring has grown into Rwanda's premier destination for 
              sophisticated menswear.
            </p>
            <Link to="/products" className="btn-primary">Explore Our Collection</Link>
          </div>
          <div className="about-hero-stats">
            <div className="stat-card">
              <span className="stat-number">5+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">2000+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">500+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission">
        <div className="section-container">
          <div className="mission-grid">
            <div className="mission-card">
              <span className="mission-icon">🎯</span>
              <h2>Our Mission</h2>
              <p>To provide modern gentlemen with premium, well-fitted clothing that empowers them to make lasting impressions in every room they walk into.</p>
            </div>
            <div className="mission-card">
              <span className="mission-icon">🔭</span>
              <h2>Our Vision</h2>
              <p>To become East Africa's most trusted menswear brand, setting the standard for quality, style, and customer service across the continent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="about-values">
        <div className="section-container">
          <h2 className="section-title">What We Stand For</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <span className="value-icon">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="about-story">
        <div className="section-container">
          <h2 className="section-title">Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content">
                  <span className="timeline-year">{milestone.year}</span>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="section-container">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="team-subtitle">Passionate people dedicated to your style</p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <span>{member.initials}</span>
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="section-container">
          <h2>Ready to Elevate Your Style?</h2>
          <p>Join 2,000+ gentlemen who trust Dapper for their wardrobe.</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
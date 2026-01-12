import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleViewProjects = () => {
    navigate('/projects');
  };

  const handleGetInTouch = () => {
    navigate('/contact');
  };

  return (
    <div className="page">
      <section className="hero" style={{
        background: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop") center/cover no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Architectural Real Estate Development</h1>
          <p className="hero-subtitle">Creating extraordinary spaces that blend innovation, sustainability, and timeless elegance for modern living.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleViewProjects}>View Our Projects</button>
            <button className="btn-secondary" onClick={handleGetInTouch}>Get In Touch</button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-content">
          <h2 className="section-title">Our Expertise</h2>
          <div className="grid-3">
            <div className="card">
              <div className="card-icon">🏠</div>
              <h3 className="card-title">Residential Design</h3>
              <p>Crafting beautiful homes that combine comfort, style, and functionality for modern families.</p>
            </div>
            <div className="card">
              <div className="card-icon">🏢</div>
              <h3 className="card-title">Commercial Spaces</h3>
              <p>Designing functional commercial environments that inspire productivity and reflect brand identity.</p>
            </div>
            <div className="card">
              <div className="card-icon">✨</div>
              <h3 className="card-title">Luxury Developments</h3>
              <p>Creating exclusive properties with premium finishes and unparalleled attention to detail.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-content">
          <h2 className="section-title">Featured Projects</h2>
          <div className="featured-projects">
            <div className="featured-item">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop" alt="Modern Villa" className="featured-image" />
              <div className="featured-content">
                <h3>Luxury Modern Villa</h3>
                <p>Contemporary design meets Mediterranean charm in this stunning hillside residence.</p>
                <span className="featured-tag">Completed 2023</span>
              </div>
            </div>
            <div className="featured-item">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop" alt="Commercial Tower" className="featured-image" />
              <div className="featured-content">
                <h3>Urban Commercial Complex</h3>
                <p>Mixed-use development featuring retail, office spaces, and residential units.</p>
                <span className="featured-tag">Ongoing Project</span>
              </div>
            </div>
            <div className="featured-item">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop" alt="Residential Complex" className="featured-image" />
              <div className="featured-content">
                <h3>Eco-Friendly Apartments</h3>
                <p>Sustainable living spaces with green architecture and smart home technology.</p>
                <span className="featured-tag">Completed 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-content">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-cta" style={{
        background: 'url("https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=1920&h=800&fit=crop") center/cover no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="cta-overlay"></div>
        <div className="section-content">
          <h2 className="section-title">Ready to Start Your Project?</h2>
          <p className="cta-text">Let's discuss your vision and bring it to life with our expert architectural services.</p>
          <button className="btn-primary">Contact Us Today</button>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Office Address',
      details: '123 Architecture Avenue\nDesign District, NY 10001\nUnited States'
    },
    {
      icon: '📞',
      title: 'Phone Number',
      details: '+1 (555) 123-4567\n+1 (555) 765-4321'
    },
    {
      icon: '✉️',
      title: 'Email Address',
      details: 'info@realestatedev.com\nprojects@realestatedev.com'
    },
    {
      icon: '🕒',
      title: 'Business Hours',
      details: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed'
    }
  ];

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero" style={{
        background: 'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=600&fit=crop") center/cover no-repeat',
        backgroundAttachment: 'fixed',
        padding: '6rem 0'
      }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Get In Touch</h1>
          <p className="hero-subtitle">
            Ready to bring your architectural vision to life? Let's discuss your project and create something extraordinary together.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="section-content">
          <h2 className="section-title">Contact Information</h2>
          <div className="contact-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-card">
                <div className="contact-icon">{info.icon}</div>
                <h3 className="contact-title">{info.title}</h3>
                <p className="contact-details">{info.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section section-alt">
        <div className="section-content">
          <div className="contact-form-container">
            <div className="form-intro">
              <h2 className="section-title" style={{marginBottom: '1rem'}}>Send Us a Message</h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
                We're excited to hear about your project and discuss how we can help bring your vision to life.
              </p>
            </div>
            <div className="form-wrapper">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="residential">Residential Project</option>
                      <option value="commercial">Commercial Project</option>
                      <option value="consultation">Consultation</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Project Details *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="form-textarea"
                    placeholder="Tell us about your project, timeline, budget, and any specific requirements..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="form-submit-btn"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section">
        <div className="section-content">
          <h2 className="section-title">Visit Our Office</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-icon">📍</div>
              <h3>Our Location</h3>
              <p>123 Architecture Avenue, Design District</p>
              <p>New York, NY 10001</p>
              <p className="map-note">* Interactive map would be embedded here</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

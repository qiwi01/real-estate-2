import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: '🏗️',
      title: 'Architectural Design',
      description: 'Innovative and sustainable architectural solutions tailored to your vision and requirements.'
    },
    {
      icon: '🏢',
      title: 'Commercial Development',
      description: 'Full-service commercial property development from concept to completion.'
    },
    {
      icon: '🏠',
      title: 'Residential Projects',
      description: 'Luxury residential developments combining modern design with functional living spaces.'
    },
    {
      icon: '🌱',
      title: 'Sustainable Solutions',
      description: 'Green building practices and eco-friendly materials for environmentally conscious development.'
    },
    {
      icon: '📋',
      title: 'Project Management',
      description: 'Comprehensive project management ensuring timely delivery and quality control.'
    },
    {
      icon: '🤝',
      title: 'Consultation Services',
      description: 'Expert consultation and feasibility studies for your real estate development needs.'
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2>Our Services</h2>
        <p className="services-intro">
          We offer comprehensive architectural and real estate development services to bring your vision to life
        </p>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
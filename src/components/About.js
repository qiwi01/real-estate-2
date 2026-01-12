import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2>About Us</h2>
        <div className="about-content">
          <div className="about-text">
            <p>With over 15 years of experience in architectural real estate development, we specialize in transforming visions into reality. Our team combines cutting-edge design principles with sustainable building practices to create exceptional properties that stand the test of time.</p>
            <p>We believe in the power of architecture to shape communities and enhance quality of life. From residential complexes to commercial developments, every project reflects our commitment to excellence and innovation.</p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="About Us" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
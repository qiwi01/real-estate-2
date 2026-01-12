import React from 'react';
import './Hero.css';

const Hero = () => {
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h2>Excellence in Architectural Real Estate Development</h2>
        <p>Creating visionary spaces that blend innovation, sustainability, and timeless design.</p>
        <button className="btn" onClick={scrollToProjects}>View Our Projects</button>
      </div>
    </section>
  );
};

export default Hero;
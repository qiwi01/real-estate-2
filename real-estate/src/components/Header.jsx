import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>Real Estate Dev</Link>

        {/* Desktop Navigation */}
        <ul className="nav-list desktop-nav">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/projects" className="nav-link">Projects</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list mobile-nav-list">
            <li><Link to="/" className="nav-link" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/projects" className="nav-link" onClick={closeMenu}>Projects</Link></li>
            <li><Link to="/about" className="nav-link" onClick={closeMenu}>About</Link></li>
            <li><Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Header;

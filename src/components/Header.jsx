import React, { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header>
      <div className="nav">
        <a href="#home" className="brand">
          <img src="/logo.png" alt="Viridis Green Concept Logo" />
          <span>Viridis</span>
        </a>
        
        <nav className="links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#solutions">Solutions</a>
          <a href="#partners">Partners</a>
          <a href="#contact">Contact</a>
        </nav>

        <a href="#products" className="btn btn-primary header-cta">Explore Products</a>
        
        <button 
          className="menu-toggle" 
          aria-label="Toggle Menu" 
          onClick={toggleMenu}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <a href="#home" onClick={toggleMenu}>Home</a>
        <a href="#about" onClick={toggleMenu}>About</a>
        <a href="#products" onClick={toggleMenu}>Products</a>
        <a href="#solutions" onClick={toggleMenu}>Solutions</a>
        <a href="#partners" onClick={toggleMenu}>Partners</a>
        <a href="#contact" onClick={toggleMenu}>Contact</a>
        <a href="#products" className="btn btn-primary" onClick={toggleMenu} style={{ justifyContent: 'center' }}>
          Explore Products
        </a>
      </div>
    </header>
  );
}

import React from 'react';
import TechCanvas from './TechCanvas';

export default function Hero() {
  return (
    <section className="hero" id="home">
      {/* Premium Background Image with Ken Burns animation and filmic noise */}
      <div className="hero-bg-container">
        <img src="/hero_bg.png" alt="Viridis Tech Background" className="hero-bg-image" />
        <div className="hero-overlay"></div>
        <div className="hero-grid-bg"></div>
        <div className="hero-noise-overlay"></div>
      </div>

      {/* Modern Fluid Mesh Aurora Glows (2026 Tech Aesthetic) */}
      <div className="hero-fluid-glows">
        <div className="fluid-blob fluid-blob-1"></div>
        <div className="fluid-blob fluid-blob-2"></div>
        <div className="fluid-blob fluid-blob-3"></div>
      </div>

      {/* Interactive 60fps Constellation Canvas */}
      <TechCanvas />

      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow" style={{ color: 'var(--leaf-2)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '11px', fontWeight: '700' }}>Viridis Green Concept</div>
          <h1>Building digital products that power <em>finance</em>, communication & purpose</h1>
          <p className="lead">
            Viridis Green Concept is a technology company developing scalable digital products — fintech operations, mail services, SaaS tools, and faith-based conversational engines — engineered for trust, security, and growth.
          </p>
          <div className="hero-ctas">
            <a href="#products" className="btn btn-primary" style={{ boxShadow: '0 8px 24px -6px rgba(31, 168, 102, 0.4)' }}>Explore Our Products</a>
            <a href="#partners" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)' }} onMouseOver={(e) => { e.target.style.background = 'var(--forest)'; e.target.style.borderColor = 'var(--forest)'; }} onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.02)'; e.target.style.borderColor = 'rgba(255,255,255,0.4)'; }}>Partner With Viridis</a>
          </div>
        </div>
        <div className="vein-wrap" aria-hidden="true" style={{ zIndex: 2 }}>
          <svg className="vein-svg" viewBox="0 0 320 420">
            <path className="vein-line" d="M160 380 L160 240 L210 190" pathLength="600" style={{ stroke: '#ffffff' }}/>
            <path className="vein-line alt" d="M160 300 L110 250" pathLength="400" style={{ stroke: 'var(--leaf-2)' }}/>
            <path className="vein-line alt" d="M180 260 L230 230" pathLength="400" style={{ animationDelay: '1.1s', stroke: 'var(--leaf-2)' }}/>
            <circle className="vein-node" cx="210" cy="190" r="10" style={{ animationDelay: '2.5s', stroke: '#ffffff' }}/>
            <circle className="vein-node alt" cx="110" cy="250" r="7" style={{ animationDelay: '1.7s', stroke: 'var(--leaf-2)' }}/>
            <circle className="vein-node alt" cx="230" cy="230" r="7" style={{ animationDelay: '2s', stroke: 'var(--leaf-2)' }}/>
            <circle className="vein-node" cx="160" cy="380" r="6" style={{ animationDelay: '0.5s', stroke: '#ffffff' }}/>
          </svg>
        </div>
      </div>
    </section>
  );
}

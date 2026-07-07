import React from 'react';

export default function Footer({ onOpenPrivacy, onOpenTerms }) {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-brand">
              <img src="/logo.png" alt="Viridis Green Concept Logo" />
              <span>Viridis</span>
            </div>
            <p className="tag">Building scalable digital products for finance, communication, and purpose.</p>
            
            {/* Techy Contact Info Block */}
            <div className="contact-info-block" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="contact-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', color: 'var(--leaf-1)' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>16, Ninuola Street, Magodo Brooks, CMD Road, Ikeja Lagos, Nigeria</span>
              </div>
              
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--leaf-1)' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:support@viridisgreenconcept.com" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>support@viridisgreenconcept.com</a>
              </div>
              
              {/* Techy Social and WhatsApp Chips */}
              <div className="contact-socials-group" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                <a 
                  href="https://wa.me/2348188882546" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-chip whatsapp"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.381 9.805-9.782.001-2.592-1.01-5.031-2.846-6.87C16.4 2.113 13.962 1.1 11.378 1.1 5.975 1.1 1.574 5.482 1.572 10.883c-.001 1.53.412 3.01 1.196 4.364l-.933 3.413 3.512-.92c1.3.778 2.684 1.189 4.3 1.194z" />
                  </svg>
                  <span>WhatsApp 1</span>
                </a>
                
                <a 
                  href="https://wa.me/2348122503754" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-chip whatsapp"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.381 9.805-9.782.001-2.592-1.01-5.031-2.846-6.87C16.4 2.113 13.962 1.1 11.378 1.1 5.975 1.1 1.574 5.482 1.572 10.883c-.001 1.53.412 3.01 1.196 4.364l-.933 3.413 3.512-.92c1.3.778 2.684 1.189 4.3 1.194z" />
                  </svg>
                  <span>WhatsApp 2</span>
                </a>

                <a 
                  href="https://linkedin.com/company/viridis-green-concept" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-chip linkedin"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          <div>
            <h5>Products</h5>
            <ul>
              <li><a href="#products">Buyby</a></li>
              <li><a href="#products">TMail</a></li>
              <li><a href="#products">Eleven</a></li>
              <li><a href="#products">Stelloo</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#partners">Partners</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul>
              <li><button onClick={onOpenPrivacy} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', fontSize: '14.5px', cursor: 'pointer', textAlign: 'left', padding: '0', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--leaf-2)'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.65)'}>Privacy Policy</button></li>
              <li><button onClick={onOpenTerms} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', fontSize: '14.5px', cursor: 'pointer', textAlign: 'left', padding: '0', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--leaf-2)'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.65)'}>Terms of Service</button></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Viridis Green Concept. All rights reserved.</span>
          <span>Lagos · Nigeria</span>
        </div>
      </div>
    </footer>
  );
}

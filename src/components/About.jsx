import React from 'react';

export default function About() {
  return (
    <section id="about">
      <div className="wrap about-grid reveal in">
        <div>
          <div className="eyebrow" style={{ color: 'var(--leaf-1)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '11px', fontWeight: '700' }}>About Us</div>
          <h2 style={{ fontSize: '38px', marginTop: '16px' }}>The parent company behind a growing family of digital products</h2>
          
          {/* Founder Signature Bubble */}
          <div className="founder-bubble" style={{
            marginTop: '32px',
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(11, 61, 46, 0.04)'
          }}>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.65',
              color: 'var(--ink)',
              margin: '0 0 16px 0',
              fontStyle: 'italic'
            }}>
              "Welcome to Viridis Green Concept, where bold ideas become intelligent digital solutions. We build innovative platforms in fintech, AI, communication, and SaaS that solve real-world challenges. Discover our growing ecosystem, including BuyBy, TMail, Stelloo and Eleven, designed for security, scalability, and impact. Together, we're shaping the future of technology for Africa and beyond."
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <strong style={{ color: 'var(--forest-deep)', fontSize: '14px' }}>Akinlara Babalola</strong>
              <span style={{ color: 'var(--ink-soft)', fontSize: '12px' }}>President & Founder</span>
            </div>
          </div>
        </div>
        <div>
          <p>
            Viridis Green Concept is a technology company building intelligent digital assets across fintech, communication, productivity, and purposeful living. We design products that solve real, everyday friction — moving money, sending mail, and supporting reflection — with the discipline of enterprise software and the warmth of human-centred design.
          </p>
          <p style={{ marginBottom: '32px' }}>
            Our mission is to build trustworthy digital infrastructure for African markets and beyond. Our vision is a connected ecosystem of tools that work quietly and well, so the people who use them can focus on what matters.
          </p>
          <div className="values-grid">
            {/* Trust Card */}
            <div className="value-card">
              <div className="card-glow"></div>
              <div className="icon-container">
                <svg className="value-icon icon-trust" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle className="pulse-ring ring-1" cx="12" cy="12" r="3.5" />
                  <circle className="pulse-ring ring-2" cx="12" cy="12" r="6.5" />
                </svg>
              </div>
              <h4>Trust</h4>
              <p>Security-first engineering, transparent by default.</p>
            </div>

            {/* Simplicity Card */}
            <div className="value-card">
              <div className="card-glow"></div>
              <div className="icon-container">
                <svg className="value-icon icon-simplicity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path className="simpl-path path-1" d="M3 12c0-3.3 2.7-6 6-6s6 6 12 6" />
                  <path className="simpl-path path-2" d="M21 12c0 3.3-2.7 6-6 6s-6-6-12-6" />
                </svg>
              </div>
              <h4>Simplicity</h4>
              <p>Fewer steps, clearer outcomes, every time.</p>
            </div>

            {/* Purpose Card */}
            <div className="value-card">
              <div className="card-glow"></div>
              <div className="icon-container">
                <svg className="value-icon icon-purpose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" />
                  <circle className="target-center" cx="12" cy="12" r="2.5" fill="currentColor" />
                  <line x1="12" y1="2" x2="12" y2="22" className="crosshair vertical" />
                  <line x1="2" y1="12" x2="22" y2="12" className="crosshair horizontal" />
                </svg>
              </div>
              <h4>Purpose</h4>
              <p>Tools built for real human needs, not novelty.</p>
            </div>

            {/* Scale Card */}
            <div className="value-card">
              <div className="card-glow"></div>
              <div className="icon-container">
                <svg className="value-icon icon-scale" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect className="cube-face outer" x="4" y="4" width="16" height="16" rx="2" />
                  <rect className="cube-face inner" x="9" y="9" width="6" height="6" rx="1.5" />
                  <line x1="4" y1="4" x2="9" y2="9" className="cube-edge" />
                  <line x1="20" y1="4" x2="15" y2="9" className="cube-edge" />
                  <line x1="4" y1="20" x2="9" y2="15" className="cube-edge" />
                  <line x1="20" y1="20" x2="15" y2="15" className="cube-edge" />
                </svg>
              </div>
              <h4>Scale</h4>
              <p>Architecture designed to grow with our users.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

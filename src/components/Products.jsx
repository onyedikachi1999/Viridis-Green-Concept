import React from 'react';

export default function Products({ onAction }) {
  const products = [
    {
      id: 'buyby',
      tag: 'SaaS / Fintech Operations',
      title: 'Buyby',
      desc: 'A financial operation and transaction-support platform enabling secure digital payment workflows, transaction initiation, reconciliation, and business payment coordination.',
      actions: [
        { label: 'Learn More', type: 'primary', action: 'learn_buyby' },
        { label: 'Join Waitlist', type: 'ghost', action: 'waitlist_buyby' },
        { label: 'Request Demo', type: 'ghost', action: 'demo_buyby' }
      ],
      visualizer: (
        <svg width="64" height="64" viewBox="0 0 60 60" fill="none" stroke="currentColor" style={{ color: 'var(--leaf-1)' }}>
          <circle cx="30" cy="30" r="24" stroke="rgba(31, 168, 102, 0.15)" strokeWidth="1" />
          <circle cx="30" cy="30" r="18" stroke="rgba(126, 217, 87, 0.3)" strokeWidth="1.5" strokeDasharray="12 8" className="ledger-ring" />
          <rect x="21" y="21" width="18" height="18" rx="3" stroke="var(--leaf-1)" strokeWidth="2.5" className="vault-core" />
          <circle cx="30" cy="30" r="3.5" fill="var(--leaf-2)" />
          <line x1="30" y1="30" x2="30" y2="24" stroke="var(--leaf-2)" strokeWidth="2" strokeLinecap="round" className="dial-handle" />
          <line x1="30" y1="30" x2="34.5" y2="30" stroke="var(--leaf-2)" strokeWidth="2" strokeLinecap="round" className="dial-handle" />
        </svg>
      )
    },
    {
      id: 'tmail',
      tag: 'Mail / Communication',
      title: 'TMail',
      desc: 'A fast, simple, and privacy-conscious mail service designed for temporary, secure, and convenient digital communication.',
      actions: [
        { label: 'Launch TMail', type: 'primary', action: 'launch_tmail' },
        { label: 'Learn More', type: 'ghost', action: 'learn_tmail' }
      ],
      visualizer: (
        <svg width="64" height="64" viewBox="0 0 60 60" fill="none" stroke="currentColor" style={{ color: 'var(--leaf-1)' }}>
          <rect x="13" y="19" width="34" height="22" rx="3" stroke="var(--leaf-1)" strokeWidth="2.5" />
          <path d="M13 21 L30 32 L47 21" stroke="var(--leaf-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30" cy="30" r="26" stroke="rgba(126, 217, 87, 0.25)" strokeWidth="1.2" />
          <circle cx="30" cy="30" r="26" stroke="var(--leaf-2)" strokeWidth="2" strokeDasharray="35 125" className="clock-hand" />
          <circle cx="30" cy="4" r="2.5" fill="var(--leaf-2)" />
        </svg>
      )
    },
    {
      id: 'eleven',
      tag: 'Faith-Based Chat Engine',
      title: 'Eleven',
      desc: 'A faith-centered conversational engine supporting spiritual reflection, guided biblical engagement, prayer support, and purpose-driven interaction.',
      actions: [
        { label: 'Explore Eleven', type: 'primary', action: 'explore_eleven' },
        { label: 'Join Waitlist', type: 'ghost', action: 'waitlist_eleven' }
      ],
      visualizer: (
        <svg width="64" height="64" viewBox="0 0 60 60" fill="none" stroke="currentColor" style={{ color: 'var(--leaf-1)' }}>
          <circle cx="30" cy="30" r="24" stroke="rgba(31, 168, 102, 0.15)" strokeWidth="1" />
          <path d="M30 7 Q41 30 30 53 Q19 30 30 7 Z" stroke="var(--leaf-1)" strokeWidth="2.2" strokeLinejoin="round" className="faith-leaf" />
          <circle cx="30" cy="30" r="4.5" fill="var(--leaf-2)" className="pulse-center" />
          <circle cx="30" cy="30" r="14" stroke="rgba(126,217,87,0.18)" strokeWidth="1.5" className="expanding-wave" />
          <circle cx="30" cy="30" r="20" stroke="rgba(126,217,87,0.1)" strokeWidth="1" className="expanding-wave-slow" />
        </svg>
      )
    },
    {
      id: 'stelloo',
      tag: 'Logistics / On-Demand Services',
      title: 'Stelloo',
      desc: 'An on-demand laundry operations and logistics platform connecting clients, local service providers, and pickup/delivery runners.',
      actions: [
        { label: 'Learn More', type: 'primary', action: 'learn_stelloo' },
        { label: 'Join Waitlist', type: 'ghost', action: 'waitlist_stelloo' }
      ],
      visualizer: (
        <svg width="64" height="64" viewBox="0 0 60 60" fill="none" stroke="currentColor" style={{ color: 'var(--leaf-1)' }}>
          <circle cx="30" cy="30" r="24" stroke="rgba(31, 168, 102, 0.15)" strokeWidth="1" />
          {/* Washing drum ring rotating */}
          <circle cx="30" cy="30" r="18" stroke="rgba(126, 217, 87, 0.3)" strokeWidth="1.5" strokeDasharray="6 14" className="laundry-drum" />
          {/* Central clothing hanger */}
          <path d="M22 36 L25 28 L30 25 L35 28 L38 36 Z" stroke="var(--leaf-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stelloo-hanger" />
          <path d="M30 25 C30 21, 33 21, 33 23" stroke="var(--leaf-1)" strokeWidth="2.2" strokeLinecap="round" />
          {/* Delivery runner bubble indicator */}
          <circle cx="48" cy="30" r="3" fill="var(--leaf-2)" className="delivery-node" />
        </svg>
      )
    }
  ];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section id="products" style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <div className="section-head reveal in">
          <div className="eyebrow">Our Products</div>
          <h2>Four products. One growing ecosystem.</h2>
          <p>Each Viridis product solves a distinct problem — together, they form the foundation of a connected digital life.</p>
        </div>
        
        <div className="products-grid">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="pcard pcard-spotlight reveal in"
              onMouseMove={handleMouseMove}
            >
              {/* Product Visualizer Icon */}
              <div className="product-visual-frame" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-start' }}>
                {p.visualizer}
              </div>

              <div className="tag">{p.tag}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              
              <div className="actions" style={{ marginTop: 'auto' }}>
                {p.actions.map((act, index) => (
                  <button
                    key={index}
                    className={`btn btn-${act.type}`}
                    onClick={() => onAction(act.action, p.title)}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

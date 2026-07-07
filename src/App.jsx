import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Solutions from './components/Solutions';
import Forms from './components/Forms';
import Footer from './components/Footer';
import { PrivacyModal, TermsModal, ProductModal } from './components/LegalModals';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [activeModal, setActiveModal] = useState(null); // null, 'privacy', 'terms', 'product_action'
  const [productModalType, setProductModalType] = useState(''); // e.g. 'waitlist_buyby', 'learn_buyby'
  const [modalProduct, setModalProduct] = useState(''); // e.g. 'Buyby'
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (currentPath.toLowerCase() === '/admin') {
    return <AdminDashboard onClose={() => { window.location.href = '/'; }} />;
  }

  // Handle toast notifications
  const triggerToast = (message) => {
    setToast({ visible: true, message });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Handle product action triggers
  const handleProductAction = (action, title) => {
    if (action.startsWith('waitlist') || action.startsWith('demo') || action.startsWith('learn') || action.startsWith('launch') || action.startsWith('explore')) {
      setProductModalType(action);
      setModalProduct(title);
      setActiveModal('product_action');
    }
  };

  return (
    <>
      <Header />
      <Hero />
      <About />
      <Products onAction={handleProductAction} />
      
      {/* Why Viridis Section */}
      <section className="why-wrap">
        <div className="wrap">
          <div className="section-head reveal in">
            <div className="eyebrow">Why Viridis</div>
            <h2>Engineered like infrastructure, designed like a product you'd choose</h2>
          </div>
          <div className="why-grid">
            <div className="why-item reveal in">
              <div className="num">01</div>
              <h4>Innovation</h4>
              <p>Building ahead of the curve across fintech, communication, and faith-tech.</p>
            </div>
            <div className="why-item reveal in">
              <div className="num">02</div>
              <h4>Trust</h4>
              <p>Every product engineered with security and reliability as defaults.</p>
            </div>
            <div className="why-item reveal in">
              <div className="num">03</div>
              <h4>Security</h4>
              <p>Data protection and privacy embedded into every workflow.</p>
            </div>
            <div className="why-item reveal in">
              <div className="num">04</div>
              <h4>Scalable Assets</h4>
              <p>Architecture built to serve thousands today, millions tomorrow.</p>
            </div>
          </div>
        </div>
      </section>

      <Solutions />
      <Forms onToast={triggerToast} />

      {/* CTA Band Section */}
      <section>
        <div className="wrap reveal in">
          <div className="cta-band">
            <div>
              <h3>Ready to join the waitlist?</h3>
              <p>Be the first to access Buyby, TMail, and Eleven as they roll out.</p>
            </div>
            <div className="ctas">
              <button 
                className="btn" 
                style={{ background: '#fff', color: 'var(--forest-deep)', borderColor: '#fff' }}
                onClick={() => handleProductAction('waitlist_buyby', 'Buyby')}
              >
                Join Waitlist
              </button>
              <a href="#partners" className="btn" style={{ borderColor: 'rgba(255, 255, 255, 0.5)', color: '#fff' }}>
                Partner With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer 
        onOpenPrivacy={() => setActiveModal('privacy')}
        onOpenTerms={() => setActiveModal('terms')}
      />

      {/* MODALS */}
      {activeModal === 'privacy' && (
        <PrivacyModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'terms' && (
        <TermsModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'product_action' && (
        <ProductModal 
          type={productModalType} 
          productName={modalProduct} 
          onClose={() => setActiveModal(null)} 
          onToast={triggerToast}
        />
      )}

      {/* TOAST SUCCESS NOTIFICATION */}
      {toast.visible && (
        <div className="toast-success">
          {toast.message}
        </div>
      )}
    </>
  );
}

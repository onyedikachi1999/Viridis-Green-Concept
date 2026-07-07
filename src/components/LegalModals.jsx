import React, { useState } from 'react';
import BuybyDemo from './BuybyDemo';

export function PrivacyModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Privacy Policy</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          <p><em>Last Updated: July 2, 2026</em></p>
          <p>Viridis Green Concept ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information across our family of digital products: Buyby, TMail, and Eleven.</p>
          
          <h4>1. Information We Collect</h4>
          <p>We collect information you provide directly to us when using our services. This includes:</p>
          <ul>
            <li><strong>Fintech Operations (Buyby):</strong> Phone numbers, bank account numbers, tokenized payment authorizations, transaction PINs (stored as secure hashes), natural language SMS commands, and double-leg settlement references. Buyby serves as a transaction router and does not act as a wallet or hold customer funds directly.</li>
            <li><strong>Mail Services (TMail):</strong> Temporary routing data. We do not link temporary email sessions to your permanent identity unless explicitly configured by you.</li>
            <li><strong>Faith-Based Chat (Eleven):</strong> Conversation logs used strictly to personalize your engagement with biblical texts and reflections.</li>
          </ul>

          <h4>2. How We Use Your Information</h4>
          <p>We use your information to operate, maintain, and improve our products. This includes executing SMS-based transaction routing on Buyby, delivering temporary communications on TMail, and tailoring faith reflections on Eleven. We also use your contact details to provide customer support.</p>

          <h4>3. Sharing and Third-Party Processors</h4>
          <p>We do not sell your personal data. We only share information with trustworthy third-party service providers to facilitate operations. This includes:
            <ul>
              <li><strong>Flutterwave</strong>: To resolve bank accounts, execute tokenized bank debits, and route outward payout transfers.</li>
              <li><strong>Africa's Talking</strong>: To transmit SMS interactive menus, receipt alerts, and session updates.</li>
              <li><strong>Google Gemini</strong>: To parse natural language SMS transaction intents (messages are evaluated in memory and not stored permanently).</li>
              <li><strong>Monnify</strong>: To process invoice payments for custom institutional service tiers.</li>
            </ul>
            All sharing is conducted in compliance with applicable Nigerian data protection laws (NDPR).
          </p>

          <h4>4. Data Security</h4>
          <p>We implement industry-standard administrative, technical, and physical security measures to safeguard your financial and personal information against unauthorized access, loss, or modification.</p>

          <h4>5. Your Rights and Contact Info</h4>
          <p>Under the NDPR, you have rights to access, rectify, or delete your personal data. For privacy-related inquiries, contact our Data Protection Officer at <strong>privacy@viridisgreenconcept.com</strong> or our physical address: No. 11, Yunusa adedeji street of Muslim Avenue Ikeja Lagos, Nigeria.</p>
        </div>
      </div>
    </div>
  );
}

export function TermsModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Terms of Service</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          <p><em>Last Updated: July 2, 2026</em></p>
          <p>Welcome to Viridis Green Concept. By accessing or using our website and digital products (Buyby, TMail, Eleven), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

          <h4>1. Eligibility & User Accounts</h4>
          <p>You must be at least 18 years old or possess legal business authorization in Nigeria to create a merchant or user account on our SaaS platforms. You are responsible for safeguarding your credentials and for all activities that occur under your account.</p>

          <h4>2. Use of Services</h4>
          <ul>
            <li><strong>Buyby:</strong> You agree to use transaction-support utilities solely for legitimate, authorized business operations. Any attempt to facilitate fraudulent, illegal, or unauthorized transfers is strictly prohibited and will result in immediate termination.</li>
            <li><strong>TMail:</strong> Temporary email addresses are provided for convenience and privacy. They must not be used to register accounts for spamming, harassment, or malicious activity.</li>
            <li><strong>Eleven:</strong> The faith-centered engine is for spiritual reflection and biblically-guided study. Users must engage respectfully with the platform.</li>
          </ul>

          <h4>3. Billing, Fees & Refund Policy</h4>
          <p>Access to certain features of Buyby is subscription-based or subject to transaction coordination fees. Fees are detailed clearly at point of setup. All payments processed via our payment gateway (Monnify) are securely authenticated. </p>
          <p><strong>Refund Policy:</strong> Due to the digital nature of our SaaS tools, subscriptions and service fees are generally non-refundable. However, if a billing discrepancy occurs, or you feel you were incorrectly charged, please contact us at <strong>billing@viridisgreenconcept.com</strong> within 7 days of the transaction for a review and resolution.</p>

          <h4>4. Limitation of Liability</h4>
          <p>To the maximum extent permitted by Nigerian law, Viridis Green Concept shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use our digital assets.</p>

          <h4>5. Governing Law</h4>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Lagos State.</p>
        </div>
      </div>
    </div>
  );
}

export function ProductModal({ type, productName, onClose, onToast }) {
  const [email, setEmail] = useState('');
  const [demoTab, setDemoTab] = useState('simulator');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    const requestType = type.startsWith('demo') ? 'demo' : 'waitlist';

    fetch('/api/inquiries/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        product: productName,
        type: requestType
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then(() => {
        onToast(`Success! ${email} has been added to the ${productName} ${requestType}.`);
        onClose();
      })
      .catch(err => {
        console.error(err);
        onToast('Unable to submit waitlist request. Please try again.');
      });
  };

  const getContent = () => {
    switch (type) {
      case 'waitlist_buyby':
      case 'waitlist_eleven':
      case 'waitlist_stelloo':
        return (
          <>
            <p>We are currently operating in a private beta. Enter your business email below to secure early access when we roll out new invites.</p>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="yourname@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                Join the Waitlist
              </button>
            </form>
          </>
        );
      case 'demo_buyby':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Tab switchers */}
            <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <button 
                onClick={() => setDemoTab('simulator')}
                className="btn"
                style={{ 
                  background: demoTab === 'simulator' ? 'var(--forest)' : 'rgba(255,255,255,0.02)',
                  color: '#fff',
                  borderColor: demoTab === 'simulator' ? 'var(--leaf-1)' : 'rgba(255,255,255,0.1)',
                  fontSize: '12px',
                  padding: '6px 14px',
                  cursor: 'pointer'
                }}
              >
                🎮 Try Interactive Simulator
              </button>
              <button 
                onClick={() => setDemoTab('contact')}
                className="btn"
                style={{ 
                  background: demoTab === 'contact' ? 'var(--forest)' : 'rgba(255,255,255,0.02)',
                  color: '#fff',
                  borderColor: demoTab === 'contact' ? 'var(--leaf-1)' : 'rgba(255,255,255,0.1)',
                  fontSize: '12px',
                  padding: '6px 14px',
                  cursor: 'pointer'
                }}
              >
                📅 Request Calendar Invite
              </button>
            </div>

            {demoTab === 'simulator' ? (
              <BuybyDemo />
            ) : (
              <>
                <p>Want a guided tour of Buyby's payment reconciliation workflow? Let us know where to send the calendar invite.</p>
                <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
                  <div className="field">
                    <label>Work Email Address</label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                    Request Demo
                  </button>
                </form>
              </>
            )}
          </div>
        );
      case 'learn_buyby':
        return (
          <div>
            <p><strong>Buyby</strong> is an offline-first, SMS-based transaction router designed for users with little to no internet connectivity or access to smart mobile devices. It provides:</p>
            <ul>
              <li><strong>Direct Bank-to-Bank Trust:</strong> Buyby is a decentralized payment router that links bank accounts directly and moves funds on-demand. It never acts as a wallet or a custodian of customer funds.</li>
              <li><strong>Google Gemini NLP Engine:</strong> Interprets natural language SMS transaction requests (e.g., <em>"send 5000 to Access bank..."</em>) to automatically parse intents and payment details.</li>
              <li><strong>Double-Leg Settlement:</strong> Splits transfers into Leg 1 (charging the sender's linked Flutterwave account authorization token) and Leg 2 (immediate payout transfer to the receiver's bank).</li>
              <li><strong>Security & Self-Healing:</strong> Features a 5-attempt PIN lockout protection, transaction velocity throttling, risk scoring algorithms, and self-healing cron recovery jobs.</li>
            </ul>
            <p style={{ marginTop: '16px' }}>For custom setup guides and developer APIs, please contact <strong>support@viridisgreenconcept.com</strong>.</p>
          </div>
        );
      case 'learn_stelloo':
        return (
          <div>
            <p><strong>STELLOO</strong> is a mobile and web-based on-demand laundry and logistics platform connecting laundry service providers, delivery runners, and clients.</p>
            <ul>
              <li><strong>Service Provider Console:</strong> Web-based catalog management, document KYC processing, fabric care advisories, and revenue reporting.</li>
              <li><strong>Runners Logistics:</strong> Zone assignment, real-time routing, pickup flows, and earnings tracking.</li>
              <li><strong>Client Mobile App:</strong> Proximity-based vendor matching, visual order tracking timelines, loyalty credits, and referral bonuses.</li>
              <li><strong>Revenue Share Engine:</strong> Auto-split payments among providers, delivery runners, and the STELLOO platform.</li>
            </ul>
            <p style={{ marginTop: '16px' }}>For vendor onboarding queries, please contact <strong>partners@viridisgreenconcept.com</strong>.</p>
          </div>
        );
      case 'learn_tmail':
        return (
          <div>
            <p><strong>TMail</strong> is a temporary, privacy-first communication tool designed to shield your primary inbox. Features include:</p>
            <ul>
              <li><strong>Instant Inbox Generation:</strong> Generate throwaway addresses in one click without registering.</li>
              <li><strong>Self-Destructing Mail:</strong> Messages are auto-deleted after 24 hours to prevent data logging.</li>
              <li><strong>Attachments & Rich Text:</strong> Clean rendering of verification links, documents, and OTP codes.</li>
            </ul>
          </div>
        );
      case 'launch_tmail':
        return (
          <div>
            <p>Redirecting you to our secure communication panel. If it doesn't open in a new tab, click the link below:</p>
            <a 
              href="https://tmail.viridisgreenconcept.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
              onClick={onClose}
            >
              Launch TMail Portal
            </a>
          </div>
        );
      case 'explore_eleven':
        return (
          <div>
            <p><strong>Eleven</strong> is a faith-tech conversational assistant engineered to support study, meditation, and reflection. Core capabilities:</p>
            <ul>
              <li><strong>Guided Biblical Study:</strong> Ask contextual questions about theological passages.</li>
              <li><strong>Reflection Prompts:</strong> Receive daily devotionals tailored to your current focus or state of mind.</li>
              <li><strong>Prayer Support:</strong> Organize, trace, and maintain a quiet, structured digital prayer journal.</li>
            </ul>
          </div>
        );
      default:
        return <p>Information is currently being updated. Please check back later.</p>;
    }
  };

  const getHeader = () => {
    if (type.startsWith('waitlist')) return `Join ${productName} Waitlist`;
    if (type.startsWith('demo')) return `Request ${productName} Demo`;
    if (type.startsWith('learn')) return `About ${productName}`;
    if (type.startsWith('launch')) return `Launching ${productName}`;
    if (type.startsWith('explore')) return `Explore ${productName}`;
    return productName;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={type === 'demo_buyby' && demoTab === 'simulator' ? { maxWidth: '920px' } : {}}>
        <div className="modal-header">
          <h3>{getHeader()}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          {getContent()}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

export default function Forms({ onToast }) {
  const [partnerForm, setPartnerForm] = useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });

  const [investorForm, setInvestorForm] = useState({
    name: '',
    email: '',
    firm: '',
    message: ''
  });

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    if (!partnerForm.email || !partnerForm.contactName) {
      alert('Please fill out the required contact fields.');
      return;
    }
    try {
      const res = await fetch('/api/inquiries/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit partnership inquiry.');
      
      onToast(`Thank you, ${partnerForm.contactName}! Your partnership inquiry has been sent.`);
      setPartnerForm({
        orgName: '',
        contactName: '',
        email: '',
        phone: '',
        interest: '',
        message: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInvestorSubmit = async (e) => {
    e.preventDefault();
    if (!investorForm.email || !investorForm.name) {
      alert('Please fill out the required contact fields.');
      return;
    }
    try {
      const res = await fetch('/api/inquiries/investor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investorForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit investor inquiry.');

      onToast(`Thank you, ${investorForm.name}! Your investor inquiry has been sent.`);
      setInvestorForm({
        name: '',
        email: '',
        firm: '',
        message: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section id="partners" className="partners-wrap">
      <div className="wrap">
        <div className="section-head reveal in">
          <div className="eyebrow">Partners & Investors</div>
          <h2>Build the next chapter of Viridis with us</h2>
          <p>We're inviting partners, churches, businesses, and investors to collaborate as we expand our product pipeline across fintech, communication, and faith-tech.</p>
        </div>

        <div className="partner-grid">
          {/* Partnership Form */}
          <div className="partner-card reveal in">
            <h3>Partnership Inquiry</h3>
            <form onSubmit={handlePartnerSubmit}>
              <div className="field">
                <label>Organization Name</label>
                <input
                  type="text"
                  placeholder="Your organization"
                  value={partnerForm.orgName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, orgName: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Contact Person *</label>
                <input
                  type="text"
                  placeholder="Full name"
                  required
                  value={partnerForm.contactName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, contactName: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="you@organization.com"
                  required
                  value={partnerForm.email}
                  onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+234 ..."
                  value={partnerForm.phone}
                  onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Partnership Interest</label>
                <input
                  type="text"
                  placeholder="e.g. Distribution, integration, sponsorship"
                  value={partnerForm.interest}
                  onChange={(e) => setPartnerForm({ ...partnerForm, interest: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea
                  placeholder="Tell us more about how you'd like to collaborate"
                  value={partnerForm.message}
                  onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send Partnership Inquiry
              </button>
            </form>
          </div>

          {/* Investor Form */}
          <div className="partner-card reveal in">
            <h3>Investor Inquiry</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '14.5px', lineHeight: '1.6', marginTop: '-6px', marginBottom: '24px' }}>
              Viridis is building a pipeline of scalable digital assets across high-growth verticals. Reach out to discuss our roadmap and market opportunities.
            </p>
            <form onSubmit={handleInvestorSubmit}>
              <div className="field">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Full name"
                  required
                  value={investorForm.name}
                  onChange={(e) => setInvestorForm({ ...investorForm, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="you@firm.com"
                  required
                  value={investorForm.email}
                  onChange={(e) => setInvestorForm({ ...investorForm, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Firm / Fund</label>
                <input
                  type="text"
                  placeholder="Firm name"
                  value={investorForm.firm}
                  onChange={(e) => setInvestorForm({ ...investorForm, firm: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea
                  placeholder="Tell us about your investment parameters and interest"
                  value={investorForm.message}
                  onChange={(e) => setInvestorForm({ ...investorForm, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send Investor Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

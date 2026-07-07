import React from 'react';

export default function Solutions() {
  const solutions = [
    {
      title: 'Buyby',
      category: 'Fintech & Business Operations',
      points: [
        'Secure digital payment workflows',
        'Transaction initiation & reconciliation',
        'Business payment coordination'
      ]
    },
    {
      title: 'TMail',
      category: 'Digital Communication',
      points: [
        'Temporary, secure mail addresses',
        'Privacy-conscious by design',
        'Fast, convenient messaging'
      ]
    },
    {
      title: 'Eleven',
      category: 'Faith & Purpose Technology',
      points: [
        'Guided biblical engagement',
        'Prayer & reflection support',
        'Purpose-driven interaction'
      ]
    }
  ];

  return (
    <section id="solutions">
      <div className="wrap">
        <div className="section-head reveal in">
          <div className="eyebrow">Solutions</div>
          <h2>Grouped by what you're trying to solve</h2>
          <p>Browse our products by the problem they're built to solve.</p>
        </div>

        <div className="eco-grid">
          {solutions.map((s, index) => (
            <div key={index} className="eco-card reveal in">
              <div className="eyebrow">{s.category}</div>
              <h3>{s.title}</h3>
              <ul>
                {s.points.map((pt, ptIdx) => (
                  <li key={ptIdx}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

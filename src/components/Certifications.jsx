import React from 'react';

export default function Certifications() {
  const certificationsData = [
    {
      icon: '🗄️',
      name: 'SQL and Relational Databases 101',
      issuer: 'IBM Skills Network',
      date: 'April 2026'
    },
    {
      icon: '🤖',
      name: 'Prompt Engineering for Everyone',
      issuer: 'IBM Skills Network',
      date: 'May 2026'
    }
  ];

  return (
    <section id="certifications">
      <div className="section-eyebrow reveal">Certifications</div>
      <h2 className="section-title reveal">
        Credentials &amp; <span className="highlight">Badges</span>
      </h2>
      <span className="section-rule reveal"></span>
      <div className="cert-grid">
        {certificationsData.map((cert, index) => (
          <div key={index} className={`cert-card glass reveal reveal-delay-${index + 1}`}>
            <div className="cert-icon-wrap">{cert.icon}</div>
            <div>
              <div className="cert-name">{cert.name}</div>
              <div className="cert-issuer">{cert.issuer}</div>
              <div className="cert-date">{cert.date}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import React from 'react';

export default function Education() {
  const educationData = [
    {
      year: '2024 — PRESENT',
      school: 'Kishinchand Chellaram College, Mumbai',
      degree: 'Bachelor of Computer Application (BCA)',
      detail: 'Final Year',
      icon: 'fa-graduation-cap',
      current: true
    },
    {
      year: '2024',
      school: 'KES College, Mumbai',
      degree: 'Higher Secondary Certificate (HSC)',
      detail: '66.50%',
      icon: 'fa-school',
      current: false
    },
    {
      year: '2022',
      school: 'KMPD Vidyalaya, Mumbai',
      degree: 'Secondary School Certificate (SSC)',
      detail: '77.60%',
      icon: 'fa-book',
      current: false
    }
  ];

  return (
    <section id="education">
      <div className="section-eyebrow reveal">Education</div>
      <h2 className="section-title reveal">
        Academic <span className="highlight">Journey</span>
      </h2>
      <span className="section-rule reveal" />

      <div className="edu-layout">
        <div className="edu-timeline">
          {educationData.map((edu, index) => (
            <div key={index} className={`edu-item glass reveal reveal-delay-${index + 1}${edu.current ? ' edu-item--current' : ''}`}>
              {/* Timeline node */}
              <div className="edu-node" aria-hidden="true">
                <div className="edu-node-ring">
                  <i className={`fas ${edu.icon}`} />
                </div>
                {index < educationData.length - 1 && (
                  <div className="edu-connector" />
                )}
              </div>

              {/* Content */}
              <div className="edu-content">
                <div className="edu-year-tag">
                  <i className="fas fa-calendar-alt" aria-hidden="true" />
                  {edu.year}
                </div>
                <div className="edu-school">{edu.school}</div>
                <div className="edu-degree">{edu.degree}</div>
                {edu.current ? (
                  <div className="edu-status-badge">
                    <span className="badge-pulse-dot" aria-hidden="true" />
                    {edu.detail}
                  </div>
                ) : (
                  <div className="edu-score">{edu.detail}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

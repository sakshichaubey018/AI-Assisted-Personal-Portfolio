import React, { useState, useEffect, useRef } from 'react';

export default function Projects() {
  const projectsData = [
    {
      thumb: '🏥',
      thumbClass: 'health',
      tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
      title: 'Smart Health Consulting System',
      desc: 'A full-stack virtual healthcare platform where patients can book consultations, view doctor profiles, and manage their appointment history — all in one secure app.',
      features: [
        'JWT-based auth with separate roles for patients and doctors',
        'React frontend with real-time appointment status updates',
        'RESTful Node/Express API with MongoDB for persistent records'
      ],
      label: 'Full-Stack Web App',
      accentColor: '#7B61FF',
      commitHash: 'e7b2d84',
      commitDate: '2025-12-10'
    },
    {
      thumb: '📝',
      thumbClass: 'blog',
      tech: ['Java', 'Java Swing', 'JDBC', 'MySQL'],
      title: 'Desktop Blogging Application',
      desc: 'A fully-functional desktop blogging tool built with Java Swing, allowing users to create, edit, delete, and browse blog posts with a smooth, intuitive GUI.',
      features: [
        'Custom Java Swing components with multi-view navigation',
        'JDBC-powered CRUD operations against a structured MySQL schema',
        'Tested end-to-end in NetBeans — zero known bugs on stable build'
      ],
      label: 'Desktop Application',
      accentColor: '#00D4FF',
      commitHash: 'c1d0e55',
      commitDate: '2025-08-14'
    },
    {
      thumb: '🛒',
      thumbClass: 'ecom',
      tech: ['React.js', 'Node.js', 'Express', 'MongoDB'],
      title: 'Mini E-Commerce Storefront',
      desc: 'A lightweight product listing and cart app demonstrating end-to-end state management, REST API design, and responsive layout built for real-world practice.',
      features: [
        'Product catalogue with search, filter, and sort functionality',
        'Cart state persisted via localStorage + MongoDB user sessions',
        'Fully mobile-responsive with accessible markup'
      ],
      label: 'E-Commerce Platform',
      accentColor: '#7B61FF',
      commitHash: 'a3f9c2b',
      commitDate: '2025-09-01'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const cardRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentIndex(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleCount = windowWidth <= 1100 ? 1 : 2;
  const maxSlide = Math.max(0, projectsData.length - visibleCount);

  const goTo = (idx) => {
    const nextIndex = Math.max(0, Math.min(idx, maxSlide));
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    if (trackRef.current && cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth + 28;
      trackRef.current.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  }, [currentIndex, windowWidth]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section id="projects">
      {/* Git-log section header bar */}
      <div className="git-log-bar reveal">
        <span className="git-branch-icon" aria-hidden="true">
          <i className="fas fa-code-branch" />
        </span>
        <span className="git-branch-name">sakshi/main</span>
        <span className="git-log-sep" aria-hidden="true">·</span>
        <span className="git-commit-count">{projectsData.length} commits</span>
      </div>

      <div className="section-header-flex">
        <div>
          <div className="section-eyebrow reveal">Projects</div>
          <h2 className="section-title reveal">
            What I've <span className="highlight">Built</span>
          </h2>
          <span className="section-rule reveal" />
        </div>
        <div className="carousel-controls reveal">
          <div className="carousel-counter">
            <span className="counter-current">{pad(currentIndex + 1)}</span>
            <span className="counter-sep">/</span>
            <span className="counter-total">{pad(maxSlide + 1)}</span>
          </div>
          <div className="carousel-nav">
            <button
              className="arrow-btn"
              id="prevBtn"
              aria-label="Previous project"
              disabled={currentIndex === 0}
              onClick={() => goTo(currentIndex - 1)}
            >
              <i className="fas fa-chevron-left" />
            </button>
            <button
              className="arrow-btn"
              id="nextBtn"
              aria-label="Next project"
              disabled={currentIndex === maxSlide}
              onClick={() => goTo(currentIndex + 1)}
            >
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>
      </div>

      <div className="carousel-viewport">
        <div className="carousel-track" id="carouselTrack" ref={trackRef}>
          {projectsData.map((project, index) => (
            <div
              key={index}
              className={`project-card glass reveal ${index > 0 ? `reveal-delay-${index}` : ''}`}
              ref={index === 0 ? cardRef : null}
            >
              {/* Git-log commit header above each card */}
              <div className="project-git-row">
                <span className="git-commit-hash">#{project.commitHash}</span>
                <span className="git-commit-author">sakshichaubey018</span>
                <span className="git-commit-date">{project.commitDate}</span>
              </div>

              {/* Project type label badge */}
              <div className="project-label-badge">
                <span className="badge-pulse-dot" />
                {project.label}
              </div>

              <div className={`project-thumb ${project.thumbClass}`}>
                {/* Hover shimmer overlay */}
                <div className="thumb-shimmer" />

                {/* ── LAPTOP MOCKUP: Smart Health Consulting System ── */}
                {project.thumbClass === 'health' && (
                  <div className="mockup-container laptop-mockup">
                    <div className="laptop-screen-wrapper">
                      <div className="laptop-screen">
                        <div className="screen-notch" />
                        <div className="dashboard-preview">
                          <aside className="dash-sidebar">
                            <span className="dash-user">👤</span>
                            <div className="dash-sidebar-links">
                              <span className="dash-link active">🏠</span>
                              <span className="dash-link">📅</span>
                              <span className="dash-link">💬</span>
                              <span className="dash-link">⚙️</span>
                            </div>
                          </aside>
                          <main className="dash-content">
                            <div className="dash-header">
                              <span className="dash-title">Health OS</span>
                              <span className="dash-badge">Active Session</span>
                            </div>
                            <div className="dash-stats">
                              <div className="dash-stat">
                                <span className="stat-icon">📅</span>
                                <span className="stat-val">12</span>
                                <span className="stat-lbl">Appointments</span>
                              </div>
                              <div className="dash-stat">
                                <span className="stat-icon">👨‍⚕️</span>
                                <span className="stat-val">8</span>
                                <span className="stat-lbl">Consultants</span>
                              </div>
                            </div>
                            <div className="dash-timeline">
                              <div className="timeline-header">Today's Schedule</div>
                              <div className="timeline-row">
                                <div className="timeline-dot status-pending" />
                                <div className="timeline-info">
                                  <span className="time">10:30 AM</span>
                                  <span className="patient">Consultation — Dr. Aris</span>
                                </div>
                              </div>
                              <div className="timeline-row">
                                <div className="timeline-dot status-approved" />
                                <div className="timeline-info">
                                  <span className="time">02:15 PM</span>
                                  <span className="patient">Follow-up — Dr. Sarah</span>
                                </div>
                              </div>
                            </div>
                          </main>
                        </div>
                      </div>
                    </div>
                    <div className="laptop-base">
                      <div className="laptop-groove" />
                    </div>
                  </div>
                )}

                {/* ── WINDOW MOCKUP: Desktop Blogging Application ── */}
                {project.thumbClass === 'blog' && (
                  <div className="mockup-container window-mockup">
                    <div className="window-header">
                      <div className="window-controls">
                        <span className="control-btn red" />
                        <span className="control-btn yellow" />
                        <span className="control-btn green" />
                      </div>
                      <div className="window-title">Blogger Pro — Java Swing Application</div>
                    </div>
                    <div className="window-body">
                      <div className="blog-sidebar">
                        <div className="sidebar-link active">📝 Create Post</div>
                        <div className="sidebar-link">🗂️ All Entries</div>
                        <div className="sidebar-link">📊 Statistics</div>
                        <div className="sidebar-link">⚙️ Options</div>
                      </div>
                      <div className="blog-editor">
                        <div className="editor-header">
                          <span className="editor-subject">Database Design Patterns</span>
                          <span className="editor-status">Sync Active</span>
                        </div>
                        <div className="editor-canvas">
                          <p>Relational databases represent tables containing relational rows. Using proper indexes improves lookup complexity to O(log N)...</p>
                          <div className="text-caret" />
                        </div>
                        <div className="editor-actions">
                          <span className="char-count">115 Words</span>
                          <button className="editor-btn">Publish to Web</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── MOBILE MOCKUP: Mini E-Commerce Storefront ── */}
                {project.thumbClass === 'ecom' && (
                  <div className="mockup-container mobile-mockup">
                    <div className="phone-bezel">
                      <div className="phone-speaker" />
                      <div className="phone-island" />
                      <div className="phone-screen">
                        <div className="store-app">
                          <header className="store-app-header">
                            <span className="store-app-title">Pulse Store</span>
                            <span className="store-app-cart">🛒<span className="cart-badge">3</span></span>
                          </header>
                          <div className="store-app-promo">
                            <div className="promo-lbl">Limited Edition</div>
                            <div className="promo-val">20% Autumn Coupon</div>
                          </div>
                          <div className="store-app-grid">
                            <div className="store-item">
                              <div className="item-graphic">🎧</div>
                              <div className="item-name">Pro Earphones</div>
                              <div className="item-price">$199</div>
                              <button className="item-btn">Add</button>
                            </div>
                            <div className="store-item">
                              <div className="item-graphic">⌚</div>
                              <div className="item-name">Smart Watch</div>
                              <div className="item-price">$289</div>
                              <button className="item-btn">Add</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="phone-home-indicator" />
                    </div>
                  </div>
                )}
              </div>

              <div className="project-body">
                <div className="project-tech">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="tech-badge">{t}</span>
                  ))}
                </div>
                <div className="project-title">{project.title}</div>
                <p className="project-desc">{project.desc}</p>
                <ul className="project-features">
                  {project.features.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
                <div className="project-cta-row">
                  <span className="project-view-link">
                    View Details <i className="fas fa-arrow-right project-cta-arrow"></i>
                  </span>
                  <span className="project-number">{pad(index + 1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Luxurious dot track progress indicator */}
      <div className="carousel-progress reveal">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex) / maxSlide) * 100}%` }}
          />
        </div>
        <div className="carousel-dots" id="carouselDots">
          {Array.from({ length: maxSlide + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

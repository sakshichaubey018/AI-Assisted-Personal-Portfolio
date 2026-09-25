import React from 'react';

export default function About() {
  return (
    <section id="about">
      <div className="section-eyebrow reveal">Who I Am</div>
      <h2 className="section-title reveal">
        Building real things that <span className="highlight">matter</span>
      </h2>
      <span className="section-rule reveal"></span>
      <div className="about-grid">
        <div className="about-body">
          <p className="reveal reveal-delay-1">
            I'm a <strong>final-year BCA student</strong> at Kishinchand Chellaram College, Mumbai, with a genuine passion
            for building things on the web. I started with static HTML pages and quickly fell in love with the entire
            stack — from designing APIs to crafting pixel-perfect UIs.
          </p>
          <p className="reveal reveal-delay-2">
            I've shipped two complete, end-to-end projects — a full-stack healthcare platform and a desktop blogging app —
            handling everything from <strong>database schema design</strong> to <strong>user authentication</strong> and
            <strong>responsive UI</strong>. I'm now actively looking for a software or IT internship where I can
            contribute to real product development from day one.
          </p>
          <div className="reveal reveal-delay-3">
            <a href="mailto:sakshichaubey018@gmail.com" className="btn-primary">
              Hire Me <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        <div className="about-stats">
          <div className="stat-card glass reveal reveal-delay-1">
            <div className="stat-num">2</div>
            <div className="stat-label">End-to-End Projects</div>
          </div>
          <div className="stat-card glass reveal reveal-delay-2">
            <div className="stat-num">5+</div>
            <div className="stat-label">Technologies Mastered</div>
          </div>
          <div className="stat-card glass reveal reveal-delay-3">
            <div className="stat-num">2</div>
            <div className="stat-label">IBM Certifications</div>
          </div>
          <div className="stat-card glass reveal reveal-delay-4">
            <div className="stat-num">🏙️</div>
            <div className="stat-label">Mumbai, India</div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <h1 className="hero-name hero-entry">
            Hi, I'm<br />
            <span className="highlight">Sakshi&nbsp;Chaubey</span>
          </h1>

          <div className="hero-role-tags hero-entry" aria-label="Roles">
            <span className="hero-role-tag">MERN Stack</span>
            <span className="hero-role-sep" aria-hidden="true">/</span>
            <span className="hero-role-tag">Java Dev</span>
            <span className="hero-role-sep" aria-hidden="true">/</span>
            <span className="hero-role-tag">Mumbai 🏙️</span>
          </div>

          <p className="hero-subtitle hero-entry">
            Final-year BCA student at KC College Mumbai, building full-stack web apps
            with the MERN stack and Java. I write clean code, ship real products, and
            learn something new every day.
          </p>

          <div className="hero-cta hero-entry">
            <a href="#projects" className="btn-primary">
              <i className="fas fa-rocket" />View My Work
            </a>
            <a href="#contact" className="btn-outline">Let's Talk</a>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">Sakshi <span>Chaubey</span></div>
      <div className="footer-copy">© 2026 — Crafted with ☕ in Mumbai</div>
      <div className="footer-socials">
        <a href="mailto:sakshichaubey018@gmail.com" title="Email"><i className="fas fa-envelope"></i></a>
        <a href="https://linkedin.com/in/sakshichaube" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i
            className="fab fa-linkedin-in"></i></a>
        <a href="https://github.com/sakshichaubey018" target="_blank" rel="noopener noreferrer" title="GitHub"><i className="fab fa-github"></i></a>
      </div>
    </footer>
  );
}

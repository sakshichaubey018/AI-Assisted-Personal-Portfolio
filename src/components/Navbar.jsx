import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 160) {
          current = s.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMobile = () => {
    setMobileOpen(prev => !prev);
  };

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* MOBILE NAV DRAWER */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} id="mobileNav">
        <button className="mobile-nav-close" id="mobileNavClose" aria-label="Close menu" onClick={handleCloseMobile}>
          <i className="fas fa-times"></i>
        </button>
        {links.map(link => (
          <a key={link.href} href={link.href} className="mobile-link" onClick={handleCloseMobile}>
            {link.name}
          </a>
        ))}
      </div>

      {/* NAVBAR */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-logo">Sakshi<span>.dev</span></div>
        <ul className="nav-links">
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={activeSection === link.href.substring(1) ? 'active' : ''}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-controls">
          <a href="mailto:sakshichaubey018@gmail.com" className="nav-cta">
            <i className="fas fa-paper-plane"></i> Hire Me
          </a>
          <button className={`hamburger ${mobileOpen ? 'open' : ''}`} id="hamburger" aria-label="Open menu" onClick={handleToggleMobile}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </>
  );
}

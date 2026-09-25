import React, { useState, useEffect } from 'react';
import CustomCursor   from './components/CustomCursor';
import NeuralNetworkBg from './components/NeuralNetworkBg';
import LoadingScreen  from './components/LoadingScreen';
import Navbar         from './components/Navbar';
import Hero           from './components/Hero';
import About          from './components/About';
import Skills         from './components/Skills';
import Projects       from './components/Projects';
import Education      from './components/Education';
import Certifications from './components/Certifications';
import Contact        from './components/Contact';
import Footer         from './components/Footer';
import ChatWidget     from './components/ChatWidget';
import useAnimations  from './hooks/useAnimations';

export default function App() {
  const [siteReady, setSiteReady] = useState(false);

  /* ── Scroll-triggered reveal observer ── */
  useEffect(() => {
    if (!siteReady) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -48px 0px' }
    );

    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, [siteReady]);

  /* ── Master Awwwards-level animations ── */
  useAnimations(siteReady);

  /* ── Prevent scroll while loading ── */
  useEffect(() => {
    if (!siteReady) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Trigger entry animations after brief paint delay
      setTimeout(() => {
        document.querySelectorAll('.hero-entry').forEach((el, i) => {
          setTimeout(() => el.classList.add('hero-entered'), i * 120);
        });
      }, 80);
    }
  }, [siteReady]);

  return (
    <>
      <LoadingScreen onComplete={() => setSiteReady(true)} />

      <CustomCursor />
      <NeuralNetworkBg />

      {/* AMBIENT ORB MESH */}
      <div className="mesh-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      {/* MAIN SITE — fades in after loader */}
      <div className={`site-wrap${siteReady ? ' site-ready' : ''}`}>
        <Navbar />

        <Hero />
        <div className="glow-divider" />

        <About />
        <div className="glow-divider" />

        <Skills />
        <div className="glow-divider" />

        <Projects />
        <div className="glow-divider" />

        <Education />
        <div className="glow-divider" />

        <Certifications />
        <div className="glow-divider" />

        <Contact />

        <Footer />

        {/* AI ASSISTANT WIDGET */}
        <ChatWidget />
      </div>
    </>
  );
}

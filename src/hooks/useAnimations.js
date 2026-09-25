import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Master animation hook — Awwwards-level interactions
 * - Smooth scrolling via Lenis
 * - Smooth anchor scroll via Lenis scrollTo
 * - Magnetic buttons
 * - 3-D card tilt
 * - Animated stat counters
 * - Mouse-following spotlight
 * - Staggered section reveals
 */
export default function useAnimations(ready = true) {
  const spotlightRef = useRef(null);
  const rafRef = useRef(null);
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const spotPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    if (!ready) return;

    /* ─────────────────────────────────────────────────
     * 0. SMOOTH SCROLLING (LENIS)
     * ───────────────────────────────────────────────── */
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    let lenisRafId;
    const updateLenis = (time) => {
      lenis.raf(time);
      lenisRafId = requestAnimationFrame(updateLenis);
    };
    lenisRafId = requestAnimationFrame(updateLenis);

    /* ─────────────────────────────────────────────────
     * 1. MOUSE-FOLLOWING SPOTLIGHT
     * ───────────────────────────────────────────────── */
    const spot = document.createElement('div');
    spot.className = 'mouse-spotlight';
    document.body.appendChild(spot);
    spotlightRef.current = spot;

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const lerpSpotlight = () => {
      const { x: mx, y: my } = mousePos.current;
      const { x: sx, y: sy } = spotPos.current;
      const lerpFactor = 0.07;
      spotPos.current = {
        x: sx + (mx - sx) * lerpFactor,
        y: sy + (my - sy) * lerpFactor,
      };
      spot.style.transform = `translate(${spotPos.current.x - 300}px, ${spotPos.current.y - 300}px)`;
      rafRef.current = requestAnimationFrame(lerpSpotlight);
    };
    rafRef.current = requestAnimationFrame(lerpSpotlight);

    /* ─────────────────────────────────────────────────
     * 2. MAGNETIC BUTTONS
     * ───────────────────────────────────────────────── */
    const magneticCleanup = [];

    const attachMagnetic = (selector, strength = 0.3) => {
      document.querySelectorAll(selector).forEach(el => {
        const onEnter = () => el.classList.add('magnetic-active');
        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * strength;
          const dy = (e.clientY - cy) * strength;
          el.style.setProperty('--mag-x', `${dx}px`);
          el.style.setProperty('--mag-y', `${dy}px`);
          el.style.transform = `translate(${dx}px, ${dy}px)`;
          el.style.transition = 'transform 0.12s ease';
        };
        const onLeave = () => {
          el.classList.remove('magnetic-active');
          el.style.transform = '';
          el.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
        };

        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        magneticCleanup.push(() => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    };

    attachMagnetic('.btn-primary', 0.25);
    attachMagnetic('.btn-outline', 0.25);
    attachMagnetic('.nav-cta', 0.2);
    attachMagnetic('.arrow-btn', 0.35);
    attachMagnetic('.footer-socials a', 0.4);
    attachMagnetic('.mobile-nav-close', 0.35);

    /* ─────────────────────────────────────────────────
     * 3. 3-D CARD TILT
     * ───────────────────────────────────────────────── */
    const tiltCleanup = [];

    const attachTilt = (selector, intensity = 6) => {
      // Disable tilt/parallax on touch-only devices for performance
      if (!window.matchMedia('(hover: hover)').matches) {
        return;
      }
      document.querySelectorAll(selector).forEach(el => {
        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          el.style.transform = `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateY(-6px) scale(1.015)`;
          el.style.transition = 'transform 0.1s ease';

          // Shine effect
          const shine = el.querySelector('.card-shine');
          if (shine) {
            shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
          }
        };
        const onLeave = () => {
          el.style.transform = '';
          el.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
          const shine = el.querySelector('.card-shine');
          if (shine) shine.style.background = 'none';
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        tiltCleanup.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    };

    attachTilt('.skill-card', 5);
    attachTilt('.project-card', 4);
    attachTilt('.cert-card', 5);
    attachTilt('.edu-item', 4);
    attachTilt('.stat-card', 6);

    /* ─────────────────────────────────────────────────
     * 4. ANIMATED STAT COUNTERS
     * ───────────────────────────────────────────────── */
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const numEl = el.querySelector('.stat-num');
      if (!numEl) return;
      const raw = numEl.textContent.trim();
      // Skip emoji-only values
      if (!/\d/.test(raw)) return;

      const match = raw.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return;
      const [, pre, numStr, suf] = match;
      const target = parseFloat(numStr);
      const isInt = Number.isInteger(target);

      const duration = 2000;
      const startTime = performance.now();

      const tick = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const val = easeOutCubic(t) * target;
        numEl.textContent = pre + (isInt ? Math.round(val) : val.toFixed(1)) + suf;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = '1';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('.stat-card').forEach((el) => counterObserver.observe(el));

    /* ─────────────────────────────────────────────────
     * 5. INJECT .card-shine INTO GLASS CARDS
     * ───────────────────────────────────────────────── */
    document.querySelectorAll('.glass').forEach(el => {
      if (!el.querySelector('.card-shine')) {
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        el.appendChild(shine);
      }
    });

    /* ─────────────────────────────────────────────────
     * 6. SMOOTH ANCHOR SCROLL (LENIS SCROLLTO)
     * ───────────────────────────────────────────────── */
    const scrollCleanup = [];
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      const onClick = (e) => {
        const id = link.getAttribute('href');
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      };
      link.addEventListener('click', onClick);
      scrollCleanup.push(() => link.removeEventListener('click', onClick));
    });

    /* ─────────────────────────────────────────────────
     * 7. SCROLL-PROGRESS BAR
     * ───────────────────────────────────────────────── */
    let progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress-bar';
      document.body.appendChild(progressBar);
    }

    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ─────────────────────────────────────────────────
     * 8. RE-INIT ON DOM MUTATIONS
     * ───────────────────────────────────────────────── */
    const mutObs = new MutationObserver(() => {
      // Add shine to any new glass cards
      document.querySelectorAll('.glass').forEach(el => {
        if (!el.querySelector('.card-shine')) {
          const shine = document.createElement('div');
          shine.className = 'card-shine';
          el.appendChild(shine);
        }
      });
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    /* ─────────────────────────────────────────────────
     * CLEANUP
     * ───────────────────────────────────────────────── */
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(lenisRafId);
      lenis.destroy();
      spot.remove();
      progressBar?.remove();
      magneticCleanup.forEach(fn => fn());
      tiltCleanup.forEach(fn => fn());
      counterObserver.disconnect();
      mutObs.disconnect();
      scrollCleanup.forEach(fn => fn());
    };
  }, [ready]);
}

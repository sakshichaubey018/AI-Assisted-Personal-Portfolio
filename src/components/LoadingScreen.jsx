import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'exit' | 'done'

  useEffect(() => {
    let raf;
    let start = null;
    const LOAD_DURATION = 1800;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (ts) => {
      if (!start) start = ts;
      const raw = Math.min((ts - start) / LOAD_DURATION, 1);
      const eased = easeInOutCubic(raw);
      setProgress(Math.round(eased * 100));

      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase('hold');
        setTimeout(() => {
          setPhase('exit');
          setTimeout(() => {
            setPhase('done');
            onComplete?.();
          }, 1100);
        }, 280);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === 'done') return null;

  const name = 'Sakshi Chaubey';

  return (
    <div className={`loader-wrap${phase === 'exit' ? ' loader-exiting' : ''}`} aria-hidden="true">
      {/* Split panels for cinematic exit */}
      <div className="loader-panel loader-panel--top" />
      <div className="loader-panel loader-panel--bot" />

      <div className="loader-inner">
        {/* Animated name */}
        <div className="loader-name" aria-label={name}>
          {name.split('').map((ch, i) => (
            <span
              key={i}
              className="loader-char"
              style={{ animationDelay: `${0.04 + i * 0.048}s` }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </div>

        <div className="loader-role">
          {'Full-Stack Developer'.split('').map((ch, i) => (
            <span
              key={i}
              className="loader-role-char"
              style={{ animationDelay: `${0.55 + i * 0.028}s` }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="loader-track">
          <div className="loader-fill" style={{ width: `${progress}%` }} />
          <div className="loader-glow" style={{ left: `${progress}%` }} />
        </div>

        <div className="loader-pct">
          <span className="loader-pct-num">{progress}</span>
          <span className="loader-pct-sym">%</span>
        </div>
      </div>
    </div>
  );
}

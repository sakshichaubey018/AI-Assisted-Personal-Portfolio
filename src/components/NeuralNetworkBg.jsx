import React, { useEffect, useRef } from 'react';

export default function NeuralNetworkBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    /* ── config ─────────────────────────────────── */
    const NODE_COUNT     = Math.min(72, Math.floor(W * H / 20000));
    const CONNECT_DIST   = 150;
    const MAX_PULSES     = 16;
    const PULSE_SPAWN    = 0.00028;
    const MOUSE_REPEL_R  = 160;
    const MOUSE_ATTRACT_R = 300;

    /* ── state ──────────────────────────────────── */
    const nodes  = [];
    const pulses = [];
    let mx = null, my = null, mouseActive = false;
    let scrollY = window.scrollY;

    /* ── helpers ────────────────────────────────── */
    const rand = (lo, hi) => lo + Math.random() * (hi - lo);
    const isViolet = (c) => c.startsWith('rgba(123');

    /* ── Node class ─────────────────────────────── */
    class Node {
      constructor() { this.reset(true); }

      reset(init = false) {
        this.x  = rand(0, W);
        this.y  = rand(0, H);
        this.vx = rand(-0.22, 0.22);
        this.vy = rand(-0.18, 0.18);

        // organic drift (Lissajous-like)
        this.ax   = rand(0, Math.PI * 2);
        this.ay   = rand(0, Math.PI * 2);
        this.asx  = rand(0.0008, 0.0022);   // angular speed x
        this.asy  = rand(0.0006, 0.002);    // angular speed y
        this.ampx = rand(0.12, 0.32);
        this.ampy = rand(0.10, 0.28);

        this.depth   = rand(0.45, 1.55);     // parallax layer
        this.baseR   = this.depth * 1.5;
        this.pulseR  = 0;                    // radius pulse when connected near cursor
        this.color   = Math.random() > 0.46 ? 'rgba(123,97,255,' : 'rgba(0,212,255,';
        this.opacity = 0.08 + (this.depth - 0.45) * 0.18;
        this.bright  = this.depth > 1.2;     // foreground node gets white core
      }

      update() {
        // organic path
        this.ax += this.asx;
        this.ay += this.asy;
        this.x  += this.vx * this.depth + Math.sin(this.ax) * this.ampx;
        this.y  += this.vy * this.depth + Math.cos(this.ay) * this.ampy;

        // wrap
        if (this.x < -20) this.x = W + 20;
        if (this.x > W + 20) this.x = -20;
        if (this.y < -20) this.y = H + 20;
        if (this.y > H + 20) this.y = -20;

        // cursor interaction
        if (mouseActive && mx !== null) {
          const dx = this.x - mx;
          const dy = this.y - my;
          const d  = Math.hypot(dx, dy);

          // repel close nodes
          if (d < MOUSE_REPEL_R) {
            const f = ((MOUSE_REPEL_R - d) / MOUSE_REPEL_R) ** 1.4 * 1.8 * this.depth;
            const a = Math.atan2(dy, dx);
            this.x += Math.cos(a) * f;
            this.y += Math.sin(a) * f;
          }

          // gentle gravity pull from medium range
          if (d > MOUSE_REPEL_R && d < MOUSE_ATTRACT_R) {
            const f = ((d - MOUSE_REPEL_R) / (MOUSE_ATTRACT_R - MOUSE_REPEL_R)) * 0.12 * this.depth;
            const a = Math.atan2(my - this.y, mx - this.x);
            this.x += Math.cos(a) * f;
            this.y += Math.sin(a) * f;
          }

          // brighten pulse radius near cursor
          this.pulseR = d < MOUSE_REPEL_R
            ? (MOUSE_REPEL_R - d) / MOUSE_REPEL_R * 3
            : 0;
        } else {
          this.pulseR *= 0.88;
        }
      }

      draw() {
        const r = this.baseR + this.pulseR;

        // outer glow halo
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 4.5);
        grd.addColorStop(0,   this.color + (this.opacity * 0.9) + ')');
        grd.addColorStop(0.4, this.color + (this.opacity * 0.35) + ')');
        grd.addColorStop(1,   this.color + '0)');
        ctx.beginPath();
        ctx.arc(this.x, this.y, r * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // solid core
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + (this.opacity * 2.2) + ')';
        ctx.fill();

        // white highlight on foreground nodes
        if (this.bright) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, r * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.55)';
          ctx.fill();
        }
      }
    }

    /* ── Pulse class ─────────────────────────────── */
    class Pulse {
      constructor(a, b) {
        this.a   = a;
        this.b   = b;
        this.t   = 0;
        this.spd = rand(0.006, 0.014);
        // hop chain: pulse continues from b to a neighbour
        this.chain = Math.random() < 0.38;
        this.col = isViolet(a.color) ? 'rgba(175,155,255,' : 'rgba(80,230,255,';
        this.trailLen = 0.18 + Math.random() * 0.15;
      }

      update() {
        this.t += this.spd;
        return this.t >= 1;
      }

      draw() {
        const px = this.a.x + (this.b.x - this.a.x) * this.t;
        const py = this.a.y + (this.b.y - this.a.y) * this.t;

        // trailing gradient along connection
        const t0 = Math.max(0, this.t - this.trailLen);
        const tx0 = this.a.x + (this.b.x - this.a.x) * t0;
        const ty0 = this.a.y + (this.b.y - this.a.y) * t0;

        const grad = ctx.createLinearGradient(tx0, ty0, px, py);
        grad.addColorStop(0,   this.col + '0)');
        grad.addColorStop(0.6, this.col + '0.18)');
        grad.addColorStop(1,   this.col + '0.9)');

        ctx.beginPath();
        ctx.moveTo(tx0, ty0);
        ctx.lineTo(px, py);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // glowing head
        const headGrd = ctx.createRadialGradient(px, py, 0, px, py, 5);
        headGrd.addColorStop(0, this.col + '1)');
        headGrd.addColorStop(1, this.col + '0)');
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = headGrd;
        ctx.fill();
      }
    }

    /* ── init ────────────────────────────────────── */
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(new Node());

    /* ── event handlers ──────────────────────────── */
    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const onMouseMove = (e) => { mx = e.clientX; my = e.clientY; mouseActive = true; };
    const onMouseLeave = () => { mouseActive = false; };
    const onScroll = () => { scrollY = window.scrollY; };

    window.addEventListener('resize',     onResize);
    window.addEventListener('mousemove',  onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll',     onScroll, { passive: true });

    /* ── draw connections ────────────────────────── */
    function drawConnections() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          if (Math.abs(a.depth - b.depth) > 0.55) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d  = Math.hypot(dx, dy);
          if (d > CONNECT_DIST) continue;

          let alpha = (1 - d / CONNECT_DIST) * 0.085;

          // boost alpha near cursor
          if (mouseActive && mx !== null) {
            const da = Math.hypot(a.x - mx, a.y - my);
            const db = Math.hypot(b.x - mx, b.y - my);
            const minD = Math.min(da, db);
            if (minD < MOUSE_ATTRACT_R) {
              alpha += 0.14 * (1 - minD / MOUSE_ATTRACT_R) ** 1.5;
            }
          }

          // gradient line using the two node colors
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, a.color + alpha + ')');
          grad.addColorStop(1, b.color + alpha + ')');

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = a.depth * 0.6;
          ctx.stroke();

          // spawn pulse
          if (pulses.length < MAX_PULSES && Math.random() < PULSE_SPAWN) {
            const dupe = pulses.some(p =>
              (p.a === a && p.b === b) || (p.a === b && p.b === a));
            if (!dupe) pulses.push(new Pulse(a, b));
          }
        }
      }
    }

    /* ── subtle dot-matrix backdrop ─────────────── */
    function drawBackdrop() {
      const px = mouseActive && mx !== null ? (mx - W / 2) * -0.008 : 0;
      const py = mouseActive && my !== null ? (my - H / 2) * -0.008 : 0;
      // scroll parallax
      const spy = (scrollY * -0.015) % 40;

      ctx.save();
      ctx.translate(px, py + spy);
      const step = 38;
      ctx.fillStyle = 'rgba(123,97,255,0.025)';
      for (let gx = 0; gx < W + step; gx += step) {
        for (let gy = 0; gy < H + step; gy += step) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    /* ── main loop ───────────────────────────────── */
    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      drawBackdrop();

      // update + draw connections (behind nodes)
      ctx.save();
      drawConnections();
      ctx.restore();

      // update nodes
      ctx.save();
      nodes.forEach(n => { n.update(); n.draw(); });
      ctx.restore();

      // update + draw pulses (on top)
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const done = p.update();
        if (done) {
          // chain hop
          if (p.chain) {
            const neighbours = nodes.filter(n => {
              if (n === p.a || n === p.b) return false;
              const d = Math.hypot(n.x - p.b.x, n.y - p.b.y);
              return d < CONNECT_DIST && Math.abs(n.depth - p.b.depth) < 0.55;
            });
            if (neighbours.length && pulses.length < MAX_PULSES) {
              const next = neighbours[Math.floor(Math.random() * neighbours.length)];
              pulses.push(new Pulse(p.b, next));
            }
          }
          pulses.splice(i, 1);
        } else {
          ctx.save();
          p.draw();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize',      onResize);
      window.removeEventListener('mousemove',   onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll',      onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

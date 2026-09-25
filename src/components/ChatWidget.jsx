import React, { useState, useRef, useEffect, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────────
   SYSTEM PROMPT — only answers about Sakshi
   ────────────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are Sakshi's personal AI assistant embedded on her portfolio website. You answer questions ONLY about Sakshi Chaubey — her background, skills, projects, education, certifications, and contact information. Keep your answers concise (2–4 sentences max), warm, and professional. If asked anything unrelated to Sakshi, politely decline and redirect to her portfolio topics.

About Sakshi Chaubey:
- Final-year BCA student at Kishinchand Chellaram College (KC College), Mumbai
- Full-stack developer specializing in the MERN stack (MongoDB, Express.js, React.js, Node.js) and Java
- Actively seeking software / IT internships where she can contribute to real product development
- Email: sakshichaubey018@gmail.com
- LinkedIn: linkedin.com/in/sakshichaube
- GitHub: github.com/sakshichaubey018
- Location: Mumbai, India

Projects:
1. Smart Health Consulting System — Full-stack virtual healthcare platform (MERN stack). Features JWT auth with separate patient/doctor roles, real-time appointment status, RESTful API with MongoDB.
2. Desktop Blogging Application — Java Swing desktop app with JDBC/MySQL backend. Full CRUD operations, multi-view navigation, custom Swing components. Tested end-to-end in NetBeans.
3. Mini E-Commerce Storefront — Lightweight product listing & cart app (MERN stack). Search/filter/sort, localStorage + MongoDB cart persistence, fully mobile-responsive.

Skills:
- Languages: C, Java, Python
- Web: HTML, CSS, JavaScript, React.js, Node.js, Express.js
- Databases: MySQL, MongoDB
- Tools: VS Code, NetBeans, Git, Canva, MS Office
- Other: REST APIs, Fast Typing, Tech Docs, Presentations
- Soft Skills: Communication, Problem Solving, Teamwork, Adaptability, Time Management

Education:
- BCA (Bachelor of Computer Application) — KC College Mumbai, 2024–Present (Final Year)
- HSC — KES College Mumbai, 2024, 66.50%
- SSC — KMPD Vidyalaya Mumbai, 2022, 77.60%

Certifications:
- SQL and Relational Databases 101 — IBM Skills Network (April 2026)
- Prompt Engineering for Everyone — IBM Skills Network (May 2026)`;

/* ──────────────────────────────────────────────────────────────
   SUGGESTED PROMPTS
   ────────────────────────────────────────────────────────────── */
const SUGGESTIONS = [
  "What projects has Sakshi built?",
  "What's her tech stack?",
  "Is she open to internships?",
  "How can I contact her?",
];

/* ──────────────────────────────────────────────────────────────
   OPENAI CALL  (falls back to mock if no key)
   ────────────────────────────────────────────────────────────── */
async function callOpenAI(messages) {
  const apiKey = import.meta.env.VITE_OPENAI_KEY;

  if (!apiKey) {
    // Mock responses for demo / when key is not set
    await new Promise((r) => setTimeout(r, 1200));
    const last = messages[messages.length - 1].content.toLowerCase();
    if (last.includes('project')) {
      return "Sakshi has built three end-to-end projects: a Smart Health Consulting System (MERN + JWT auth), a Desktop Blogging Application (Java Swing + MySQL), and a Mini E-Commerce Storefront (MERN + cart state). Each one is fully functional and production-ready!";
    }
    if (last.includes('stack') || last.includes('skill') || last.includes('tech')) {
      return "Sakshi's core stack is MERN (MongoDB, Express, React, Node.js). She also writes Java (Swing + JDBC), Python, and C. For tooling she uses Git, VS Code, and NetBeans.";
    }
    if (last.includes('intern') || last.includes('hire') || last.includes('available') || last.includes('open')) {
      return "Yes! Sakshi is actively looking for software or IT internships where she can work on real product features with a team that cares about clean code. Reach her at sakshichaubey018@gmail.com 📬";
    }
    if (last.includes('contact') || last.includes('email') || last.includes('reach')) {
      return "You can reach Sakshi at sakshichaubey018@gmail.com, connect on LinkedIn at linkedin.com/in/sakshichaube, or browse her code on GitHub at github.com/sakshichaubey018.";
    }
    if (last.includes('education') || last.includes('college') || last.includes('degree')) {
      return "Sakshi is a final-year BCA (Bachelor of Computer Application) student at Kishinchand Chellaram College, Mumbai. She also holds HSC (66.5%) and SSC (77.6%) from Mumbai institutions.";
    }
    if (last.includes('cert')) {
      return "Sakshi holds two IBM Skills Network certifications: 'SQL and Relational Databases 101' (April 2026) and 'Prompt Engineering for Everyone' (May 2026).";
    }
    return "I'm Sakshi's portfolio assistant! I can tell you about her projects, skills, education, certifications, or how to contact her. What would you like to know?";
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/* ──────────────────────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────────────────────── */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm Sakshi's AI assistant. Ask me anything about her projects, skills, or experience!",
      id: 'init',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Hide pulse after first open
  useEffect(() => {
    if (open) setShowPulse(false);
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    // Build history for API (exclude id field)
    const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

    try {
      const reply = await callOpenAI(history);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply, id: Date.now() + 1 },
      ]);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestion = (s) => {
    sendMessage(s);
  };

  const formatTime = (id) => {
    if (id === 'init') return 'just now';
    return new Date(id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-widget-root" aria-live="polite">
      {/* ── FLOATING LAUNCHER BUTTON ── */}
      <button
        id="chat-launcher"
        className={`chat-launcher${open ? ' chat-launcher--open' : ''}`}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant — ask about Sakshi'}
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen((v) => !v)}
      >
        {showPulse && !open && (
          <>
            <span className="chat-pulse chat-pulse-1" aria-hidden="true" />
            <span className="chat-pulse chat-pulse-2" aria-hidden="true" />
          </>
        )}
        <span className="chat-launcher-icon" aria-hidden="true">
          {open ? (
            // X icon
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            // Bot icon
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="8" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="9" cy="14" r="1.5" fill="currentColor" />
              <circle cx="15" cy="14" r="1.5" fill="currentColor" />
              <path d="M8 20v2M16 20v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M12 2v4M10 4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="6" r="1" fill="currentColor" />
            </svg>
          )}
        </span>
        {!open && (
          <span className="chat-launcher-label" aria-hidden="true">Ask about me</span>
        )}
      </button>

      {/* ── CHAT PANEL ── */}
      <div
        id="chat-panel"
        className={`chat-panel${open ? ' chat-panel--open' : ''}`}
        role="dialog"
        aria-label="AI Portfolio Assistant"
        aria-modal="false"
        ref={panelRef}
      >
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="8" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="9" cy="14" r="1.5" fill="currentColor" />
                <circle cx="15" cy="14" r="1.5" fill="currentColor" />
                <path d="M12 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="6" r="1" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="chat-header-name">Sakshi's AI</div>
              <div className="chat-header-status">
                <span className="chat-status-dot" aria-hidden="true" />
                Always online
              </div>
            </div>
          </div>
          <button
            className="chat-close-btn"
            aria-label="Close assistant"
            onClick={() => setOpen(false)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages" role="log" aria-label="Chat messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-msg chat-msg--${msg.role}`}
            >
              {msg.role === 'assistant' && (
                <div className="chat-msg-avatar" aria-hidden="true">S</div>
              )}
              <div className="chat-msg-body">
                <div className="chat-bubble">{msg.content}</div>
                <div className="chat-msg-time">{formatTime(msg.id)}</div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="chat-msg chat-msg--assistant" aria-label="Assistant is typing">
              <div className="chat-msg-avatar" aria-hidden="true">S</div>
              <div className="chat-msg-body">
                <div className="chat-bubble chat-bubble--typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="chat-error" role="alert">{error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !loading && (
          <div className="chat-suggestions" aria-label="Suggested questions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="chat-suggestion-btn"
                onClick={() => handleSuggestion(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            id="chat-input"
            className="chat-input"
            placeholder="Ask about projects, skills, contact…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            aria-label="Message input"
            disabled={loading}
            maxLength={400}
          />
          <button
            className="chat-send-btn"
            aria-label="Send message"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14.5 1.5L7 9M14.5 1.5l-4.5 13-3-5.5-5.5-3 13-4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="chat-footer-note" aria-hidden="true">
          <span>Powered by GPT-4o-mini</span>
          <span>·</span>
          <span>Only answers about Sakshi</span>
        </div>
      </div>
    </div>
  );
}

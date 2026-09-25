import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fname || !formData.email || !formData.message) {
      return;
    }
    
    setShowSuccess(true);
    setFormData({
      fname: '',
      lname: '',
      email: '',
      subject: '',
      message: ''
    });

    setTimeout(() => {
      setShowSuccess(false);
    }, 6000);
  };

  return (
    <section id="contact">
      <div className="section-eyebrow reveal">Contact</div>
      <h2 className="section-title reveal">
        Let's <span className="highlight">Connect</span>
      </h2>
      <span className="section-rule reveal"></span>
      <div className="contact-grid">
        <div>
          <p className="contact-intro reveal reveal-delay-1">
            I'm actively looking for software or IT internships — ideally somewhere I can work on real product features
            with a team that cares about clean code. If that sounds like your team, I'd love to hear from you.
          </p>
          <a href="mailto:sakshichaubey018@gmail.com" className="contact-info-item glass reveal reveal-delay-2">
            <div className="contact-icon-wrap">
              <i className="fas fa-envelope"></i>
            </div>
            <div>
              <div className="contact-label">Email</div>
              <div className="contact-value">sakshichaubey018@gmail.com</div>
            </div>
          </a>
          <a
            href="https://linkedin.com/in/sakshichaube"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-info-item glass reveal reveal-delay-3"
          >
            <div className="contact-icon-wrap">
              <i className="fab fa-linkedin-in"></i>
            </div>
            <div>
              <div className="contact-label">LinkedIn</div>
              <div className="contact-value">linkedin.com/in/sakshichaube</div>
            </div>
          </a>
          <a
            href="https://github.com/sakshichaubey018"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-info-item glass reveal reveal-delay-4"
          >
            <div className="contact-icon-wrap">
              <i className="fab fa-github"></i>
            </div>
            <div>
              <div className="contact-label">GitHub</div>
              <div className="contact-value">github.com/sakshichaubey018</div>
            </div>
          </a>
          <div className="contact-info-item glass reveal reveal-delay-5" style={{ cursor: 'default' }}>
            <div className="contact-icon-wrap">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <div className="contact-label">Location</div>
              <div className="contact-value">Mumbai, India</div>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="form-shell reveal reveal-delay-2">
          <form className="contact-form" id="contactForm" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder="Your first name"
                  value={formData.fname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  placeholder="Your last name"
                  value={formData.lname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Internship opportunity / Project collab / Hello 👋"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell me about your team, the role, or just say hi..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className={`form-success ${showSuccess ? 'show' : ''}`} id="formSuccess">
              <i className="fas fa-check-circle" style={{ color: 'var(--ice)', fontSize: '1.2rem' }}></i>
              Thanks for reaching out! I'll get back to you within 24 hours.
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              <i className="fas fa-paper-plane"></i> Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

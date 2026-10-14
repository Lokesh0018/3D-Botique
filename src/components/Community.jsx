import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Quote, Check, Sparkles, Users } from 'lucide-react';
import { prefersReducedMotion } from '../lib/motion';
import './Community.css';

const testimonials = [
  { id: 1, name: 'Alina Davis', tone: 'var(--swatch-blush)', text: 'This Blouse Is Very Perfect Because It Covers Various Purposes. It\'s Very Unique And Can Be Worn Formal And Informal.' },
  { id: 2, name: 'Ayomi Jomi', tone: 'var(--swatch-sage)', text: 'I Bought This Nice Blouse And Did Not Need Any Adjustments. Highly Recommend Setting Up Such Standard Fitting.' },
  { id: 3, name: 'Emily Smith', tone: 'var(--swatch-lilac)', text: 'Love This Top Very Standard Cutting And Great Color! Fabric Was The Main Part Which Has Awesome Finish.' },
  { id: 4, name: 'Michael Johnson', tone: 'var(--swatch-mist)', text: 'An Amazing Quality. Completely Surpassed My Expectations In Terms Of Fit And Texture.' },
];

// The marquee translates by one third, so the list is rendered three times;
// only the first copy is exposed to assistive tech.
const MARQUEE_COPIES = 3;

const initials = (name) => name.split(' ').map(part => part[0]).join('').slice(0, 2);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus('error');
      return;
    }
    // No mailing-list backend is connected yet; confirm locally.
    setStatus('success');
    setEmail('');
  };

  if (status === 'success') {
    return (
      <p className="newsletter-success text-sans" role="status">
        <Check size={18} aria-hidden="true" /> Thanks for joining — watch your inbox for our next drop.
      </p>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      <div className={`newsletter-box ${status === 'error' ? 'has-error' : ''}`}>
        <label htmlFor="newsletter-email" className="visually-hidden">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter Your Email"
          className="text-sans"
          value={email}
          onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
          required
        />
        <button type="submit" className="text-sans">Subscribe</button>
      </div>
      {status === 'error' && (
        <p id="newsletter-error" className="newsletter-error text-sans" role="alert">
          Please enter a valid email address, like name@example.com.
        </p>
      )}
    </form>
  );
};

const Community = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo('.community-header, .newsletter-section',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%'
        }
      }
    );
  }, { scope: containerRef });

  const marqueeItems = Array.from({ length: MARQUEE_COPIES }, (_, copy) =>
    testimonials.map(t => ({ ...t, copy }))
  ).flat();

  return (
    <section className="community-section" id="reviews" ref={containerRef}>
      <div className="community-header">
        <h2 className="text-display community-title">Loved By Our Customers</h2>
        <p className="text-sans community-desc">
          Our Customers Appreciate High Quality And Dedication To Sustainable Practices.<br/>They Share To Buy With Confidence Always.
        </p>
      </div>

      <div className="testimonials-marquee-wrapper">
        <ul className="testimonials-marquee" aria-label="Customer reviews">
          {marqueeItems.map(t => (
            <li
              key={`${t.id}-${t.copy}`}
              className={`testi-card ${t.copy > 0 ? 'is-clone' : ''}`}
              aria-hidden={t.copy > 0 || undefined}
            >
              <div className="testi-top">
                <div className="person-avatar" style={{ backgroundColor: t.tone }} aria-hidden="true">
                  {initials(t.name)}
                </div>
                <div className="person-name text-sans">{t.name}</div>
                <div className="quote-icon" aria-hidden="true">
                  <Quote size={20} color="var(--peach)" />
                </div>
              </div>
              <p className="testi-text text-sans">{t.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="newsletter-section" id="newsletter">
        {/* Ambient artistic background elements */}
        <div className="newsletter-bg-glow glow-1" aria-hidden="true" />
        <div className="newsletter-bg-glow glow-2" aria-hidden="true" />
        <div className="newsletter-bg-grid" aria-hidden="true" />

        {/* Floating community badges */}
        <div className="floating-comm-badge badge-left" aria-hidden="true">
          <Sparkles size={16} color="var(--accent-strong)" />
          <span>Weekly Drops</span>
        </div>

        <div className="floating-comm-badge badge-right" aria-hidden="true">
          <Users size={16} color="var(--olive)" />
          <span>12.4k Members</span>
        </div>

        <div className="newsletter-inner">
          <div className="community-pill-tag">
            <Sparkles size={14} color="var(--accent-strong)" aria-hidden="true" />
            <span className="uppercase-meta">Inner Circle</span>
          </div>

          <h2 className="text-display newsletter-title">Join Our Community</h2>
          <p className="text-sans newsletter-desc">
            Join our community working on creativity, collaboration, and growth<br className="desc-br"/>with like-minded individuals.
          </p>

          <NewsletterForm />

          {/* Social Proof Member Avatars Row */}
          <div className="community-members-row">
            <div className="member-avatars-stack" aria-hidden="true">
              <span className="mini-avatar" style={{ backgroundColor: 'var(--swatch-blush)' }}>AD</span>
              <span className="mini-avatar" style={{ backgroundColor: 'var(--swatch-sage)' }}>AJ</span>
              <span className="mini-avatar" style={{ backgroundColor: 'var(--swatch-lilac)' }}>ES</span>
              <span className="mini-avatar" style={{ backgroundColor: 'var(--swatch-lavender)' }}>MJ</span>
              <span className="mini-avatar avatar-plus">+2k</span>
            </div>
            <span className="text-sans members-stat-text">Join 12,000+ creators & stylists worldwide</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;

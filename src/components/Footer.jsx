import React from 'react';
import { useCart } from '../context/CartContext';
import { handleAnchorClick } from '../lib/smoothScroll';
import fashion1 from '../assets/fashion-1.webp';
import fashion2 from '../assets/fashion-2.webp';
import fashion3 from '../assets/fashion-3.webp';
import fashion4 from '../assets/fashion-4.webp';
import './Footer.css';

const XIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Facebook = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Instagram = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const CURRENT_YEAR = new Date().getFullYear();

// Replace these with the brand's real profile URLs.
const SOCIAL_LINKS = [
  { label: 'AURA on X', href: 'https://x.com', Icon: XIcon },
  { label: 'AURA on Facebook', href: 'https://www.facebook.com', Icon: Facebook },
  { label: 'AURA on Instagram', href: 'https://www.instagram.com', Icon: Instagram },
];

const LINK_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Hottest Picks', href: '#collections' },
      { label: 'Lime Green Blouse', href: '#product' },
      { label: 'Featured Looks', href: '#top' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'The Journal', href: '#journal' },
      { label: 'Culture', href: '#culture' },
      { label: 'Customer Reviews', href: '#reviews' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Newsletter', href: '#newsletter' },
      { label: 'Your Bag', action: 'openCart' },
    ],
  },
];

const Footer = () => {
  const { openCart } = useCart();

  return (
    <footer className="footer" id="about">
      {/* Decorative Editorial Fashion Silhouette Background Layer */}
      <div className="footer-bg-gallery" aria-hidden="true">
        <div className="footer-bg-track">
          <div className="footer-bg-item item-1">
            <img src={fashion1} alt="" loading="lazy" decoding="async" />
          </div>
          <div className="footer-bg-item item-2">
            <img src={fashion2} alt="" loading="lazy" decoding="async" />
          </div>
          <div className="footer-bg-item item-3">
            <img src={fashion3} alt="" loading="lazy" decoding="async" />
          </div>
          <div className="footer-bg-item item-4">
            <img src={fashion4} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="footer-bg-overlay-mask" />
      </div>

      <div className="footer-content">
        <div className="footer-brand-col">
          <h2 className="text-display footer-brand">
            <span className="brand-mark" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" fill="currentColor" fillOpacity="0.08" />
                <path d="M32 14L45 46H39.5L36.8 39.5H27.2L24.5 46H19L32 14Z" fill="currentColor"/>
                <polygon points="32,23.5 29.2,34.5 34.8,34.5" fill="var(--bg-surface)"/>
                <path d="M32 27.5L33.2 31.8L37.5 33L33.2 34.2L32 38.5L30.8 34.2L26.5 33L30.8 31.8Z" fill="var(--accent-strong)"/>
                <circle cx="32" cy="11.5" r="1.5" fill="var(--accent-strong)"/>
              </svg>
            </span>
            <span>AURA</span>
          </h2>
          <p className="text-sans footer-about">
            We Ensure Excellent Cut And Fit Through Personal Consultations And Taking Accurate Measurements.
          </p>
        </div>

        {LINK_COLUMNS.map(column => (
          <nav key={column.heading} className="footer-links-col" aria-label={column.heading}>
            <h3 className="uppercase-meta">{column.heading}</h3>
            <ul className="text-sans footer-links">
              {column.links.map(link => (
                <li key={link.label}>
                  {link.action === 'openCart' ? (
                    <button type="button" className="footer-link-btn" onClick={openCart}>{link.label}</button>
                  ) : (
                    <a href={link.href} onClick={handleAnchorClick}>{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer-bottom">
        <p className="text-sans footer-copy">
          &copy; {CURRENT_YEAR} AURA. All rights reserved.
        </p>

        <ul className="social-links">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a href={href} className="social-icon" aria-label={label} target="_blank" rel="noopener noreferrer">
                <Icon size={16} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2 className="text-display" style={{ fontSize: '2rem' }}>AURA</h2>
          <p className="text-sans" style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: '300px' }}>
            Redefining modern elegance with sustainable practices and timeless design.
          </p>
        </div>
        
        <div className="footer-links-group">
          <h4 className="uppercase-meta">Explore</h4>
          <ul className="text-sans footer-links">
            <li><a href="#">Journal</a></li>
            <li><a href="#">Collections</a></li>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Stores</a></li>
          </ul>
        </div>
        
        <div className="footer-links-group">
          <h4 className="uppercase-meta">Social</h4>
          <ul className="text-sans footer-links">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Pinterest</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
        
        <div className="footer-newsletter">
          <h4 className="uppercase-meta">Newsletter</h4>
          <form className="newsletter-form">
            <input type="email" placeholder="Email address" className="text-sans" />
            <button type="submit" className="uppercase-meta">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="text-sans uppercase-meta" style={{ color: 'var(--text-secondary)' }}>
          &copy; {new Date().getFullYear()} AURA STUDIO. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

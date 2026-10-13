import React from 'react';
import './Footer.css';

const Twitter = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Facebook = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Instagram = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand-col">
          <h2 className="text-display" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>Modern.</h2>
          <p className="text-sans" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '250px' }}>
            We Ensure Excellent Cut And Fit Through Personal Consultations And Taking Accurate Measurements.
          </p>
        </div>
        
        <div className="footer-links-col">
          <h4 className="uppercase-meta">COMPANY</h4>
          <ul className="text-sans footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Works</a></li>
            <li><a href="#">Career</a></li>
          </ul>
        </div>
        
        <div className="footer-links-col">
          <h4 className="uppercase-meta">HELP</h4>
          <ul className="text-sans footer-links">
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">Delivery Details</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div className="footer-links-col">
          <h4 className="uppercase-meta">FAQ</h4>
          <ul className="text-sans footer-links">
            <li><a href="#">Account</a></li>
            <li><a href="#">Manage Deliveries</a></li>
            <li><a href="#">Orders</a></li>
            <li><a href="#">Payments</a></li>
          </ul>
        </div>
        
        <div className="footer-links-col">
          <h4 className="uppercase-meta">RESOURCES</h4>
          <ul className="text-sans footer-links">
            <li><a href="#">Free eBooks</a></li>
            <li><a href="#">Development Tutorial</a></li>
            <li><a href="#">How to - Blog</a></li>
            <li><a href="#">Youtube Playlist</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="text-sans" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          &copy; 2024 All rights reserved
        </p>
        
        <div className="social-links">
          <a href="#" className="social-icon"><Twitter size={16} /></a>
          <a href="#" className="social-icon"><Facebook size={16} /></a>
          <a href="#" className="social-icon"><Instagram size={16} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

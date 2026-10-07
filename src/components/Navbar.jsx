import React, { useEffect, useRef } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import gsap from 'gsap';
import './Navbar.css';

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    // Reveal nav after frame
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.5 }
    );
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-left">
        <a href="/" className="brand-logo text-display">AURA</a>
      </div>
      
      <div className="nav-center">
        <ul className="nav-links text-sans uppercase-meta">
          <li><a href="#journal">Journal</a></li>
          <li><a href="#collections">Collections</a></li>
          <li><a href="#culture">Culture</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </div>
      
      <div className="nav-right">
        <button className="icon-btn" aria-label="Search">
          <Search size={18} strokeWidth={1.5} />
        </button>
        <button className="icon-btn" aria-label="Cart">
          <ShoppingBag size={18} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

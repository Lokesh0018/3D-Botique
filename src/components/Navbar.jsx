import React, { useEffect, useRef, useState } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';
import { handleAnchorClick } from '../lib/smoothScroll';
import { prefersReducedMotion } from '../lib/motion';
import SearchOverlay from './SearchOverlay';
import './Navbar.css';

const NAV_LINKS = [
  { href: '#journal', label: 'Journal' },
  { href: '#collections', label: 'Collections' },
  { href: '#culture', label: 'Culture' },
  { href: '#about', label: 'About' },
];

const Navbar = () => {
  const navRef = useRef(null);
  const { count, openCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    // Reveal nav after frame
    const tween = gsap.fromTo(navRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.5 }
    );
    return () => tween.kill();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const onNavClick = (e) => {
    setMenuOpen(false);
    handleAnchorClick(e);
  };

  return (
    <nav className="navbar" ref={navRef} aria-label="Main">
      <div className="nav-left">
        <a href="#top" className="brand-logo text-display" onClick={handleAnchorClick}>AURA</a>
      </div>

      <div className="nav-center">
        <ul className="nav-links text-sans uppercase-meta">
          {NAV_LINKS.map(link => (
            <li key={link.href}><a href={link.href} onClick={handleAnchorClick}>{link.label}</a></li>
          ))}
        </ul>
      </div>

      <div className="nav-right">
        <button type="button" className="icon-btn" aria-label="Search products" onClick={() => setSearchOpen(true)}>
          <Search size={18} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="icon-btn cart-btn"
          aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
          onClick={openCart}
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          {count > 0 && <span className="cart-badge" aria-hidden="true">{count > 99 ? '99+' : count}</span>}
        </button>
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {menuOpen && (
        <ul id="mobile-menu" className="mobile-menu text-sans uppercase-meta">
          {NAV_LINKS.map(link => (
            <li key={link.href}><a href={link.href} onClick={onNavClick}>{link.label}</a></li>
          ))}
        </ul>
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;

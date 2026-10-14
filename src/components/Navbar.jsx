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

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scroll position tracking for active section
      const sectionIds = ['about', 'culture', 'journal', 'collections'];
      const scrollPos = window.scrollY + 250;

      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = `#${id}`;
            break;
          }
        }
      }

      // If at bottom of page, highlight about/footer
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        current = '#about';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`navbar ${isScrolled ? 'is-scrolled' : ''}`} ref={navRef} aria-label="Main">
      <div className="nav-left">
        <a href="#top" className="brand-logo text-display" onClick={handleAnchorClick}>
          <span className="brand-mark" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" fill="currentColor" fillOpacity="0.08" />
              <path d="M32 14L45 46H39.5L36.8 39.5H27.2L24.5 46H19L32 14Z" fill="currentColor"/>
              <polygon points="32,23.5 29.2,34.5 34.8,34.5" fill="var(--bg-surface)"/>
              <path d="M32 27.5L33.2 31.8L37.5 33L33.2 34.2L32 38.5L30.8 34.2L26.5 33L30.8 31.8Z" fill="var(--accent-strong)"/>
              <circle cx="32" cy="11.5" r="1.5" fill="var(--accent-strong)"/>
            </svg>
          </span>
          <span className="brand-name">AURA</span>
        </a>
      </div>

      <div className="nav-center">
        <ul className="nav-links text-sans uppercase-meta">
          {NAV_LINKS.map(link => {
            const isActive = activeSection === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={isActive ? 'is-active' : ''}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={handleAnchorClick}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
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
          {NAV_LINKS.map(link => {
            const isActive = activeSection === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={isActive ? 'is-active' : ''}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={onNavClick}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles, Eye, ArrowRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import useDialog from '../hooks/useDialog';
import { HERO_PRODUCTS, DEFAULT_SIZE, formatPrice } from '../data/products';
import SizePicker from './SizePicker';
import './Hero.css';

const MODEL_COUNT = HERO_PRODUCTS.length;
const FOREGROUND_STAGE = MODEL_COUNT - 1;
const INITIAL_FOREGROUND = FOREGROUND_STAGE;
const CYCLE_MS = 4500;

// Stage each model sits on when `foregroundIdx` is in front. Matches what
// repeated cycleNext() calls produce, so jumps and auto-cycling agree.
const positionsFor = (foregroundIdx) =>
  HERO_PRODUCTS.map((_, m) => (m - foregroundIdx + FOREGROUND_STAGE + MODEL_COUNT) % MODEL_COUNT);

const ProductModal = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [size, setSize] = useState(DEFAULT_SIZE);
  const closeBtnRef = useRef(null);
  const dialogRef = useDialog(true, onClose, closeBtnRef);
  const titleId = `modal-title-${product.id}`;

  const handleAdd = () => {
    addItem(product, size);
    onClose();
  };

  // Portaled to <body> so the overlay covers the viewport regardless of
  // transforms/overflow on the hero and frame.
  return createPortal(
    <div className="product-modal-overlay" onClick={onClose}>
      <div
        className="product-modal-card"
        ref={dialogRef}
        onClick={e => e.stopPropagation()}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button ref={closeBtnRef} type="button" className="modal-close-btn" onClick={onClose} aria-label="Close product preview">
          <X size={20} />
        </button>
        <div className="modal-body">
          <div className="modal-img-wrapper">
            <img src={product.img} alt={`${product.title} in ${product.color}`} />
          </div>
          <div className="modal-info">
            <span className="modal-tag">{product.tag}</span>
            <h2 id={titleId}>{product.title}</h2>
            <p className="modal-sub">{product.subtitle} · {product.color}</p>
            <div className="modal-price">{formatPrice(product.price)}</div>
            <p className="modal-desc">
              Designed for effortless elegance and timeless style. Hand-finished with premium sustainable fabrics.
            </p>
            <div className="modal-size">
              <SizePicker value={size} onChange={setSize} />
            </div>
            <div className="modal-actions">
              <button type="button" className="modal-add-cart" onClick={handleAdd}>
                <span>Add to Bag · {size}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  const modelElsRef = useRef([]);
  const [activeMainIndex, setActiveMainIndex] = useState(INITIAL_FOREGROUND);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const currentPositionsRef = useRef(positionsFor(INITIAL_FOREGROUND));
  const isPausedRef = useRef(false);
  // Set by the matchMedia context (desktop path animation or mobile cycling).
  const goToRef = useRef(null);
  const touchStartXRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 769px)",
      // Only so the callback runs on phones: matchMedia skips it when no
      // condition matches.
      isMobile: "(max-width: 768px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      const { isDesktop, reduceMotion } = context.conditions;

      // Mobile: CSS crossfades the foreground look; JS only advances it.
      if (!isDesktop) {
        let timer;
        const setLook = (idx) => {
          currentPositionsRef.current = positionsFor(idx);
          setActiveMainIndex(idx);
        };
        const restart = () => {
          clearInterval(timer);
          if (reduceMotion) return;
          timer = setInterval(() => {
            if (isPausedRef.current) return;
            const current = currentPositionsRef.current.indexOf(FOREGROUND_STAGE);
            setLook((current + MODEL_COUNT - 1) % MODEL_COUNT);
          }, CYCLE_MS);
        };
        goToRef.current = (idx) => { setLook(idx); restart(); };
        restart();
        return () => {
          clearInterval(timer);
          goToRef.current = null;
        };
      }

      // Intro animation timeline
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo('.reveal-text',
        { y: reduceMotion ? 0 : 50, opacity: 0 },
        { y: 0, opacity: 1, duration: reduceMotion ? 0.4 : 1.1, stagger: reduceMotion ? 0 : 0.12, ease: 'power3.out' },
        0
      );

      tl.fromTo('.decor-element',
        { scale: reduceMotion ? 1 : 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: reduceMotion ? 0.4 : 0.7, stagger: reduceMotion ? 0 : 0.15, ease: reduceMotion ? 'none' : 'back.out(1.7)' },
        0.4
      );

      // Define 4 path stages across screen from left to right
      const stages = [
        { left: '4%', height: '210px', scale: 0.75, opacity: 0.85, zIndex: 5 },
        { left: '22%', height: '320px', scale: 0.88, opacity: 0.95, zIndex: 10 },
        { left: '42%', height: '410px', scale: 0.98, opacity: 1, zIndex: 15 },
        { left: '68%', height: '520px', scale: 1.12, opacity: 1, zIndex: 25 }
      ];

      // Initial layout setup
      modelElsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, stages[currentPositionsRef.current[i]]);
      });

      const moveTo = (el, stage, duration, ease) => {
        gsap.killTweensOf(el);
        gsap.to(el, { ...stage, duration: reduceMotion ? 0.3 : duration, ease });
      };

      // Path cycling function
      const cycleNext = () => {
        currentPositionsRef.current = currentPositionsRef.current.map(pos => (pos + 1) % MODEL_COUNT);
        setActiveMainIndex(currentPositionsRef.current.indexOf(FOREGROUND_STAGE));

        modelElsRef.current.forEach((el, modelIdx) => {
          if (!el) return;
          const targetStageIdx = currentPositionsRef.current[modelIdx];
          const targetStage = stages[targetStageIdx];

          if (targetStageIdx === 0 && !reduceMotion) {
            // Foreground model exits right, then re-enters at the back.
            gsap.killTweensOf(el);
            gsap.to(el, {
              left: '105%',
              opacity: 0,
              scale: 1.2,
              duration: 1.1,
              ease: 'power2.in',
              onComplete: () => {
                gsap.set(el, { left: '-10%', scale: 0.6, opacity: 0, zIndex: 5 });
                gsap.to(el, { ...targetStage, duration: 1.1, ease: 'power2.out' });
              }
            });
          } else {
            moveTo(el, targetStage, 2.0, 'power3.inOut');
          }
        });
      };

      let pathInterval;
      const restartCycle = () => {
        clearInterval(pathInterval);
        pathInterval = setInterval(() => {
          if (!isPausedRef.current) cycleNext();
        }, CYCLE_MS);
      };
      restartCycle();

      // Jump straight to a model (progress dots).
      goToRef.current = (foregroundIdx) => {
        if (currentPositionsRef.current[foregroundIdx] === FOREGROUND_STAGE) return;
        const nextUp = (currentPositionsRef.current.indexOf(FOREGROUND_STAGE) + MODEL_COUNT - 1) % MODEL_COUNT;
        if (foregroundIdx === nextUp) {
          cycleNext();
        } else {
          currentPositionsRef.current = positionsFor(foregroundIdx);
          setActiveMainIndex(foregroundIdx);
          modelElsRef.current.forEach((el, modelIdx) => {
            if (el) moveTo(el, stages[currentPositionsRef.current[modelIdx]], 1.2, 'power3.inOut');
          });
        }
        restartCycle();
      };

      // Smooth mouse parallax (disabled for reduced motion)
      let handleMouseMove;
      if (!reduceMotion) {
        const xToHeadline = gsap.quickTo('.hero-center-text', 'x', { duration: 0.8, ease: 'power3' });
        const yToHeadline = gsap.quickTo('.hero-center-text', 'y', { duration: 0.8, ease: 'power3' });
        const xToModels = gsap.quickTo('.hero-models-path', 'x', { duration: 0.5, ease: 'power3' });
        const yToModels = gsap.quickTo('.hero-models-path', 'y', { duration: 0.5, ease: 'power3' });

        handleMouseMove = (e) => {
          const { innerWidth, innerHeight } = window;
          const x = (e.clientX / innerWidth - 0.5);
          const y = (e.clientY / innerHeight - 0.5);

          xToHeadline(x * -18);
          yToHeadline(y * -18);
          xToModels(x * 22);
          yToModels(y * 22);
        };
        window.addEventListener('mousemove', handleMouseMove);
      }

      return () => {
        clearInterval(pathInterval);
        goToRef.current = null;
        if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      };
    });

  }, { scope: heroRef });

  const showModel = (idx) => {
    if (goToRef.current) {
      goToRef.current(idx);
    } else {
      currentPositionsRef.current = positionsFor(idx);
      setActiveMainIndex(idx);
    }
  };

  // Swipe between looks on touch screens (the stage only takes pointer
  // events on mobile).
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(dx) < 40) return;
    const step = dx < 0 ? MODEL_COUNT - 1 : 1;
    showModel((activeMainIndex + step) % MODEL_COUNT);
  };

  const activeProduct = HERO_PRODUCTS[activeMainIndex];

  return (
    <section className="hero" ref={heroRef} aria-label="Featured looks">
      {/* Decorative Sparkles Top Left */}
      <div className="decor-element decor-sparkles-left" aria-hidden="true">
        <Sparkles size={28} color="var(--accent)" strokeWidth={1.5} />
        <Sparkles size={16} color="var(--accent)" strokeWidth={1.5} style={{ marginLeft: '-10px', marginTop: '-14px' }} />
      </div>

      {/* Decorative Star Top Right */}
      <div className="decor-element decor-star-right" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#6E7B62"/>
        </svg>
      </div>

      {/* CENTERED EDITORIAL TYPOGRAPHY - Single H1 for SEO */}
      <h1 className="hero-center-text">
        <span className="text-display reveal-text">Modern</span>
        <span className="text-display reveal-text">Women</span>
        <span className="text-display reveal-text">Cloth</span>
      </h1>

      {/* HERO MODELS PATH TRACK */}
      <div
        className="hero-models-path"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {HERO_PRODUCTS.map((item, index) => (
          <div
            key={item.id}
            className={`hero-path-model ${index === activeMainIndex ? 'is-foreground' : ''}`}
            ref={el => { modelElsRef.current[index] = el; }}
            aria-hidden={index !== activeMainIndex}
          >
            <img
              src={item.img}
              alt={`Model wearing the ${item.title} in ${item.color}`}
              // Only the model that starts in the foreground is the LCP candidate.
              fetchPriority={index === INITIAL_FOREGROUND ? 'high' : 'auto'}
              decoding="async"
            />
          </div>
        ))}

        {/* FLOATING LIQUID GLASS PRODUCT BADGE */}
        <div className="hero-floating-badge decor-element" aria-live="polite">
          <div className="hfb-badge-tag">{activeProduct.tag}</div>
          <div className="hfb-content">
            <div className="hfb-text">
              <span className="hfb-title">{activeProduct.title}</span>
              <span className="hfb-subtitle">{activeProduct.subtitle}</span>
              <span className="hfb-price">{formatPrice(activeProduct.price)}</span>
            </div>
            <button
              type="button"
              className="hfb-btn"
              onClick={() => setSelectedProduct(activeProduct)}
              aria-label={`View ${activeProduct.title}`}
            >
              <span>view item</span>
              <Eye size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* TOP LEFT PHILOSOPHY TEXT WITH SAFE SPACING */}
      <div className="hero-top-left">
        <div className="hero-subtext-card">
          <p className="hero-subtext text-sans reveal-text">
            We Do Not Divide Our Collections Into Seasons. We Create New Models Every Week, In A Few Items Each.
          </p>
          <div className="hero-doodle" aria-hidden="true">
            <svg width="60" height="24" viewBox="0 0 100 40" fill="none">
              <path d="M5 20 Q 25 5 45 20 T 85 20 Q 95 30 75 35" stroke="#4A5639" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE INDICATOR & DOODLE */}
      <div className="hero-indicators-right">
        <div className="hero-doodle-right" aria-hidden="true">
          <svg width="36" height="60" viewBox="0 0 40 100" fill="none">
            <path d="M20 5 Q 35 25 20 45 T 20 85" stroke="#9EAB90" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        <div className="hero-progress-dots" role="group" aria-label="Choose featured look">
          {HERO_PRODUCTS.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              className={`progress-dot ${idx === activeMainIndex ? 'active' : ''}`}
              aria-label={`Show ${m.title}`}
              aria-current={idx === activeMainIndex ? 'true' : undefined}
              onClick={() => showModel(idx)}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
};

export default Hero;

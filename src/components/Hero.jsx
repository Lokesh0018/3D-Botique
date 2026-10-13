import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles, Eye, ArrowRight, X } from 'lucide-react';
import model1 from '../assets/fashion-1.webp';
import model2 from '../assets/fashion-2.webp';
import model3 from '../assets/fashion-3.webp';
import model4 from '../assets/fashion-4.webp';
import './Hero.css';

const modelsData = [
  {
    id: 1,
    img: model4,
    title: "Vintage Style",
    subtitle: "modern Fashion",
    price: "$180.00",
    color: "Earth Beige",
    tag: "New Arrival"
  },
  {
    id: 2,
    img: model1,
    title: "Pastel Trouser",
    subtitle: "Skirt Combo",
    price: "$240.00",
    color: "Pastel Pink",
    tag: "Best Seller"
  },
  {
    id: 3,
    img: model2,
    title: "Cream & Green",
    subtitle: "Combo Cloth",
    price: "$320.00",
    color: "Sage Green",
    tag: "Trending"
  },
  {
    id: 4,
    img: model3,
    title: "Lime Green",
    subtitle: "modern Blouse",
    price: "$120.00",
    color: "Lime & Violet",
    tag: "Featured"
  }
];

const Hero = () => {
  const heroRef = useRef(null);
  const modelElsRef = useRef([]);
  const [activeMainIndex, setActiveMainIndex] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const currentPositionsRef = useRef([0, 1, 2, 3]);
  const isPausedRef = useRef(false);

  // Handle Escape key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Manage focus when modal opens
  React.useEffect(() => {
    if (selectedProduct) {
      const closeBtn = document.querySelector('.modal-close-btn');
      if (closeBtn) closeBtn.focus();
    }
  }, [selectedProduct]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 769px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      const { isDesktop, reduceMotion } = context.conditions;
      if (!isDesktop) return;

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
        const st = stages[i];
        gsap.set(el, {
          left: st.left,
          height: st.height,
          scale: st.scale,
          opacity: st.opacity,
          zIndex: st.zIndex
        });
      });

      // Path cycling function
      const cycleNext = () => {
        const newPositions = currentPositionsRef.current.map(pos => (pos + 1) % 4);
        currentPositionsRef.current = newPositions;

        const foregroundIdx = currentPositionsRef.current.indexOf(3);
        setActiveMainIndex(foregroundIdx);

        modelElsRef.current.forEach((el, modelIdx) => {
          if (!el) return;
          const targetStageIdx = currentPositionsRef.current[modelIdx];
          const targetStage = stages[targetStageIdx];

          if (targetStageIdx === 0) {
            gsap.to(el, {
              left: '105%',
              opacity: 0,
              scale: 1.2,
              duration: 1.1,
              ease: 'power2.in',
              onComplete: () => {
                gsap.set(el, { left: '-10%', scale: 0.6, opacity: 0, zIndex: 5 });
                gsap.to(el, {
                  left: targetStage.left,
                  height: targetStage.height,
                  scale: targetStage.scale,
                  opacity: targetStage.opacity,
                  zIndex: targetStage.zIndex,
                  duration: 1.1,
                  ease: 'power2.out'
                });
              }
            });
          } else {
            gsap.to(el, {
              left: targetStage.left,
              height: targetStage.height,
              scale: targetStage.scale,
              opacity: targetStage.opacity,
              zIndex: targetStage.zIndex,
              duration: 2.0,
              ease: 'power3.inOut'
            });
          }
        });
      };

      const pathInterval = setInterval(() => {
        if (!isPausedRef.current) cycleNext();
      }, 4500);

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
        if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      };
    });

  }, { scope: heroRef });

  const activeProduct = modelsData[activeMainIndex];

  return (
    <section className="hero" ref={heroRef} aria-label="Hero Spotlight Section">
      {/* Decorative Sparkles Top Left */}
      <div className="decor-element decor-sparkles-left" aria-hidden="true">
        <Sparkles size={28} color="#C4765D" strokeWidth={1.5} />
        <Sparkles size={16} color="#C4765D" strokeWidth={1.5} style={{ marginLeft: '-10px', marginTop: '-14px' }} />
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
        onMouseEnter={() => isPausedRef.current = true}
        onMouseLeave={() => isPausedRef.current = false}
      >
        {modelsData.map((item, index) => (
          <div
            key={item.id}
            className="hero-path-model"
            ref={el => modelElsRef.current[index] = el}
          >
            <img 
              src={item.img} 
              alt={`Fashion model showing ${item.title}`} 
              fetchPriority="high" 
              decoding="async" 
            />
          </div>
        ))}

        {/* FLOATING LIQUID GLASS PRODUCT BADGE */}
        <div className="hero-floating-badge decor-element">
          <div className="hfb-badge-tag">{activeProduct.tag}</div>
          <div className="hfb-content">
            <div className="hfb-text">
              <span className="hfb-title">{activeProduct.title}</span>
              <span className="hfb-subtitle">{activeProduct.subtitle}</span>
              <span className="hfb-price">{activeProduct.price}</span>
            </div>
            <button 
              className="hfb-btn"
              onClick={() => setSelectedProduct(activeProduct)}
              aria-label={`View item ${activeProduct.title}`}
            >
              <span>view item</span>
              <Eye size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* TOP LEFT PHILOSOPHY TEXT WITH SAFE SPACING */}
      <div className="hero-top-left">
        <div className="hero-subtext-card">
          <p className="hero-subtext text-sans reveal-text">
            We Do Not Divide Our Collections To Seasons. We Create New Models Every Week, And We In A Few Items.
          </p>
          <div className="hero-doodle">
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

        <div className="hero-progress-dots">
          {modelsData.map((m, idx) => (
            <button
              key={m.id}
              className={`progress-dot ${idx === activeMainIndex ? 'active' : ''}`}
              aria-label={`Spotlight product ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* QUICK PRODUCT PREVIEW MODAL (UI/UX Pro Max interaction) */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div 
            className="product-modal-card" 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)} aria-label="Close modal">
              <X size={20} />
            </button>
            <div className="modal-body">
              <div className="modal-img-wrapper">
                <img src={selectedProduct.img} alt={`Preview of ${selectedProduct.title}`} />
              </div>
              <div className="modal-info">
                <span className="modal-tag">{selectedProduct.tag}</span>
                <h2 id="modal-title">{selectedProduct.title}</h2>
                <p className="modal-sub">{selectedProduct.subtitle}</p>
                <div className="modal-price">{selectedProduct.price}</div>
                <p className="modal-desc">
                  Designed for effortless elegance and timeless style. Hand-finished with premium sustainable fabrics.
                </p>
                <div className="modal-actions">
                  <button className="modal-add-cart">
                    <span>Add to Bag</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;




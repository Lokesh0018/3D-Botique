import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Star, Check, Plus, Box, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, DEFAULT_SIZE, FREE_SHIPPING_THRESHOLD, formatPrice } from '../data/products';
import { prefersReducedMotion } from '../lib/motion';
import SizePicker from './SizePicker';
import './ProductShowcase.css';

// three.js is only downloaded when someone opens the 3D view.
const ProductViewer3D = lazy(() => import('./ProductViewer3D'));

const PRODUCT = PRODUCTS.limeBlouse;
const PAIRS_WITH = [PRODUCTS.pastelCombo, PRODUCTS.creamGreen];

const ProductShowcase = () => {
  const containerRef = useRef(null);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(DEFAULT_SIZE);
  const [view, setView] = useState('photo'); // photo | 3d
  const [added, setAdded] = useState(false);
  const addedTimer = useRef(null);

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const handleBuy = () => {
    addItem(PRODUCT, selectedSize);
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2000);
  };

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo('.ps-reveal',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%'
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section className="product-showcase" id="product" ref={containerRef} aria-labelledby="ps-title">
      <div className="ps-left">
        <div className="ps-info-block ps-reveal">
          <h2 id="ps-title" className="text-display ps-title">Lime Green<br/>Tied Blouse</h2>
          <p className="text-sans ps-desc">
            We Do Have Ready To Cut Collections In Stock & Exclusively Develop New Styles. We Guarantee Timely Delivery, Carry Stock, And Work In New Styles.
          </p>
        </div>

        <div className="ps-pairs ps-reveal">
          <span className="uppercase-meta ps-pairs-label">Complete The Look</span>
          <ul className="ps-thumbnails">
            {PAIRS_WITH.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  className="thumb-item"
                  style={{ backgroundColor: item.bg }}
                  onClick={() => addItem(item)}
                  aria-label={`Add ${item.title}, ${formatPrice(item.price)}, to bag`}
                >
                  <img src={item.img} alt="" loading="lazy" decoding="async" />
                  <span className="thumb-add" aria-hidden="true"><Plus size={14} /></span>
                </button>
                <span className="thumb-caption text-sans" aria-hidden="true">{formatPrice(item.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ps-center ps-reveal">
        <div className="ps-main-image">
          {view === 'photo' ? (
            <img src={PRODUCT.img} alt={`${PRODUCT.title}, front view`} loading="lazy" decoding="async" />
          ) : (
            <Suspense fallback={<div className="ps-viewer-loading">Loading 3D view…</div>}>
              <ProductViewer3D image={PRODUCT.img} label={PRODUCT.title} />
            </Suspense>
          )}

          <div className="decor-star" aria-hidden="true">
            <Star size={32} fill="var(--star)" color="var(--star)" />
          </div>

          <div className="ps-view-toggle" role="group" aria-label="Product view">
            <button
              type="button"
              aria-pressed={view === 'photo'}
              className={view === 'photo' ? 'active' : ''}
              onClick={() => setView('photo')}
            >
              <ImageIcon size={14} aria-hidden="true" /> Photo
            </button>
            <button
              type="button"
              aria-pressed={view === '3d'}
              className={view === '3d' ? 'active' : ''}
              onClick={() => setView('3d')}
            >
              <Box size={14} aria-hidden="true" /> 3D
            </button>
          </div>
        </div>
      </div>

      <div className="ps-right">
        <div className="ps-info-block ps-reveal">
          <div className="text-display ps-price">{formatPrice(PRODUCT.price)}</div>
          <p className="text-sans ps-shipping">
            Free Express Shipping On All Orders Over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
          </p>

          <div className="selectors">
            <SizePicker value={selectedSize} onChange={setSelectedSize} />
          </div>

          <button
            type="button"
            className={`add-to-cart-btn ${added ? 'added' : ''}`}
            onClick={handleBuy}
            aria-live="polite"
          >
            {added ? `Added · Size ${selectedSize}` : 'Buy Product'}
            {added ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

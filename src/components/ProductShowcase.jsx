import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Star, Check, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, DEFAULT_SIZE, FREE_SHIPPING_THRESHOLD, formatPrice } from '../data/products';
import { prefersReducedMotion } from '../lib/motion';
import SizePicker from './SizePicker';
import './ProductShowcase.css';

const LOOK_ITEMS = [
  PRODUCTS.limeBlouse,
  PRODUCTS.pastelCombo,
  PRODUCTS.creamGreen,
  PRODUCTS.vintageStyle,
];

const ProductShowcase = () => {
  const containerRef = useRef(null);
  const { addItem } = useCart();
  const [currentProduct, setCurrentProduct] = useState(PRODUCTS.limeBlouse);
  const [selectedSize, setSelectedSize] = useState(DEFAULT_SIZE);
  const [added, setAdded] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const addedTimer = useRef(null);

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const handleSelectProduct = (product) => {
    if (product.id === currentProduct.id) return;
    setIsChanging(true);
    setTimeout(() => {
      setCurrentProduct(product);
      setIsChanging(false);
    }, 180);
  };

  const handleBuy = () => {
    addItem(currentProduct, selectedSize);
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2000);
  };

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addItem(product, DEFAULT_SIZE);
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
        <div className={`ps-info-block ps-reveal ${isChanging ? 'ps-changing' : ''}`}>
          <h2 id="ps-title" className="text-display ps-title">{currentProduct.title}</h2>
          <p className="text-sans ps-desc">
            We Do Have Ready To Cut Collections In Stock & Exclusively Develop New Styles. We Guarantee Timely Delivery, Carry Stock, And Work In New Styles.
          </p>
        </div>

        <div className="ps-pairs ps-reveal">
          <span className="uppercase-meta ps-pairs-label">Complete The Look</span>
          <ul className="ps-thumbnails">
            {LOOK_ITEMS.map(item => {
              const isCurrent = item.id === currentProduct.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`thumb-item ${isCurrent ? 'is-selected' : ''}`}
                    style={{ backgroundColor: item.bg }}
                    onClick={() => handleSelectProduct(item)}
                    aria-label={`View ${item.title} (${formatPrice(item.price)}) in showcase`}
                    aria-pressed={isCurrent}
                  >
                    <img src={item.img} alt="" loading="lazy" decoding="async" />
                    <span
                      className="thumb-add"
                      onClick={(e) => handleQuickAdd(e, item)}
                      title={`Quick add ${item.title} to bag`}
                      aria-label={`Add ${item.title} to bag`}
                    >
                      <Plus size={14} />
                    </span>
                  </button>
                  <span className="thumb-caption text-sans" aria-hidden="true">{formatPrice(item.price)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="ps-center ps-reveal">
        <div
          className={`ps-main-image ${isChanging ? 'is-fading' : ''}`}
          style={{ backgroundColor: currentProduct.bg }}
        >
          <img
            key={currentProduct.id}
            src={currentProduct.img}
            alt={`${currentProduct.title}, front view`}
            loading="lazy"
            decoding="async"
            className="ps-hero-img"
          />

          <div className="decor-star" aria-hidden="true">
            <Star size={32} fill="var(--star)" color="var(--star)" />
          </div>
        </div>
      </div>

      <div className="ps-right">
        <div className={`ps-info-block ps-reveal ${isChanging ? 'ps-changing' : ''}`}>
          <div className="text-display ps-price">{formatPrice(currentProduct.price)}</div>
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

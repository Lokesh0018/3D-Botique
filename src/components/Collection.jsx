import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Leaf, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { COLLECTION_PRODUCTS, formatPrice } from '../data/products';
import { prefersReducedMotion } from '../lib/motion';
import './Collection.css';

const Collection = () => {
  const containerRef = useRef(null);
  const { addItem } = useCart();

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.utils.toArray('.collection-card').forEach(card => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section className="collection-section" id="collections" ref={containerRef} aria-labelledby="collection-title">
      <div className="collection-header">
        <div className="header-icon" aria-hidden="true">
          <Leaf size={24} color="var(--olive-soft)" />
        </div>
        <h2 id="collection-title" className="text-display section-title">Hottest Picks Of The Season</h2>
        <p className="text-sans section-desc">
          Discover The Hottest Fashion Picks Of The Season, Featuring Trends From Unexpected Combos To Statement Pieces, Our Selections Are Curated To Keep You Stylish And Chic.
        </p>
      </div>

      <ul className="collection-grid">
        {COLLECTION_PRODUCTS.map((product) => (
          <li key={product.id} className="collection-card">
            <div className="card-img-wrapper" style={{ backgroundColor: product.bg }}>
              <div className="img-placeholder">
                <img src={product.img} alt={`${product.title} in ${product.color}`} loading="lazy" decoding="async" />
              </div>
              <button
                type="button"
                className="card-quick-add"
                onClick={() => addItem(product)}
                aria-label={`Add ${product.title} to bag, size M`}
              >
                <Plus size={16} aria-hidden="true" />
                <span>Add to bag</span>
              </button>
            </div>
            <div className="card-info">
              <h3 className="card-title text-sans">{product.title}</h3>
              <div className="card-price text-sans">{formatPrice(product.price)}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Collection;

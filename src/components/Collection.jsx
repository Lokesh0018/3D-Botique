import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Leaf } from 'lucide-react';
import img1 from '../assets/fashion-1.webp';
import img2 from '../assets/fashion-2.webp';
import img3 from '../assets/fashion-3.webp';
import './Collection.css';

const Collection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray('.collection-card');
    cards.forEach((card, i) => {
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

  const products = [
    { id: 1, title: 'Pastel Square & Skirt Combo', price: '$240.00', img: img1, bg: '#F4E9E6' },
    { id: 2, title: 'Lime Green Combo Blouse', price: '$320.00', img: img2, bg: '#EAF0E4' },
    { id: 3, title: 'Lime & Vintage Modern Cloth', price: '$850.00', img: img3, bg: '#F2E8FA' }
  ];

  return (
    <section className="collection-section" id="collections" ref={containerRef}>
      <div className="collection-header">
        <div className="header-icon">
          <Leaf size={24} color="#8A9A74" />
        </div>
        <h2 className="text-display section-title" style={{ color: '#2C3A29' }}>Hottest Picks Of The Season</h2>
        <p className="text-sans section-desc">
          Discover The Hottest Fashion Picks Of The Season, Featuring Trends From Unexpected Combos To Statement Pieces, Our Selections Are Curated To Keep You Stylish And Chic.
        </p>
      </div>

      <div className="collection-grid">
        {products.map((product) => (
          <div key={product.id} className="collection-card">
            <div className="card-img-wrapper" style={{ backgroundColor: product.bg }}>
              <div className="img-placeholder" style={{ backgroundColor: 'transparent' }}>
                <img src={product.img} alt={product.title} />
              </div>
            </div>
            <div className="card-info">
              <h3 className="card-title text-sans">{product.title}</h3>
              <div className="card-price text-sans">{product.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Collection;

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Star } from 'lucide-react';
import blouseImg from '../assets/fashion-3.webp';
import accessory1 from '../assets/fashion-1.webp';
import accessory2 from '../assets/fashion-2.webp';
import './ProductShowcase.css';

const ProductShowcase = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
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
    <section className="product-showcase" ref={containerRef}>
      <div className="ps-left">
        <div className="ps-info-block ps-reveal">
          <h2 className="text-display ps-title" style={{ color: '#5C6B46' }}>Lime Green<br/>Tied Blouse</h2>
          <p className="text-sans ps-desc" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            We Do Have Ready To Cut Collections In Stock & Exclusively Develop New Styles. We Guarantee Timely Delivery, Carry Stock, And Work In New Styles.
          </p>
        </div>
        
        <div className="ps-thumbnails ps-reveal">
          <div className="thumb-item" style={{ backgroundColor: '#EAF0E4', overflow: 'hidden' }}>
            <img src={accessory1} alt="Accessory 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="thumb-item" style={{ backgroundColor: '#F8F9F3', overflow: 'hidden' }}>
            <img src={accessory2} alt="Accessory 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
      
      <div className="ps-center ps-reveal">
        <div className="ps-main-image" style={{ backgroundColor: '#F1ECFA', overflow: 'hidden' }}>
          <img src={blouseImg} alt="Lime Green Tied Blouse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          
          <div className="decor-star">
            <Star size={32} fill="#F9D461" color="#F9D461" />
          </div>
        </div>
      </div>
      
      <div className="ps-right">
        <div className="ps-info-block ps-reveal">
          <div className="text-display" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>$175.00</div>
          <p className="text-sans" style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Free Express Shipping On All Orders Over $200.
          </p>
          
          <div className="selectors">
            <div className="selector-group">
              <span className="uppercase-meta selector-label">Select Size</span>
              <div className="size-options">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button key={size} className={`size-btn ${size === 'M' ? 'active' : ''}`}>{size}</button>
                ))}
              </div>
            </div>
            
            <div className="selector-group" style={{ marginTop: '2rem' }}>
              <span className="uppercase-meta selector-label">Select Color</span>
              <div className="color-options">
                <button className="color-btn" style={{ backgroundColor: '#D9E3CC' }}></button>
                <button className="color-btn" style={{ backgroundColor: '#EAD3A6' }}></button>
                <button className="color-btn" style={{ backgroundColor: '#B8C7E0' }}></button>
                <button className="color-btn" style={{ backgroundColor: '#E8D2EC' }}></button>
              </div>
            </div>
          </div>
          
          <button className="add-to-cart-btn">
            Buy Product <span>+</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

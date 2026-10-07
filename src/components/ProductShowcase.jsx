import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './ProductShowcase.css';

const ProductShowcase = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Subtle reveal for text
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
          <h3 className="text-display ps-title">THE SIGNATURE<br/>TRENCH</h3>
          <p className="text-sans ps-desc">
            Crafted from heavy-weight organic cotton gabardine, featuring a relaxed silhouette and storm flap details.
          </p>
        </div>
        
        <div className="ps-info-block ps-reveal" style={{ marginTop: 'auto' }}>
          <div className="uppercase-meta">Material</div>
          <p className="text-sans">100% Organic Cotton</p>
        </div>
      </div>
      
      <div className="ps-center">
        <div className="ps-img-wrapper">
          <div className="img-placeholder">
            product-main.webp
            <img src="/assets/products/product-main.webp" alt="Signature Trench" />
          </div>
        </div>
      </div>
      
      <div className="ps-right">
        <div className="ps-info-block ps-reveal text-right">
          <div className="text-display" style={{ fontSize: '2rem' }}>$450</div>
        </div>
        
        <div className="ps-info-block ps-reveal text-right" style={{ marginTop: 'auto' }}>
          <a href="#" className="uppercase-meta ps-link">View Details →</a>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

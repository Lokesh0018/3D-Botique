import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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
          duration: 1, 
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
    <section className="collection-section" id="collections" ref={containerRef}>
      <div className="section-header">
        <h2 className="text-display section-title">Hottest Picks<br/>of the Season</h2>
        <a href="#" className="uppercase-meta view-all">View Full Collection →</a>
      </div>

      <div className="collection-grid">
        {[1, 2, 3].map((num) => (
          <div key={num} className="collection-card">
            <div className="card-img-wrapper">
              <div className="img-placeholder">
                collection-0{num}.webp
                <img src={`/assets/collection/collection-0${num}.webp`} alt="" />
              </div>
            </div>
            <div className="card-info">
              <div className="card-meta uppercase-meta">Autumn/Winter</div>
              <h3 className="card-title text-display">Look {num}</h3>
              <div className="card-arrow">↗</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Collection;

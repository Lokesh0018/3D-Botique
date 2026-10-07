import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Community.css';

const Community = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.community-quote',
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0, duration: 1.5, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%'
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section className="community" ref={containerRef}>
      <div className="community-testimonial">
        <h2 className="text-display community-quote">
          "The pieces feel like they were made specifically for me. Effortless, elegant, and timeless."
        </h2>
        
        <div className="community-person">
          <div className="person-avatar">
            <div className="img-placeholder">
              people-01.webp
              <img src="/assets/people/people-01.webp" alt="Sarah J." />
            </div>
          </div>
          <div className="person-info">
            <div className="text-sans" style={{ fontWeight: 500 }}>Sarah J.</div>
            <div className="uppercase-meta" style={{ color: 'var(--text-secondary)' }}>New York</div>
          </div>
        </div>
      </div>
      
      <div className="community-finale">
        <h2 className="text-display finale-title">WHEREVER YOU GO,<br/>TAKE THE STORY WITH YOU.</h2>
      </div>
    </section>
  );
};

export default Community;

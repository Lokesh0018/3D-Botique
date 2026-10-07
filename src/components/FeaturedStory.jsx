import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './FeaturedStory.css';

const FeaturedStory = () => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);

  useGSAP(() => {
    // Parallax & scale effect on the main image
    gsap.fromTo(imgRef.current,
      { scale: 1 },
      {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="featured-story" ref={sectionRef}>
      <div className="fs-img-container">
        <div className="img-placeholder" ref={imgRef}>
          story-main.webp
          <img src="/assets/journal/story-main.webp" alt="The Art of Slow Travel" />
        </div>
      </div>
      <div className="fs-overlay">
        <div className="fs-content">
          <span className="uppercase-meta">Editorial</span>
          <h2 className="text-display fs-title">THE ART<br/>OF SLOW TRAVEL</h2>
          <p className="text-sans fs-desc">
            Embracing the journey over the destination. A meditative exploration of movement and stillness.
          </p>
          <a href="#" className="uppercase-meta fs-link">Read Story →</a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStory;

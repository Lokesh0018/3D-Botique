import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import storyImg from '../assets/fashion-4.webp';
import { handleAnchorClick } from '../lib/smoothScroll';
import { prefersReducedMotion } from '../lib/motion';
import './FeaturedStory.css';

const FeaturedStory = () => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
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
    <section className="featured-story" id="culture" ref={sectionRef} aria-labelledby="culture-title">
      <div className="fs-img-container">
        <div className="img-placeholder fs-img" ref={imgRef}>
          <img src={storyImg} alt="Model in an earth beige vintage outfit, walking slowly" loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="fs-overlay">
        <div className="fs-content">
          <span className="uppercase-meta">Editorial</span>
          <h2 id="culture-title" className="text-display fs-title">THE ART<br/>OF SLOW TRAVEL</h2>
          <p className="text-sans fs-desc">
            Embracing the journey over the destination. A meditative exploration of movement and stillness.
          </p>
          <a href="#journal" className="uppercase-meta fs-link" onClick={handleAnchorClick}>
            Read The Journal <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStory;

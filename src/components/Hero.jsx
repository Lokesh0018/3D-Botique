import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const mainImgRef = useRef(null);
  const fgImgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.7 });

      // Typography reveal
      tl.fromTo('.reveal-text', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power4.out' },
        0
      );

      // Main image entrance
      tl.fromTo(mainImgRef.current,
        { scale: 1.1, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' },
        0.2
      );

      // Foreground image entrance (2.5D effect)
      tl.fromTo(fgImgRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.4, ease: 'power3.out' },
        0.4
      );

      // Parallax on scroll
      gsap.to(mainImgRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(fgImgRef.current, {
        yPercent: -20, // moves faster to create depth
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      {/* Background layer for hero */}
      <div className="hero-bg-layer"></div>

      <div className="hero-content">
        <div className="hero-typography" ref={headlineRef}>
          <div className="overflow-hidden">
            <h1 className="text-display reveal-text">THE WORLD</h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-display reveal-text" style={{ marginLeft: '10%' }}>IN MOTION</h1>
          </div>
          <p className="hero-subtext text-sans reveal-text">
            Discover a curated collection of pieces that redefine modern elegance and effortless style.
          </p>
          <div className="hero-cta reveal-text">
            <span className="uppercase-meta">Explore Collection</span>
            <div className="cta-line"></div>
          </div>
        </div>

        <div className="hero-imagery">
          {/* Main background image within the frame constraints */}
          <div className="hero-main-img-wrapper">
            <div className="img-placeholder" ref={mainImgRef}>
              hero-main.webp
              <img src="/assets/hero/hero-main.webp" alt="" />
            </div>
          </div>
          
          {/* Foreground image that breaks out of the frame */}
          <div className="hero-fg-img-wrapper" ref={fgImgRef}>
            <div className="img-placeholder fg-placeholder">
              hero-foreground.webp
              <img src="/assets/hero/hero-foreground.webp" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

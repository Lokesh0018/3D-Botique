import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import { prefersReducedMotion } from '../lib/motion';
import './FloatingFrame.css';

const FloatingFrame = ({ children }) => {
  const frameRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    // One-time entrance only. The frame wraps every section, so leaving a
    // transform on it would make position:fixed descendants (ScrollTrigger
    // pins, overlays) position against the frame instead of the viewport —
    // clearProps removes the transform once the entrance finishes.
    const ctx = gsap.context(() => {
      gsap.fromTo(frameRef.current,
        { scale: 0.94, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power3.out',
          delay: 0.2,
          clearProps: 'transform,opacity',
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    }, frameRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="frame-wrapper" id="top">
      <div className="floating-frame" ref={frameRef}>
        <Navbar />
        <main className="frame-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FloatingFrame;

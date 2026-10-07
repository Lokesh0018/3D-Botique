import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from './Navbar';
import './FloatingFrame.css';

const FloatingFrame = ({ children }) => {
  const frameRef = useRef(null);

  useEffect(() => {
    // Initial entrance animation
    const ctx = gsap.context(() => {
      gsap.set(frameRef.current, {
        scale: 0.94,
        opacity: 0,
        y: 20
      });

      gsap.to(frameRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.2
      });
    }, frameRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="frame-wrapper">
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

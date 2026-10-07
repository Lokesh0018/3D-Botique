import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingFrame from './components/FloatingFrame';
import Hero from './components/Hero';
import Collection from './components/Collection';
import JournalSection from './components/JournalSection';
import FeaturedStory from './components/FeaturedStory';
import ProductShowcase from './components/ProductShowcase';
import Community from './components/Community';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP ScrollTrigger Integration
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      {/* Background layer outside the frame */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--bg-primary)',
          zIndex: -1
        }}
      />
      
      <FloatingFrame>
        <Hero />
        <Collection />
        <JournalSection />
        <FeaturedStory />
        <ProductShowcase />
        <Community />
        <Footer />
      </FloatingFrame>
    </>
  );
}

export default App;

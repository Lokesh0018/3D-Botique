import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartProvider } from './context/CartContext';
import { setLenis } from './lib/smoothScroll';
import { prefersReducedMotion } from './lib/motion';
import FloatingFrame from './components/FloatingFrame';
import Hero from './components/Hero';
import Collection from './components/Collection';
import JournalSection from './components/JournalSection';
import FeaturedStory from './components/FeaturedStory';
import ProductShowcase from './components/ProductShowcase';
import Community from './components/Community';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Native scrolling for reduced-motion users; ScrollTrigger still works without Lenis.
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    setLenis(lenis);

    // GSAP's ticker is the only driver of Lenis, so ScrollTrigger and Lenis
    // update in the same frame (a second requestAnimationFrame loop would
    // advance Lenis twice per frame).
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <CartProvider>
      {/* Background layer outside the frame */}
      <div className="app-backdrop" aria-hidden="true" />

      <FloatingFrame>
        <Hero />
        <Collection />
        <JournalSection />
        <FeaturedStory />
        <ProductShowcase />
        <Community />
        <Footer />
      </FloatingFrame>

      <CartDrawer />
    </CartProvider>
  );
}

export default App;

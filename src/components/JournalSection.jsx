import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import img1 from '../assets/fashion-1.webp';
import img2 from '../assets/fashion-2.webp';
import img3 from '../assets/fashion-3.webp';
import './JournalSection.css';

const destinations = [
  { id: 1, name: 'TOKYO', title: 'Neon & Silence', desc: 'A study in contrasts.', img: img1, bg: 'var(--swatch-blush)' },
  { id: 2, name: 'PARIS', title: 'The Old Guard', desc: 'Timeless elegance in modern forms.', img: img2, bg: 'var(--swatch-sage)' },
  { id: 3, name: 'MARRAKECH', title: 'Desert Hues', desc: 'Earthy tones and vibrant life.', img: img3, bg: 'var(--swatch-lilac)' },
];

const JournalSection = () => {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Horizontal pinned scroll on desktop only; below 769px the CSS stacks
    // the cards vertically and the page scrolls normally.
    mm.add('(min-width: 769px)', () => {
      const container = scrollRef.current;
      gsap.to(container, {
        x: () => -(container.scrollWidth - sectionRef.current.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${container.scrollWidth - sectionRef.current.clientWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });
    });
  }, { scope: sectionRef });

  return (
    <section className="journal-section" id="journal" ref={sectionRef} aria-labelledby="journal-title">
      <div className="journal-scroll-container" ref={scrollRef}>
        <div className="journal-intro">
          <h2 id="journal-title" className="text-display journal-main-title">THE<br/>JOURNAL</h2>
          <p className="text-sans">Explore stories from around the globe.</p>
        </div>

        {destinations.map((dest) => (
          <article key={dest.id} className="journal-card">
            <div className="journal-img-wrapper" style={{ backgroundColor: dest.bg }}>
              <div className="img-placeholder">
                <img src={dest.img} alt={`Editorial look photographed in ${dest.name.toLowerCase().replace(/^\w/, c => c.toUpperCase())}`} loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="journal-card-content">
              <div className="uppercase-meta">{dest.name}</div>
              <h3 className="text-display journal-card-title">{dest.title}</h3>
              <p className="text-sans journal-card-desc">{dest.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default JournalSection;

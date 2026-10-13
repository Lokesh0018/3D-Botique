import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import img1 from '../assets/fashion-1.webp';
import img2 from '../assets/fashion-2.webp';
import img3 from '../assets/fashion-3.webp';
import './JournalSection.css';

const destinations = [
  { id: 1, name: 'TOKYO', title: 'Neon & Silence', desc: 'A study in contrasts.', img: img1 },
  { id: 2, name: 'PARIS', title: 'The Old Guard', desc: 'Timeless elegance in modern forms.', img: img2 },
  { id: 3, name: 'MARRAKECH', title: 'Desert Hues', desc: 'Earthy tones and vibrant life.', img: img3 },
];

const JournalSection = () => {
  const scrollRef = useRef(null);

  useGSAP(() => {
    // Horizontal scroll effect
    const container = scrollRef.current;
    
    gsap.to(container, {
      x: () => -(container.scrollWidth - window.innerWidth + 100), // Approximate scroll distance
      ease: 'none',
      scrollTrigger: {
        trigger: '.journal-section',
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });
  }, { scope: scrollRef });

  return (
    <section className="journal-section" id="journal">
      <div className="journal-scroll-container" ref={scrollRef}>
        <div className="journal-intro">
          <h2 className="text-display journal-main-title">THE<br/>JOURNAL</h2>
          <p className="text-sans">Explore stories from around the globe.</p>
        </div>
        
        {destinations.map((dest) => (
          <div key={dest.id} className="journal-card">
            <div className="journal-img-wrapper">
              <div className="img-placeholder">
                <img src={dest.img} alt={dest.name} />
              </div>
            </div>
            <div className="journal-card-content">
              <div className="uppercase-meta">{dest.name}</div>
              <h3 className="text-display journal-card-title">{dest.title}</h3>
              <p className="text-sans journal-card-desc">{dest.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JournalSection;

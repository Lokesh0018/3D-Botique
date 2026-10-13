import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Quote } from 'lucide-react';
import './Community.css';

const testimonials = [
  { id: 1, name: 'Alina Davis', text: 'This Blouse Is Very Perfect Because It Covers Various Purposes. It\'s Very Unique And Can Be Worn Formal And Informal.' },
  { id: 2, name: 'Ayomi Jomi', text: 'I Bought This Nice Blouse And Did Not Need Any Adjustments. Highly Recommend Setting Up Such Standard Fitting.' },
  { id: 3, name: 'Emily Smith', text: 'Love This Top Very Standard Cutting And Great Color! Fabric Was The Main Part Which Has Awesome Finish.' },
  { id: 4, name: 'Michael Johnson', text: 'An Amazing Quality. Completely Surpassed My Expectations In Terms Of Fit And Texture.' },
];

const Community = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.community-header, .newsletter-section',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%'
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section className="community-section" ref={containerRef}>
      <div className="community-header">
        <h2 className="text-display" style={{ fontSize: '3rem', color: '#5C6B46' }}>Loved By Our Customers</h2>
        <p className="text-sans" style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Our Customers Appreciate High Quality And Dedication To Sustainable Practices.<br/>They Share To Buy With Confidence Always.
        </p>
      </div>
      
      <div className="testimonials-marquee-wrapper">
        <div className="testimonials-marquee">
          {[...testimonials, ...testimonials, ...testimonials].map((t, index) => (
            <div key={`${t.id}-${index}`} className="testi-card">
              <div className="testi-top">
                <div className="person-avatar">
                  <div className="img-placeholder" style={{ backgroundColor: '#F0F0F0' }}>
                    <img src={`https://i.pravatar.cc/150?u=${t.id}`} alt="avatar" />
                  </div>
                </div>
                <div className="person-name text-sans">{t.name}</div>
                <div className="quote-icon">
                  <Quote size={20} color="#E2A788" />
                </div>
              </div>
              <p className="testi-text text-sans">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="newsletter-section">
        <h2 className="text-display" style={{ fontSize: '3.5rem', color: '#5C6B46', marginBottom: '1rem' }}>Join Our Community</h2>
        <p className="text-sans" style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Join our community working on creativity, collaboration, and growth<br/>with like-minded individuals.
        </p>
        
        <form className="newsletter-box">
          <input type="email" placeholder="Enter Your Email" className="text-sans" />
          <button type="submit" className="text-sans">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default Community;

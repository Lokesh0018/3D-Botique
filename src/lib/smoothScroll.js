// Holds the single Lenis instance created in App.jsx so overlays and
// in-page links can pause or drive scrolling without prop drilling.
let lenis = null;
let lockCount = 0;

export const setLenis = (instance) => {
  lenis = instance;
};

// Nested overlays (e.g. search open while cart closes) each lock once.
export const lockScroll = () => {
  lockCount += 1;
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
};

export const unlockScroll = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  lenis?.start();
  document.documentElement.style.overflow = '';
};

export const scrollToHash = (hash) => {
  const target = hash === '#top' ? 0 : document.querySelector(hash);
  if (target === null) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: 0 });
  } else if (target === 0) {
    window.scrollTo({ top: 0 });
  } else {
    target.scrollIntoView();
  }
};

// Click handler for <a href="#section"> links: smooth-scrolls via Lenis
// instead of the browser's instant jump.
export const handleAnchorClick = (e) => {
  const hash = e.currentTarget.getAttribute('href');
  if (!hash?.startsWith('#')) return;
  e.preventDefault();
  scrollToHash(hash);
};

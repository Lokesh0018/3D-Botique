# AURA — Modern Women's Clothing

A single-page fashion storefront built with React 19 and Vite. It has GSAP scroll animations, Lenis smooth scrolling, a working bag (cart) with search, and an interactive Three.js 3D viewer for the featured blouse.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

## Features

- **Featured looks hero:** models cycle through a perspective "path". The progress dots jump to a look, and **view item** opens a quick preview where you can pick a size and add the item to the bag.
- **Bag:** add items from the hero, the collection cards, search, and the product section. The bag is saved in `localStorage` and opens from the navbar icon, which shows a count badge. Checkout is not connected yet.
- **Search:** filters the product catalog by name, color or tag.
- **3D view:** the product section toggles between the photo and a lazy-loaded Three.js scene. Drag, use the arrow keys, or use the on-screen buttons to rotate it.
- **Accessibility:** dialogs trap focus and return it on close, and every interactive element is keyboard reachable. When the OS "reduce motion" setting is on, smooth scrolling, auto-cycling and the marquee are turned off.

## Project structure

```
src/
  App.jsx               # Lenis + GSAP wiring, CartProvider, section order
  data/products.js      # product catalog, sizes, price formatting
  context/CartContext   # cart state, toast, localStorage persistence
  hooks/useDialog.js    # focus trap / Escape / scroll lock for dialogs
  lib/                  # smooth-scroll helpers, reduced-motion check
  components/           # one .jsx + .css per section or widget
```

Design tokens (colors, fonts, spacing, z-index) live in `src/index.css` under `:root`.

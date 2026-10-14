import fashion1 from '../assets/fashion-1.webp';
import fashion2 from '../assets/fashion-2.webp';
import fashion3 from '../assets/fashion-3.webp';
import fashion4 from '../assets/fashion-4.webp';

// Single source of truth for every product shown on the page.
// Hero, Collection, ProductShowcase, search and the cart all read from here.
export const PRODUCTS = {
  vintageStyle: {
    id: 'vintage-style',
    title: 'Vintage Style',
    subtitle: 'Modern Fashion',
    price: 180,
    color: 'Earth Beige',
    tag: 'New Arrival',
    img: fashion4,
    bg: 'var(--swatch-mist)',
  },
  pastelCombo: {
    id: 'pastel-combo',
    title: 'Pastel Trouser & Skirt Combo',
    subtitle: 'Skirt Combo',
    price: 240,
    color: 'Pastel Pink',
    tag: 'Best Seller',
    img: fashion1,
    bg: 'var(--swatch-blush)',
  },
  creamGreen: {
    id: 'cream-green',
    title: 'Cream & Green Combo',
    subtitle: 'Combo Cloth',
    price: 320,
    color: 'Sage Green',
    tag: 'Trending',
    img: fashion2,
    bg: 'var(--swatch-sage)',
  },
  limeVintage: {
    id: 'lime-vintage',
    title: 'Lime & Vintage Modern Cloth',
    subtitle: 'Modern Blouse',
    price: 850,
    color: 'Lime & Violet',
    tag: 'Featured',
    img: fashion3,
    bg: 'var(--swatch-lilac)',
  },
  limeBlouse: {
    id: 'lime-tied-blouse',
    title: 'Lime Green Tied Blouse',
    subtitle: 'Tied Blouse',
    price: 175,
    color: 'Lime Green',
    tag: 'Featured',
    img: fashion3,
    bg: 'var(--swatch-lavender)',
  },
};

export const HERO_PRODUCTS = [
  PRODUCTS.vintageStyle,
  PRODUCTS.pastelCombo,
  PRODUCTS.creamGreen,
  PRODUCTS.limeVintage,
];

export const COLLECTION_PRODUCTS = [
  PRODUCTS.pastelCombo,
  PRODUCTS.creamGreen,
  PRODUCTS.limeVintage,
];

export const ALL_PRODUCTS = Object.values(PRODUCTS);

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
export const DEFAULT_SIZE = 'M';
export const FREE_SHIPPING_THRESHOLD = 200;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatPrice = (amount) => currency.format(amount);

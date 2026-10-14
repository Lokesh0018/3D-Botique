import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_SIZE } from '../data/products';

const STORAGE_KEY = 'aura-cart';
const CartContext = createContext(null);

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

// Cart lines are keyed by product + size so the same item in two sizes
// shows as two lines.
const lineKey = (productId, size) => `${productId}__${size}`;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable (private mode); the cart still works in memory.
    }
  }, [items]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const addItem = useCallback((product, size = DEFAULT_SIZE) => {
    const key = lineKey(product.id, size);
    setItems(prev => {
      const existing = prev.find(item => item.key === key);
      if (existing) {
        return prev.map(item => item.key === key ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        key,
        productId: product.id,
        title: product.title,
        price: product.price,
        img: product.img,
        size,
        quantity: 1,
      }];
    });
    showToast(`${product.title} (${size}) added to your bag`);
  }, [showToast]);

  const updateQuantity = useCallback((key, quantity) => {
    setItems(prev => quantity <= 0
      ? prev.filter(item => item.key !== key)
      : prev.map(item => item.key === key ? { ...item, quantity } : item));
  }, []);

  const removeItem = useCallback((key) => {
    setItems(prev => prev.filter(item => item.key !== key));
  }, []);

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    updateQuantity,
    removeItem,
    toast,
    dismissToast: () => setToast(null),
  }), [items, isOpen, addItem, updateQuantity, removeItem, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};

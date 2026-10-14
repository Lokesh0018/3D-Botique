import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Minus, Plus, ShoppingBag, Check, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import useDialog from '../hooks/useDialog';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../data/products';
import { scrollToHash } from '../lib/smoothScroll';
import './CartDrawer.css';

const CartDrawer = () => {
  const { items, count, subtotal, isOpen, openCart, closeCart, updateQuantity, removeItem, clearCart, toast, dismissToast } = useCart();
  const closeBtnRef = useRef(null);
  const dialogRef = useDialog(isOpen, closeCart, closeBtnRef);

  const [checkoutState, setCheckoutState] = useState('idle'); // 'idle' | 'processing' | 'success'
  const orderNumber = useRef(Math.floor(100000 + Math.random() * 900000));

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const browseCollection = () => {
    closeCart();
    scrollToHash('#collections');
  };

  const handleCheckout = () => {
    if (checkoutState === 'processing') return;
    setCheckoutState('processing');
    
    // Simulate luxury payment gateway & packing confirmation
    setTimeout(() => {
      setCheckoutState('success');
      clearCart();
    }, 1600);
  };

  const resetAfterCheckout = () => {
    setCheckoutState('idle');
    closeCart();
    orderNumber.current = Math.floor(100000 + Math.random() * 900000);
  };

  return createPortal(
    <>
      {isOpen && (
        <div className="cart-overlay" onClick={closeCart}>
          <aside
            className="cart-drawer"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onClick={e => e.stopPropagation()}
          >
            <header className="cart-header">
              <h2 id="cart-title" className="text-display">Your Bag <span className="cart-count">({count})</span></h2>
              <button ref={closeBtnRef} type="button" className="cart-icon-btn" onClick={closeCart} aria-label="Close bag">
                <X size={20} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="cart-empty">
                <ShoppingBag size={36} strokeWidth={1.25} aria-hidden="true" />
                <p className="text-sans">Your bag is empty.</p>
                <button type="button" className="cart-primary-btn" onClick={browseCollection}>
                  Browse the collection
                </button>
              </div>
            ) : (
              <>
                <p className="cart-shipping text-sans" aria-live="polite">
                  {remainingForFreeShipping > 0
                    ? `Add ${formatPrice(remainingForFreeShipping)} more for free express shipping.`
                    : 'You qualify for free express shipping.'}
                </p>

                <ul className="cart-lines" data-lenis-prevent>
                  {items.map(item => (
                    <li key={item.key} className="cart-line">
                      <img src={item.img} alt="" className="cart-line-img" />
                      <div className="cart-line-info">
                        <span className="cart-line-title">{item.title}</span>
                        <span className="cart-line-meta">Size {item.size}</span>
                        <div className="cart-qty" role="group" aria-label={`Quantity for ${item.title}, size ${item.size}`}>
                          <button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity">
                            <Minus size={14} />
                          </button>
                          <span aria-live="polite">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="cart-line-end">
                        <span className="cart-line-price">{formatPrice(item.price * item.quantity)}</span>
                        <button type="button" className="cart-remove" onClick={() => removeItem(item.key)}>
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="cart-footer">
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <p className="cart-note text-sans">Taxes and shipping are calculated at checkout.</p>
                  
                  {checkoutState === 'success' ? (
                    <div className="checkout-success-view">
                      <div className="success-badge-circle" aria-hidden="true">
                        <Check size={28} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-display success-title">Order Confirmed</h3>
                      <p className="text-sans success-order-id">Order #AURA-{orderNumber.current}</p>
                      <p className="text-sans success-desc">
                        Thank you for your order. A confirmation email has been dispatched with delivery tracking.
                      </p>
                      <div className="success-confetti-row" aria-hidden="true">
                        <Sparkles size={18} color="var(--accent-strong)" />
                        <Sparkles size={14} color="var(--olive-soft)" />
                        <Sparkles size={18} color="var(--star)" />
                      </div>
                      <button type="button" className="cart-primary-btn" onClick={resetAfterCheckout}>
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`cart-primary-btn checkout-btn ${checkoutState === 'processing' ? 'is-loading' : ''}`}
                      disabled={checkoutState === 'processing'}
                      onClick={handleCheckout}
                    >
                      {checkoutState === 'processing' ? (
                        <span className="checkout-btn-loading">
                          <Loader2 size={18} className="spinner" aria-hidden="true" />
                          <span>Securing Order...</span>
                        </span>
                      ) : (
                        <span className="checkout-btn-idle">
                          <span>Proceed to Checkout</span>
                          <ArrowRight size={16} aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  )}
                </footer>
              </>
            )}
          </aside>
        </div>
      )}

      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && (
          <div className="toast" key={toast.id}>
            <Check size={16} aria-hidden="true" />
            <span>{toast.message}</span>
            <button type="button" className="toast-action" onClick={() => { dismissToast(); openCart(); }}>
              View bag
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

export default CartDrawer;

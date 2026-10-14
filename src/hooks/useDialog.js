import { useEffect, useRef } from 'react';
import { lockScroll, unlockScroll } from '../lib/smoothScroll';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

// Modal behaviour for an open dialog: Escape closes, Tab stays inside,
// page scroll is locked, and focus returns to the opener on close.
const useDialog = (isOpen, onClose, initialFocusRef) => {
  const dialogRef = useRef(null);
  // Read through a ref so a new inline onClose each render doesn't re-run
  // the open/close effect (which would steal focus back to the start).
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const opener = document.activeElement;
    lockScroll();

    const focusTarget = initialFocusRef?.current
      ?? dialogRef.current?.querySelector(FOCUSABLE);
    focusTarget?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [isOpen, initialFocusRef]);

  return dialogRef;
};

export default useDialog;

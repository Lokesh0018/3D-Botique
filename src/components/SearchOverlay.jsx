import React, { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Plus } from 'lucide-react';
import useDialog from '../hooks/useDialog';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS, formatPrice } from '../data/products';
import './SearchOverlay.css';

const matches = (product, query) => {
  const haystack = `${product.title} ${product.subtitle} ${product.color} ${product.tag}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every(word => haystack.includes(word));
};

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const dialogRef = useDialog(isOpen, onClose, inputRef);
  const { addItem } = useCart();
  const resultsId = useId();

  if (!isOpen) return null;

  const trimmed = query.trim();
  const results = trimmed ? ALL_PRODUCTS.filter(p => matches(p, trimmed)) : ALL_PRODUCTS;

  return createPortal(
    <div className="search-overlay" onClick={onClose}>
      <div
        className="search-panel"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        onClick={e => e.stopPropagation()}
      >
        <div className="search-bar">
          <Search size={20} strokeWidth={1.5} aria-hidden="true" />
          <label htmlFor="site-search" className="visually-hidden">Search products</label>
          <input
            id="site-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search blouses, combos, colors…"
            autoComplete="off"
            aria-controls={resultsId}
          />
          <button type="button" className="search-close" onClick={onClose} aria-label="Close search">
            <X size={20} />
          </button>
        </div>

        <p className="search-status uppercase-meta" aria-live="polite">
          {trimmed ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'All pieces'}
        </p>

        <ul className="search-results" id={resultsId} data-lenis-prevent>
          {results.map(product => (
            <li key={product.id} className="search-result">
              <img src={product.img} alt="" className="search-result-img" style={{ backgroundColor: product.bg }} />
              <div className="search-result-info">
                <span className="search-result-title">{product.title}</span>
                <span className="search-result-meta">{product.color} · {formatPrice(product.price)}</span>
              </div>
              <button
                type="button"
                className="search-add"
                onClick={() => addItem(product)}
                aria-label={`Add ${product.title} to bag`}
              >
                <Plus size={16} aria-hidden="true" />
                <span>Add</span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="search-empty">No pieces match “{trimmed}”. Try “blouse” or “green”.</li>
          )}
        </ul>
      </div>
    </div>,
    document.body
  );
};

export default SearchOverlay;

import React, { useId, useRef } from 'react';
import { SIZES } from '../data/products';
import './SizePicker.css';

// Radio group with roving tabindex: Tab enters/leaves the group,
// arrow keys move between sizes (WAI-ARIA radio group pattern).
const SizePicker = ({ value, onChange, label = 'Select Size' }) => {
  const labelId = useId();
  const buttonsRef = useRef([]);

  const handleKeyDown = (e, index) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (index + step + SIZES.length) % SIZES.length;
    onChange(SIZES[next]);
    buttonsRef.current[next]?.focus();
  };

  return (
    <div className="size-picker" role="radiogroup" aria-labelledby={labelId}>
      <span id={labelId} className="uppercase-meta size-picker-label">
        {label} <span className="size-picker-value">{value}</span>
      </span>
      <div className="size-options">
        {SIZES.map((size, index) => (
          <button
            key={size}
            ref={el => { buttonsRef.current[index] = el; }}
            type="button"
            role="radio"
            aria-checked={value === size}
            tabIndex={value === size ? 0 : -1}
            className={`size-btn ${value === size ? 'active' : ''}`}
            onClick={() => onChange(size)}
            onKeyDown={e => handleKeyDown(e, index)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizePicker;

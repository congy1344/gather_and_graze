/** Themeable single-select control with keyboard and screen-reader support. */
import { useEffect, useId, useRef, useState } from 'react';

export default function CustomSelect({ value, options, onChange, label, className = '' }) {
  const rootRef = useRef(null);
  const listboxId = useId();
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [isOpen]);

  const selectOption = (option) => {
    onChange(option.value);
    setActiveIndex(options.indexOf(option));
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') { setIsOpen(false); return; }
    if (event.key === 'Tab') { setIsOpen(false); return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => (index + direction + options.length) % options.length);
      setIsOpen(true);
      return;
    }
    if (isOpen && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isOpen) selectOption(options[activeIndex]);
      else { setActiveIndex(selectedIndex); setIsOpen(true); }
    }
  };

  const selected = options[selectedIndex];
  return <div className={`custom-select ${className}`} ref={rootRef}><button type="button" className="custom-select__trigger" role="combobox" aria-label={label} aria-controls={listboxId} aria-expanded={isOpen} aria-haspopup="listbox" aria-activedescendant={isOpen ? `${listboxId}-${activeIndex}` : undefined} onClick={() => { setActiveIndex(selectedIndex); setIsOpen((open) => !open); }} onKeyDown={handleKeyDown}><span>{selected.label}</span><span className="custom-select__chevron" aria-hidden="true" /></button>{isOpen && <div className="custom-select__menu" id={listboxId} role="listbox" aria-label={label}>{options.map((option, index) => <button type="button" id={`${listboxId}-${index}`} className="custom-select__option" role="option" aria-selected={option.value === value} tabIndex="-1" key={option.value} onPointerMove={() => setActiveIndex(index)} data-active={activeIndex === index} onClick={() => selectOption(option)}><span>{option.label}</span>{option.value === value && <span aria-hidden="true">✓</span>}</button>)}</div>}</div>;
}

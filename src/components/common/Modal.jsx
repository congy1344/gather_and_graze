/** Portal modal with focus containment and an inert application shell. */
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, closeLabel = 'Close dialog', children }) {
  const modalRef = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    const appRoot = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;
    appRoot?.setAttribute('inert', '');
    appRoot?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'hidden';
    const focusable = () => [...modalRef.current.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])')];
    focusable()[0]?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      appRoot?.removeAttribute('inert');
      appRoot?.removeAttribute('aria-hidden');
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return createPortal(<div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={titleId}><header className="modal__header"><h2 id={titleId}>{title}</h2><button className="modal__close" onClick={onClose} aria-label={closeLabel}>×</button></header>{children}</section></div>, document.body);
}

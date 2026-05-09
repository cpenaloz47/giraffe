import { useState, useEffect, useCallback } from 'react';
import { offers } from '../../data/mock';

export default function OfferBanner({ items = offers, interval = 4000 }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  const prev = useCallback(() => {
    setActiveIdx((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setActiveIdx((i) => (i + 1) % items.length);
  }, [items.length]);

  return (
    <div className="offer-banner">
      <div className="container">
        <div className="d-flex align-items-center">
          <button className="offer-arrow" onClick={prev} aria-label="Anterior">
            <i className="bi bi-chevron-left" />
          </button>
          <div className="flex-grow-1 text-center">
            <span className="offer-text">{items[activeIdx]}</span>
          </div>
          <button className="offer-arrow" onClick={next} aria-label="Siguiente">
            <i className="bi bi-chevron-right" />
          </button>
        </div>
        <div className="d-flex justify-content-center gap-1 mt-1">
          {items.map((_, i) => (
            <button
              key={i}
              className={`offer-dot ${i === activeIdx ? 'active' : ''}`}
              onClick={() => setActiveIdx(i)}
              aria-label={`Oferta ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

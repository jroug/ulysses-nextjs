'use client';

import { useRef, useState } from 'react';
import type { RenderedImage } from '../lib/types';

export default function YachtGallery({ title, images, specifications = false }: {
  title: string; images: RenderedImage[]; specifications?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);
  const originalOverflow = useRef('');
  function close() { dialog.current?.close(); }
  function open(index: number) {
    setSelected(index);
    originalOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
  }
  const change = (direction: number) => setSelected((index) => (index + direction + images.length) % images.length);
  if (!images.length) return null;
  return <section className={`yacht-gallery-section${specifications ? ' yacht-specifications' : ''}`}>
    <h2>{title}</h2>
    <div className="yacht-gallery-grid">
      {images.map((image, index) => <button type="button" key={`${index}-${image.src}`} onClick={() => open(index)} aria-label={`Enlarge: ${image.alt}`}>
        <img {...image} loading="lazy" decoding="async" sizes={specifications ? '(max-width: 700px) 90vw, 30vw' : '(max-width: 700px) 44vw, 240px'} />
      </button>)}
    </div>
    <dialog ref={dialog} className="yacht-lightbox" aria-label={title}
      onClose={() => { document.body.style.overflow = originalOverflow.current; }}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); change(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); change(1); }
      }}>
      <div className="yacht-lightbox-content">
        <button type="button" className="yacht-lightbox-close" onClick={close} aria-label="Close gallery">×</button>
        <img src={images[selected].src} alt={images[selected].alt} width={images[selected].width} height={images[selected].height} />
        <div className="yacht-lightbox-controls">
          {images.length > 1 && <button type="button" onClick={() => change(-1)} aria-label="Previous image">←</button>}
          <p aria-live="polite">{images[selected].alt} ({selected + 1}/{images.length})</p>
          {images.length > 1 && <button type="button" onClick={() => change(1)} aria-label="Next image">→</button>}
        </div>
      </div>
    </dialog>
  </section>;
}

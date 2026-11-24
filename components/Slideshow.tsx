'use client';

import { useEffect, useRef, useState } from 'react';
import type { RenderedImage } from '../lib/types';

interface SlideshowProps { images: RenderedImage[]; title?: string | null; subtitle?: string | null; }

export default function Slideshow({ images, title, subtitle }: SlideshowProps) {
  const hero = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [loaded, setLoaded] = useState([0]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function start(event: Event) {
      if (motion.matches || (event.target instanceof Element && event.target.closest('.slideshow-pause'))) return;
      setStarted(true); setPlaying(true);
    }
    function stop() { setPlaying(false); }
    if (!started) ['pointerdown', 'keydown', 'scroll'].forEach((name) => window.addEventListener(name, start, { passive: true, once: true }));
    motion.addEventListener('change', stop);
    return () => {
      ['pointerdown', 'keydown', 'scroll'].forEach((name) => window.removeEventListener(name, start));
      motion.removeEventListener('change', stop);
    };
  }, [started]);

  useEffect(() => {
    if (!playing || images.length < 2) return;
    let cancelled = false;
    const timer = window.setInterval(async () => {
      if (document.hidden) return;
      const next = (current + 1) % images.length;
      setLoaded((values) => values.includes(next) ? values : [...values, next]);
      // Let React attach the next source, then wait until it is decoded.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const image = hero.current?.querySelectorAll<HTMLImageElement>('.hero-slide')[next];
      try { await image?.decode(); } catch { return; }
      if (!cancelled) { setPrevious(current); setCurrent(next); }
    }, 5000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [playing, current, images.length]);

  return <section ref={hero} className="hero home-hero" aria-label="Sailing in Greece">
    <div className="hero-slides" aria-hidden="true">
      {images.map((image, index) => <img key={`${index}-${image.src}`} {...image}
        src={loaded.includes(index) ? image.src : undefined}
        srcSet={loaded.includes(index) ? image.srcSet : undefined}
        className={`hero-slide${index === current ? ' is-active' : index === previous ? ' is-leaving' : ''}`}
        sizes="93vw" fetchPriority={index === 0 ? 'high' : 'low'} decoding="async"
        onTransitionEnd={() => { if (index === previous) setPrevious(null); }} />)}
    </div>
    <div className="hero-copy"><h1>{title}</h1><p>{subtitle}</p></div>
    {images.length > 1 && <button type="button" className="slideshow-pause" aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} aria-pressed={!playing}
      onClick={() => { setStarted(true); setPlaying((value) => !value); }}>{playing ? 'Pause' : 'Play'}</button>}
  </section>;
}

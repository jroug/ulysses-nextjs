'use client';

import { useEffect, useRef, useState } from 'react';
import type { RenderedImage } from '../lib/types';

export default function YouTubeVideo({ id, embedUrl, title, poster }: { id: string; embedUrl: string; title: string; poster?: RenderedImage | null }) {
  const [playing, setPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState('maxresdefault');
  const [posterFailed, setPosterFailed] = useState(false);
  const activePoster = posterFailed ? null : poster;
  const player = useRef<HTMLIFrameElement>(null);
  useEffect(() => { if (playing) player.current?.focus(); }, [playing]);

  return <div className="youtube-video">
    {playing ? <iframe ref={player} src={embedUrl} title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      : <button type="button" className="youtube-preview" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
        <img src={activePoster?.src || `https://i.ytimg.com/vi/${id}/${thumbnail}.jpg`}
          srcSet={activePoster?.srcSet} sizes="(max-width: 700px) 90vw, 900px"
          alt={activePoster?.alt || `Video preview: ${title}`}
          width={activePoster?.width || 1280} height={activePoster?.height || 720} loading="lazy" decoding="async"
          onError={() => { if (activePoster) setPosterFailed(true); else if (thumbnail !== 'hqdefault') setThumbnail('hqdefault'); }}
          onLoad={(event) => { if (!activePoster && thumbnail !== 'hqdefault' && event.currentTarget.naturalWidth < 480) setThumbnail('hqdefault'); }} />
        <span className="youtube-preview-title">{title}</span>
        <span className="youtube-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 5v14l11-7z" fill="currentColor" /></svg></span>
      </button>}
    <noscript><a href={`https://www.youtube.com/watch?v=${id}`}>Watch {title} on YouTube</a></noscript>
  </div>;
}

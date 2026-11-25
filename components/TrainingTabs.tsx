'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface TrainingTab { id: string; label: string; html: string; }

export default function TrainingTabs({ tabs }: { tabs: TrainingTab[] }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  if (!tabs.length) return null;

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % tabs.length; break;
      case 'ArrowLeft': next = (index + tabs.length - 1) % tabs.length; break;
      case 'Home': next = 0; break;
      case 'End': next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }

  return <div className="training-tabs">
    <div className="tab-list" role="tablist" aria-label="Training types">
      {tabs.map((tab, index) => <button key={tab.id} type="button" role="tab"
        ref={(button) => { buttons.current[index] = button; }}
        id={`${tab.id}-tab`} aria-controls={`${tab.id}-panel`} aria-selected={active === index}
        tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => move(event, index)}>
        {tab.label}
      </button>)}
    </div>
    {tabs.map((tab, index) => <div key={tab.id} className="training-panel" role="tabpanel"
      id={`${tab.id}-panel`} aria-labelledby={`${tab.id}-tab`} tabIndex={0} hidden={active !== index}
      dangerouslySetInnerHTML={{ __html: tab.html }} />)}
  </div>;
}

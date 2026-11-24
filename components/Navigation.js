'use client';

import { useEffect, useRef, useState } from 'react';

export default function Navigation({ links, boats }) {
  const [open, setOpen] = useState(false);
  const [yachtsOpen, setYachtsOpen] = useState(false);
  const container = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    function close(event) {
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      if (event.type === 'click' && container.current?.contains(event.target)) return;
      setOpen(false); setYachtsOpen(false);
      if (event.type === 'keydown') toggle.current?.focus();
    }
    document.addEventListener('click', close); document.addEventListener('keydown', close);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', close); };
  }, []);
  return <div ref={container} className="navigation-wrap">
    <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen(!open)}>Menu <span aria-hidden="true">☰</span></button>
    <nav className={`main-nav${open ? ' is-open' : ''}`} id="main-menu" aria-label="Main navigation">
      <ul><li><a href="/" aria-current="page">Home</a></li>
        <li className={`has-submenu${yachtsOpen ? ' is-open' : ''}`}><button className="submenu-toggle" type="button" aria-expanded={yachtsOpen} aria-controls="yacht-menu" onClick={() => setYachtsOpen(!yachtsOpen)}>The Yachts</button>
          <ul className="submenu" id="yacht-menu">{boats.map((boat) => <li key={boat.href}><a href={boat.href}>{boat.label}</a></li>)}</ul></li>
        {links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
      </ul>
    </nav>
  </div>;
}

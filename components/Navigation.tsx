'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MenuItem } from '../lib/types';

function MenuBranch({ item, pathname, mobileOpen }: { item: MenuItem; pathname: string; mobileOpen: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children.length > 0;
  const submenuId = `menu-children-${item.id}`;
  const current = item.url.startsWith('/') && !item.url.startsWith('//') && (item.url.split(/[?#]/)[0].replace(/\/$/, '') || '/') === (pathname.replace(/\/$/, '') || '/');
  const active = expanded && mobileOpen;
  const rel = [item.rel, item.target === '_blank' ? 'noopener noreferrer' : ''].filter(Boolean).join(' ') || undefined;

  return <li className={[hasChildren ? 'has-submenu' : '', active ? 'is-open' : '', ...item.classes].filter(Boolean).join(' ')}
    onMouseEnter={() => { if (window.matchMedia('(min-width: 901px)').matches) setExpanded(true); }}
    onMouseLeave={() => { if (window.matchMedia('(min-width: 901px)').matches) setExpanded(false); }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}
    onKeyDown={(event) => { if (event.key === 'Escape' && active) { event.stopPropagation(); setExpanded(false); event.currentTarget.querySelector('button')?.focus(); } }}>
    <div className="menu-item-heading">
      <Link href={item.url || '#'} target={item.target || undefined} rel={rel} aria-current={current ? 'page' : undefined}>{item.title}</Link>
      {hasChildren && <button className="submenu-toggle" type="button" aria-label={`Toggle ${item.title} submenu`} aria-expanded={active} aria-controls={submenuId} onClick={() => setExpanded(!expanded)}><span aria-hidden="true">▾</span></button>}
    </div>
    {hasChildren && <ul className="submenu" id={submenuId}>
      {item.children.map((child) => <MenuBranch key={child.id} item={child} pathname={pathname} mobileOpen={active} />)}
    </ul>}
  </li>;
}

export default function Navigation({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 901px)');
    const update = () => { setDesktop(media.matches); setOpen(false); };
    update(); media.addEventListener('change', update);
    function close(event: MouseEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent && event.key !== 'Escape') return;
      if (event.type === 'click' && event.target instanceof Node && container.current?.contains(event.target)) return;
      setOpen(false);
      if (event.type === 'keydown') toggle.current?.focus();
    }
    document.addEventListener('click', close); document.addEventListener('keydown', close);
    return () => { media.removeEventListener('change', update); document.removeEventListener('click', close); document.removeEventListener('keydown', close); };
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  if (!items.length) return null;
  return <div ref={container} className="navigation-wrap">
    <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen(!open)}>Menu <span aria-hidden="true">☰</span></button>
    <nav className={`main-nav${open ? ' is-open' : ''}`} id="main-menu" aria-label="Main navigation"
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
      }}>
      <ul>{items.map((item) => <MenuBranch key={item.id} item={item} pathname={pathname} mobileOpen={desktop || open} />)}</ul>
    </nav>
  </div>;
}

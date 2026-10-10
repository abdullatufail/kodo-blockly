'use client';

import { useEffect } from 'react';
import { sfx } from '@/lib/sfx';

const COLORS = ['--color-leaf', '--color-sky', '--color-sun', '--color-berry', '--color-grape', '--color-peach'];

// A tiny confetti pop (and a soft "tap") whenever something clickable is pressed.
export default function CursorEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleDown = (e) => {
      const target = e.target instanceof Element ? e.target.closest('button, a, [role="button"]') : null;
      if (!target || target.closest('[data-no-burst]')) return;

      sfx.tap();
      if (reduceMotion.matches) return;

      const count = 9;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'click-particle';
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
        const distance = 26 + Math.random() * 30;
        const size = 6 + Math.random() * 6;
        const isStar = i % 3 === 0;
        p.style.cssText = `
          left:${e.clientX - size / 2}px; top:${e.clientY - size / 2}px;
          width:${size}px; height:${size}px;
          background: var(${COLORS[i % COLORS.length]});
          border: 2px solid var(--color-ink);
          border-radius: ${isStar ? '3px' : '50%'};
          --tx:${Math.cos(angle) * distance}px; --ty:${Math.sin(angle) * distance}px;
          --rot:${(Math.random() - 0.5) * 360}deg;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 700);
      }
    };

    document.addEventListener('pointerdown', handleDown);
    return () => document.removeEventListener('pointerdown', handleDown);
  }, []);

  return null;
}

'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '@/context/AccessibilityContext';
import { EyeIcon, NoteIcon, SlidersIcon, SpeakerIcon, CloseIcon } from './ui/Icons';

export function AccessibilityToggles({ compact = false }) {
  const { highContrast, toggleHighContrast, ttsEnabled, toggleTts, soundEnabled, toggleSound } = useAccessibility();

  const items = [
    { label: 'High contrast', on: highContrast, toggle: toggleHighContrast, Icon: EyeIcon, color: 'bg-sun' },
    { label: 'Read aloud', on: ttsEnabled, toggle: toggleTts, Icon: SpeakerIcon, color: 'bg-sky' },
    { label: 'Sounds', on: soundEnabled, toggle: toggleSound, Icon: NoteIcon, color: 'bg-leaf' },
  ];

  return items.map(({ label, on, toggle, Icon, color }) => (
    <button
      key={label}
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title={label}
      className={`btn-chunky flex items-center gap-2 rounded-2xl font-display text-sm font-semibold ${
        compact ? 'h-11 w-11 justify-center' : 'px-3 py-2'
      } ${on ? `${color} text-onfill` : 'bg-paper text-ink'}`}
    >
      <Icon className="h-5 w-5" />
      {compact ? <span className="sr-only">{label}</span> : <span>{label}</span>}
      {!compact && (
        <span className={`ml-1 rounded-full px-1.5 text-[11px] ${on ? 'bg-paper/70 text-ink' : 'bg-line text-ink-soft'}`}>
          {on ? 'ON' : 'OFF'}
        </span>
      )}
    </button>
  ));
}

// Floating settings bubble for the content pages. The game screen has these in its HUD.
export default function AccessibilityDock() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith('/level/')) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-2">
      {open && (
        <div className="card-sticker flex flex-col gap-2 rounded-3xl p-3" role="group" aria-label="Accessibility settings">
          <AccessibilityToggles />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close accessibility settings' : 'Open accessibility settings'}
        className="btn-chunky flex h-14 w-14 items-center justify-center rounded-full bg-grape text-onfill"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <SlidersIcon className="h-6 w-6" />}
      </button>
    </div>
  );
}

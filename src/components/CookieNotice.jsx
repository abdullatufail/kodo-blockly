'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import FunButton from './ui/FunButton';
import { getConsent, OPEN_CONSENT_EVENT, setConsent } from '@/lib/storage';
import { whenRevealed } from '@/lib/pageReveal';
import { Sunny } from './brand/Crew';

function Cookie({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 4 C40 4 44 10 50 10 C50 16 58 18 60 24 C62 44 50 60 32 60 C14 60 4 46 4 32 C4 16 16 4 32 4 Z" fill="#e3a65d" />
      <circle cx="22" cy="22" r="4.5" fill="#5b3a1e" />
      <circle cx="38" cy="18" r="3.5" fill="#5b3a1e" />
      <circle cx="44" cy="36" r="5" fill="#5b3a1e" />
      <circle cx="24" cy="42" r="4" fill="#5b3a1e" />
      <circle cx="34" cy="50" r="2.5" fill="#5b3a1e" />
      <circle cx="14" cy="32" r="2.5" fill="#5b3a1e" />
    </svg>
  );
}

// A friendly note about what Kodo keeps on this device, with a real choice.
export default function CookieNotice() {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    whenRevealed().then(() => {
      if (!cancelled && !getConsent()) setOpen(true);
    });
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => {
      cancelled = true;
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, { y: 160, rotate: -8, duration: 0.8, ease: 'back.out(1.6)', delay: 0.4 });
      gsap.to('.cookie-art', { rotate: 360, duration: 12, ease: 'none', repeat: -1 });
      gsap.from('.cookie-sunny', { y: 40, scaleY: 0.4, duration: 0.6, delay: 0.9, ease: 'back.out(2.5)' });
    }, cardRef);
    return () => ctx.revert();
  }, [open]);

  const choose = (value) => {
    setConsent(value);
    gsap.to(cardRef.current, { y: 200, rotate: 6, duration: 0.4, ease: 'back.in(1.6)', onComplete: () => setOpen(false) });
  };

  if (!open) return null;

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
      className="fixed bottom-4 left-4 right-4 z-[150] max-w-sm rounded-[28px] bg-ink p-5 text-paper sm:right-auto"
    >
      <Sunny className="cookie-sunny absolute -top-11 right-6 h-16 w-16" mood="wink" shadow={false} title="" />
      <div className="flex items-start gap-4">
        <Cookie className="cookie-art h-14 w-14 shrink-0" />
        <div>
          <h2 id="cookie-title" className="text-3xl text-sun">
            Cookies? Kind of!
          </h2>
          <p id="cookie-text" className="mt-1 text-sm font-semibold text-paper/80">
            Kodo doesn&apos;t track you or show ads. It only saves your stars, your code and your settings in this browser so you can carry on
            later.
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <FunButton color="sun" size="sm" className="flex-1 !rounded-full" onClick={() => choose('accepted')}>
          Okay!
        </FunButton>
        <FunButton color="paper" size="sm" className="flex-1 !rounded-full" onClick={() => choose('declined')}>
          No thanks
        </FunButton>
      </div>
    </div>
  );
}

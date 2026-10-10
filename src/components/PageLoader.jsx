'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Kodo from './brand/Kodo';
import { markRevealed } from '@/lib/pageReveal';

const MIN_TIME = 1100; // ms, so the bounce is never just a flicker

// Full-screen loader: Kodo bounces (squash, stretch, a little tilt) until the
// page is ready, then its body swells into a giant circle that fills the
// screen and a round hole opens in the middle to reveal the page.
export default function PageLoader() {
  const rootRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const kodo = root.querySelector('.loader-kodo');
    const blob = root.querySelector('.loader-blob');
    const label = root.querySelector('.loader-label');
    const start = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.style.overflow = 'hidden';

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      document.documentElement.style.overflow = '';
      markRevealed();
      setDone(true);
    };
    // Animations pause in background tabs; never let the curtain get stuck.
    const fallback = setTimeout(finish, 9000);

    // Bounce: squash on the ground, stretch on the way up and down.
    const bounce = gsap.timeline({ repeat: -1, defaults: { transformOrigin: '50% 100%' } });
    let pulse;
    if (!reduced) {
      bounce
        .to(kodo, { scaleX: 1.28, scaleY: 0.72, duration: 0.14, ease: 'power2.out' })
        .to(kodo, { y: -110, scaleX: 0.84, scaleY: 1.2, rotation: -8, duration: 0.32, ease: 'power2.out' })
        .to(kodo, { y: -130, scaleX: 1, scaleY: 1, rotation: 6, duration: 0.14, ease: 'sine.inOut' })
        .to(kodo, { y: 0, scaleX: 0.86, scaleY: 1.16, rotation: 0, duration: 0.3, ease: 'power2.in' })
        .to(kodo, { scaleX: 1.3, scaleY: 0.7, duration: 0.08, ease: 'power1.out' });
      pulse = gsap.to(label, { opacity: 0.45, duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }

    let cancelled = false;
    const ready = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, { once: true });
    });

    let exit;
    Promise.all([ready, document.fonts?.ready]).then(() => {
      const wait = Math.max(0, MIN_TIME - (performance.now() - start));
      gsap.delayedCall(wait / 1000, () => {
        if (cancelled) return;
        bounce.kill();
        pulse?.kill();
        if (reduced) {
          exit = gsap.to(root, { opacity: 0, duration: 0.3, onComplete: finish });
          return;
        }
        // Grow until the circle covers the furthest corner of the screen.
        const r = blob.getBoundingClientRect();
        const cover = (Math.hypot(window.innerWidth, window.innerHeight) / r.width) * 1.15;
        exit = gsap
          .timeline({ onComplete: finish })
          .to(kodo, { y: 0, rotation: 0, scaleX: 1.2, scaleY: 0.8, duration: 0.16, ease: 'power2.out', transformOrigin: '50% 100%' })
          .to(label, { opacity: 0, y: 10, duration: 0.2 }, '<')
          .to(kodo, { scaleX: 1, scaleY: 1, duration: 0.25, ease: 'back.out(3)' })
          .set(blob, { opacity: 1 })
          .to(kodo, { opacity: 0, duration: 0.15 })
          .to(blob, { scale: cover, duration: 0.7, ease: 'power3.in' }, '<')
          .set(root, { backgroundColor: 'var(--color-peach)' })
          .set(blob, { opacity: 0 })
          .call(markRevealed)
          .to(root, { '--hole': `${Math.hypot(window.innerWidth, window.innerHeight)}px`, duration: 0.8, ease: 'power3.inOut' }, '+=0.05');
      });
    });

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      bounce.kill();
      pulse?.kill();
      exit?.kill();
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="page-loader fixed inset-0 z-[300] flex flex-col items-center justify-center bg-cream" role="status" aria-label="Loading">
      <div className="relative flex h-40 w-40 items-end justify-center">
        <span className="loader-blob absolute bottom-[8px] left-1/2 h-[77px] w-[77px] -translate-x-1/2 rounded-full bg-peach opacity-0" aria-hidden="true" />
        <div className="loader-kodo h-24 w-24">
          <Kodo className="h-full w-full" shadow={false} blink={false} title="" />
        </div>
      </div>
      <p className="loader-label mt-4 font-display text-2xl text-ink">Kodo is on the way...</p>
    </div>
  );
}

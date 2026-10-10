'use client';

import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import Kodo from './brand/Kodo';
import { Star } from './brand/Stickers';
import FunButton from './ui/FunButton';
import { ArrowRightIcon, CheckIcon, CloseIcon, MapIcon, ResetIcon } from './ui/Icons';
import { sfx } from '@/lib/sfx';
import { AUTH_ENABLED } from '@/lib/features';
import { getConsent } from '@/lib/storage';

const COLORS = ['--color-leaf', '--color-sky', '--color-sun', '--color-berry', '--color-grape', '--color-peach'];
const CHEERS = ['Hooray!', 'You did it!', 'Home sweet home!', 'Brilliant!', 'Super coder!'];

function makeConfetti() {
  return Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2.2 + Math.random() * 1.8,
    size: 8 + Math.random() * 9,
    color: COLORS[i % COLORS.length],
    round: Math.random() > 0.5,
    drift: (Math.random() - 0.5) * 160,
  }));
}

export default function LevelCompleteModal({ isOpen, onClose, onReplay, level, result, isLoggedIn, nextLevelId }) {
  const cardRef = useRef(null);
  const starsRef = useRef([]);
  // Parents usually pass an inline onClose; keep it in a ref so it can't restart the animation.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const confetti = useMemo(() => (isOpen ? makeConfetti() : []), [isOpen]);
  const cheer = useMemo(() => CHEERS[(level?.id || 0) % CHEERS.length], [level?.id]);

  useEffect(() => {
    if (!isOpen || !result) return;
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current();
    window.addEventListener('keydown', onKey);

    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { scale: 0.6, y: 60, rotate: -4, opacity: 0 }, { scale: 1, y: 0, rotate: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' });
      starsRef.current.forEach((el, i) => {
        if (!el) return;
        const earned = i < result.stars;
        gsap.fromTo(
          el,
          { scale: 0, rotate: -120 },
          {
            scale: earned ? 1 : 0.8,
            rotate: 0,
            duration: 0.55,
            ease: 'back.out(2.4)',
            delay: 0.45 + i * 0.28,
            onStart: () => earned && sfx.star(i),
          }
        );
      });
    });
    return () => {
      window.removeEventListener('keydown', onKey);
      ctx.revert();
    };
  }, [isOpen, result]);

  if (!isOpen || !result || typeof document === 'undefined') return null;

  const missions = [
    { done: result.missions.home, label: 'Got Kodo home' },
    {
      done: result.missions.berries,
      label: level.berries.length === 1 ? 'Grabbed the berry' : `Grabbed all ${level.berries.length} berries`,
    },
    { done: result.missions.blocks, label: `Used ${result.blocks} block${result.blocks === 1 ? '' : 's'} (goal: ${level.parBlocks} or fewer)` },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="win-title">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]" onClick={onClose} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="absolute -top-6"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * (c.round ? 1 : 0.6),
              background: `var(${c.color})`,
              borderRadius: c.round ? '50%' : '3px',
              animation: `confetti-fall ${c.duration}s cubic-bezier(.3,.6,.5,1) ${c.delay}s forwards`,
              '--drift': `${c.drift}px`,
            }}
          />
        ))}
      </div>

      <div ref={cardRef} className="card-sticker relative w-full max-w-md rounded-[34px] px-6 pb-6 pt-20 text-center sm:px-8">
        <Kodo className="absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 animate-bob" mood="cheer" title="Kodo is cheering" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="btn-chunky absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream"
        >
          <CloseIcon />
        </button>

        <h2 id="win-title" className="text-4xl font-bold">{cheer}</h2>
        <p className="mt-1 font-semibold text-ink-soft">Level {level.id} · {level.title}</p>

        <div className="my-5 flex items-end justify-center gap-2" aria-label={`${result.stars} of 3 stars`}>
          {[0, 1, 2].map((i) => (
            <span key={i} ref={(el) => (starsRef.current[i] = el)} className={`inline-block ${i === 1 ? 'mb-3' : ''}`}>
              <Star className={i === 1 ? 'h-20 w-20' : 'h-16 w-16'} fill={i < result.stars ? 'var(--color-ink)' : 'var(--color-line)'} />
            </span>
          ))}
        </div>

        <ul className="space-y-2 text-left">
          {missions.map(({ done, label }) => (
            <li key={label} className={`flex items-center gap-3 rounded-2xl px-3 py-2 font-semibold ${done ? 'bg-leaf-soft' : 'bg-cream text-ink-soft'}`}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${done ? 'bg-leaf-deep text-paper' : 'bg-ink/10'}`}>
                {done && <CheckIcon className="h-4 w-4" />}
              </span>
              {label}
            </li>
          ))}
        </ul>

        {result.isNewBest && result.stars > 0 && (
          <p className="mt-4 inline-block rotate-[-2deg] rounded-xl bg-sun px-3 py-1 font-display font-semibold text-onfill">
            New best score!
          </p>
        )}
        {!isLoggedIn && (
          <p className="mt-3 text-sm font-semibold text-ink-soft">
            {getConsent() === 'declined'
              ? 'Saving is turned off, so these stars will be gone when you close the tab.'
              : `Your stars are saved on this device.${AUTH_ENABLED ? ' Sign in to keep them everywhere.' : ''}`}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <FunButton color="cream" onClick={onReplay} icon={<ResetIcon />} className="flex-1">
            Again
          </FunButton>
          {nextLevelId ? (
            <FunButton href={`/level/${nextLevelId}`} color="leaf" iconAfter={<ArrowRightIcon />} className="flex-[1.4]">
              Next level
            </FunButton>
          ) : (
            <FunButton href="/levels" color="sky" icon={<MapIcon />} className="flex-[1.4]">
              Back to map
            </FunButton>
          )}
        </div>
        {!nextLevelId && <p className="mt-4 font-display text-2xl text-berry-deep">You got Kodo all the way home. Thank you!</p>}
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--drift), 105vh) rotate(720deg); opacity: 0.9; }
        }
      `}</style>
    </div>,
    document.body
  );
}

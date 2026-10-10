'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import Kodo from '../brand/Kodo';
import { Buddy, CREW } from '../brand/Crew';
import { BlockPiece, Cottage } from '../brand/Stickers';
import FunButton from '../ui/FunButton';
import { PlayIcon } from '../ui/Icons';

const STEPS = [
  {
    title: 'Grab a block',
    text: 'Drag blocks out of the yellow shelf on the left of "Your code".',
    art: (
      <div className="flex flex-col items-center gap-1">
        <BlockPiece className="h-10 w-28 -rotate-6" fill="var(--color-leaf)" label="move" />
        <BlockPiece className="h-10 w-28 rotate-3" fill="var(--color-sky)" label="turn" />
      </div>
    ),
  },
  {
    title: 'Snap it on',
    text: 'Click it under the pink "when Go is pressed" block. Kodo reads from top to bottom.',
    art: (
      <div className="flex flex-col items-center">
        <BlockPiece className="h-10 w-28" fill="var(--color-berry)" label="when Go" />
        <BlockPiece className="-mt-2 h-10 w-28" fill="var(--color-leaf)" label="move" />
      </div>
    ),
  },
  {
    title: 'Press Go!',
    text: 'Watch Kodo follow your code. Bumped into something? Change a block and try again.',
    art: (
      <div className="flex items-end gap-1">
        <Kodo className="h-16 w-16" mood="cheer" title="" aria-hidden="true" />
        <Cottage className="h-16 w-16" />
      </div>
    ),
  },
];

export default function HowToPlay({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-step]', { y: 40, opacity: 0, rotate: () => gsap.utils.random(-6, 6), stagger: 0.12, duration: 0.6, ease: 'back.out(1.7)' });
    }, ref);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div ref={ref} className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-labelledby="howto-title">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]" onClick={onClose} />
      <div className="card-sticker relative w-full max-w-3xl rounded-[34px] p-6 sm:p-8">
        <p className="font-display text-2xl text-berry-deep">Hi, I&apos;m Kodo!</p>
        <h2 id="howto-title" className="text-3xl font-bold sm:text-4xl">Can you help me get home?</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} data-step className="flex flex-col items-center rounded-3xl bg-cream p-4 text-center">
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-sun font-display font-bold text-onfill">{i + 1}</span>
              <div className="flex h-24 items-center justify-center">{step.art}</div>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-1 text-sm font-semibold text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
        <ul className="mt-5 grid gap-2 sm:grid-cols-3" aria-label="Kodo's friends">
          {[
            ['sunny', 'cheers when you get Kodo home and shows you new blocks.'],
            ['bloo', 'spots steps that repeat and suggests a loop.'],
            ['zip', 'pops up with a hint when something goes wrong.'],
          ].map(([id, text]) => (
            <li key={id} data-step className="flex items-center gap-3 rounded-3xl p-3" style={{ backgroundColor: CREW[id].soft }}>
              <Buddy who={id} shadow={false} title="" className="h-12 w-12 shrink-0" />
              <p className="text-sm font-semibold leading-snug">
                <span className="font-display text-base">{CREW[id].name}</span> {text}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center">
          <FunButton size="lg" onClick={onClose} icon={<PlayIcon className="h-6 w-6" />}>
            Let&apos;s play!
          </FunButton>
        </div>
      </div>
    </div>,
    document.body
  );
}

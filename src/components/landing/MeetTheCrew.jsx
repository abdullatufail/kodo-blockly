'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Buddy, CREW, CREW_IDS } from '../brand/Crew';
import { whenRevealed } from '@/lib/pageReveal';

gsap.registerPlugin(ScrollTrigger);

// What each friend does when you poke them.
const POKE = { kodo: 'cheer', sunny: 'cheer', bloo: 'wink', zip: 'wow' };

function CrewMember({ id }) {
  const friend = CREW[id];
  const [mood, setMood] = useState('happy');

  return (
    <li className="crew-card group flex flex-col items-center text-center sm:items-start sm:text-left">
      <div className="crew-disc crew-pop w-full max-w-[15rem]">
        <button
          type="button"
          className="relative flex aspect-square w-full items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] hover:-rotate-6 hover:scale-105 active:scale-95"
          style={{ backgroundColor: friend.soft }}
          onPointerEnter={() => setMood(POKE[id])}
          onPointerLeave={() => setMood('happy')}
          onFocus={() => setMood(POKE[id])}
          onBlur={() => setMood('happy')}
          aria-label={`Say hi to ${friend.name}`}
        >
          <Buddy who={id} mood={mood} shadow={false} title="" className="crew-buddy w-[58%]" />
        </button>
      </div>
      <h3 className="mt-6 text-5xl leading-none">{friend.name}</h3>
      <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.12em] text-leaf-deep">{friend.role}</p>
      <p className="mt-3 max-w-[16rem] font-semibold text-ink-soft">{friend.text}</p>
    </li>
  );
}

export default function MeetTheCrew({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia(root);
    let cancelled = false;
    whenRevealed().then(() => {
      if (cancelled) return;
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.querySelector('.crew-grid'),
            start: 'top 82%',
            once: true,
          },
        });
        // fromTo so the end state never depends on what the element looks like mid-hover.
        tl.fromTo(
          '.crew-pop',
          { scale: 0, rotate: -40 },
          {
            scale: 1,
            rotate: 0,
            duration: 0.7,
            ease: 'back.out(1.8)',
            stagger: 0.12,
          },
        )
          .fromTo(
            '.crew-buddy',
            { yPercent: 60, scaleY: 0.5, opacity: 0 },
            {
              yPercent: 0,
              scaleY: 1,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(2.4)',
              stagger: 0.12,
            },
            0.25,
          )
          .from(
            '.crew-card > :not(.crew-disc)',
            {
              y: 24,
              opacity: 0,
              duration: 0.5,
              ease: 'back.out(1.6)',
              stagger: 0.04,
            },
            0.4,
          );
      });
    });
    return () => {
      cancelled = true;
      mm.revert();
    };
  }, []);

  return (
    <section ref={ref} className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`} aria-labelledby="crew-title">
      <div className="text-center">
        <p className="font-display text-2xl text-leaf-deep">little friends, big ideas</p>
        <h2 id="crew-title" className="reveal-head headline mt-2 text-6xl sm:text-8xl">
          Meet the crew
        </h2>
      </div>
      <ul className="crew-grid mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {CREW_IDS.map((id) => (
          <CrewMember key={id} id={id} />
        ))}
      </ul>
    </section>
  );
}

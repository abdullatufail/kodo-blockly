'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { whenRevealed } from '@/lib/pageReveal';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

// Playful scroll reveals shared by the content pages:
//   .reveal-head   words rise out of a mask
//   .reveal-up     the element bounces up with a little tilt
//   .story-card    its badge pops and any circled phrase gets scribbled in
// Pass a `key` that changes when new content mounts (e.g. a tab switch).
export function useReveal(rootRef, key) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    let cancelled = false;

    Promise.all([document.fonts.ready, whenRevealed()]).then(() => {
      if (cancelled) return;
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const splits = gsap.utils.toArray('.reveal-head', root).map((el) => {
          const split = SplitText.create(el, { type: 'words', mask: 'words' });
          gsap.from(split.words, {
            yPercent: 110,
            duration: 0.8,
            ease: 'back.out(1.4)',
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
          return split;
        });

        gsap.utils.toArray('.reveal-up', root).forEach((el, i) => {
          gsap.from(el, {
            y: 80,
            rotate: i % 2 ? 4 : -4,
            opacity: 0,
            duration: 0.9,
            ease: 'back.out(1.5)',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        });

        gsap.utils.toArray('.story-card', root).forEach((card) => {
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: 'top 80%', once: true } })
            .from(card.querySelector('.story-badge'), { scale: 0, rotate: -90, duration: 0.6, ease: 'back.out(2.5)' })
            .from(card.querySelectorAll('.story-circle'), { drawSVG: '0%', duration: 0.7, ease: 'power2.inOut' }, '-=0.2');
        });

        return () => splits.forEach((split) => split.revert());
      });
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [rootRef, key]);
}

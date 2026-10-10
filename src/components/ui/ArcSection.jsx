'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const W = 1440;
const H = 160;
const arc = (lift) => `M0 ${H} C${W * 0.25} ${H - lift} ${W * 0.75} ${H - lift} ${W} ${H} Z`;

// A full-width section whose top edge is a soft dome. As the section scrolls
// into view the dome swells upward, like a hill rising to meet you.
export default function ArcSection({ color = 'var(--color-paper)', className = '', wrapperClassName = '', children, ...props }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const shape = { lift: 10 };
      path.setAttribute('d', arc(shape.lift));
      gsap.to(shape, {
        lift: H * 1.25,
        ease: 'none',
        immediateRender: true,
        onUpdate: () => path.setAttribute('d', arc(shape.lift)),
        scrollTrigger: { trigger: path, start: 'top bottom', end: 'top 35%', scrub: 0.6 },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div className={`relative ${wrapperClassName}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 block h-16 w-full -translate-y-[calc(100%-1px)] sm:h-28"
        aria-hidden="true"
      >
        <path ref={pathRef} d={arc(H * 1.25)} fill={color} />
      </svg>
      <section className={`relative ${className}`} style={{ backgroundColor: color }} {...props}>
        {children}
      </section>
    </div>
  );
}

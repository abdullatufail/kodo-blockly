'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// The road is designed on a 100 × 1000 grid and rescaled to the real size of
// its box, so the stroke keeps an even width and DrawSVG measures it correctly.
const ROAD_POINTS = 'M50 -40 C50 60 88 80 86 190 C84 300 14 300 14 400 C14 500 86 500 86 600 C86 700 14 700 14 800 C14 900 50 930 50 1040';

function scaleRoad(w, h) {
  let i = 0;
  return ROAD_POINTS.replace(/-?\d+(\.\d+)?/g, (n) => {
    const v = Number(n);
    const out = i % 2 === 0 ? (v / 100) * w : (v / 1000) * h;
    i += 1;
    return out.toFixed(1);
  });
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function SkillsRoad({ className = '' }) {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 1000, h: 1000 });

  useIsoLayoutEffect(() => {
    const el = ref.current;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) setSize((s) => (Math.abs(s.w - width) < 1 && Math.abs(s.h - height) < 1 ? s : { w: width, h: height }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Re-measure scroll animations once the road has its new shape.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [size]);

  return (
    <svg ref={ref} className={className} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
      <path className="skills-road" d={scaleRoad(size.w, size.h)} fill="none" stroke="var(--color-paper)" strokeWidth="44" strokeLinecap="round" />
    </svg>
  );
}

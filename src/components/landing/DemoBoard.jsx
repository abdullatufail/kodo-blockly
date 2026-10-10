'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Kodo from '../brand/Kodo';
import { Berry, Cottage } from '../brand/Stickers';

gsap.registerPlugin(ScrollTrigger);

const C = 64;
const COLS = 5;
const ROWS = 3;
const PATH = [
  [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [3, 0], [4, 0],
];
const TREES = [[0, 0], [4, 2], [3, 1]];
const BERRY = [2, 1];

// A tiny program that matches the walk above. `steps` says which cells each block moves through.
const BLOCKS = [
  { label: 'when Go is pressed', color: 'var(--color-berry)', hat: true },
  { label: 'repeat 2', inner: 'move forward', color: 'var(--color-sun)', steps: [[1, 2], [2, 2]] },
  { label: 'turn left', color: 'var(--color-sky)', look: [0, -10] },
  { label: 'repeat 2', inner: 'move forward', color: 'var(--color-sun)', steps: [[2, 1], [2, 0]] },
  { label: 'turn right', color: 'var(--color-sky)', look: [13, 0] },
  { label: 'repeat 2', inner: 'move forward', color: 'var(--color-sun)', steps: [[3, 0], [4, 0]] },
];

const center = ([x, y]) => ({ x: x * C + C / 2, y: y * C + C / 2 });

function FlatTree({ x, y }) {
  const { x: cx, y: cy } = center([x, y]);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <ellipse cx="0" cy="22" rx="18" ry="4" fill="var(--color-ink)" opacity="0.15" />
      <rect x="-3" y="4" width="6" height="18" rx="3" fill="var(--color-ink)" />
      <circle cx="0" cy="-4" r="18" fill="var(--color-leaf-deep)" />
      <path d="M-9 -6 q3 -4 6 0 q3 -4 6 0 M-4 4 q3 -4 6 0 q3 -4 6 0" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

export default function DemoBoard() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const blocks = gsap.utils.toArray('[data-block]', root);
    const walker = root.querySelector('.demo-walker');
    const hop = root.querySelector('.demo-hop');
    const pupils = root.querySelector('.kodo-pupils');
    const berry = root.querySelector('.demo-berry');
    const sparkles = gsap.utils.toArray('.demo-spark', root);

    const highlight = (i) => blocks.forEach((b, j) => (b.dataset.active = String(j === i)));

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });
      tl.set(walker, { ...center(PATH[0]), scale: 1, opacity: 1 })
        .set(berry, { scale: 1, opacity: 1, transformOrigin: '50% 50%' })
        .set(pupils, { x: 13, y: 0 })
        .set(sparkles, { scale: 0, opacity: 0 })
        .call(() => highlight(0))
        .to({}, { duration: 0.7 });

      BLOCKS.forEach((block, i) => {
        if (block.hat) return;
        tl.call(() => highlight(i));
        if (block.look) {
          tl.to(pupils, { x: block.look[0], y: block.look[1], duration: 0.25 })
            .to(hop, { rotation: block.look[0] > 0 ? 10 : -10, duration: 0.15, yoyo: true, repeat: 1, transformOrigin: '50% 100%' }, '<')
            .to({}, { duration: 0.35 });
        }
        (block.steps || []).forEach(([x, y]) => {
          tl.to(walker, { ...center([x, y]), duration: 0.42, ease: 'power2.inOut' })
            .to(hop, { y: -14, duration: 0.21, yoyo: true, repeat: 1, ease: 'power1.out' }, '<');
          if (x === BERRY[0] && y === BERRY[1]) {
            tl.to(berry, { scale: 1.5, opacity: 0, duration: 0.3, ease: 'back.in(2)' }, '-=0.1');
          }
        });
      });

      tl.call(() => highlight(-1))
        .to(hop, { y: -26, duration: 0.25, yoyo: true, repeat: 3, ease: 'power1.out' })
        .to(sparkles, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(3)' }, '<')
        .to(sparkles, { scale: 0, opacity: 0, duration: 0.3 }, '+=0.4')
        .to(walker, { opacity: 0, scale: 0.6, duration: 0.3 });

      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
      return () => {
        st.kill();
        tl.kill();
      };
    });
    return () => mm.revert();
  }, []);

  const home = center(PATH[PATH.length - 1]);
  const berryAt = center(BERRY);

  return (
    <div ref={rootRef} className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <ol className="flex shrink-0 flex-col gap-1.5 sm:w-52" aria-label="Kodo's program">
        {BLOCKS.map((b, i) => (
          <li
            key={i}
            data-block
            data-active="false"
            className={`origin-left rounded-xl px-3 py-1.5 font-display text-sm font-semibold text-onfill transition-[transform,box-shadow] duration-200 data-[active=true]:translate-x-1.5 data-[active=true]:scale-105 data-[active=true]:shadow-[0_0_0_4px_var(--color-paper)] ${
              b.hat ? 'rounded-t-[18px]' : 'ml-3'
            }`}
            style={{ backgroundColor: b.color }}
          >
            {b.label}
            {b.inner && (
              <span className="mt-1 block rounded-lg bg-leaf px-2 py-0.5 text-xs">{b.inner}</span>
            )}
          </li>
        ))}
      </ol>

      <svg viewBox={`-8 -8 ${COLS * C + 16} ${ROWS * C + 16}`} className="w-full min-w-0 flex-1" role="img" aria-label="Kodo walks along the path, grabs a berry and reaches home">
        <rect x="-8" y="-8" width={COLS * C + 16} height={ROWS * C + 16} rx="24" fill="var(--color-grass)" />
        {PATH.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x * C + 5} y={y * C + 5} width={C - 10} height={C - 10} rx="14" fill="var(--color-sand)" />
        ))}
        {PATH.slice(1).map(([x, y], i) => {
          const [px, py] = PATH[i];
          const a = center([px, py]);
          const b = center([x, y]);
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--color-sand)" strokeWidth={C - 10} />;
        })}
        {PATH.slice(1).map(([x, y], i) => {
          const a = center(PATH[i]);
          const b = center([x, y]);
          return <line key={`d${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--color-sand-deep)" strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" />;
        })}
        {TREES.map(([x, y]) => (
          <FlatTree key={`${x}-${y}`} x={x} y={y} />
        ))}
        <Cottage x={home.x - 34} y={home.y - 44} width="68" height="68" />
        <g className="demo-berry">
          <Berry x={berryAt.x - 18} y={berryAt.y - 20} width="36" height="36" />
        </g>
        {[[-30, -40], [28, -46], [36, -10], [-36, -8]].map(([dx, dy], i) => (
          <path
            key={i}
            className="demo-spark"
            transform={`translate(${home.x + dx} ${home.y + dy})`}
            d="M0 -9 C1 -2 2 -1 9 0 C2 1 1 2 0 9 C-1 2 -2 1 -9 0 C-2 -1 -1 -2 0 -9 Z"
            fill="var(--color-peach-deep)"
            opacity="0"
          />
        ))}
        <g className="demo-walker" transform={`translate(${center(PATH[0]).x} ${center(PATH[0]).y})`}>
          <g className="demo-hop">
            <Kodo x="-30" y="-44" width="60" height="60" shadow={false} blink title="" />
          </g>
        </g>
      </svg>
    </div>
  );
}

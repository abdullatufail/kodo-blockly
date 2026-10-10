'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import Kodo from '../brand/Kodo';
import { Sunny } from '../brand/Crew';
import { Cottage } from '../brand/Stickers';
import FunButton from '../ui/FunButton';
import { ArrowRightIcon, CloseIcon, PlayIcon } from '../ui/Icons';

// When a level brings in a new block, Sunny shows it off: what the block
// looks like, what it does in plain words, and a tiny looping demo of Kodo
// doing it.

const C = 60;
const ANGLE = { EAST: 0, SOUTH: 90, WEST: 180, NORTH: -90 };
const LOOK = { EAST: [13, 0], SOUTH: [0, 9], WEST: [-13, 0], NORTH: [0, -10] };

const COLOR = {
  move: 'var(--color-leaf)',
  turn: 'var(--color-sky)',
  loop: 'var(--color-sun)',
  while: 'var(--color-peach)',
  logic: 'var(--color-grape)',
};
const MOVE = { label: 'move forward', icon: 'move', color: COLOR.move };
const TURN_RIGHT = { label: 'turn right', icon: 'right', color: COLOR.turn };

// map: . path   # bush   H home   T path that a bush pops onto halfway through
const BLOCKS = {
  move_forward: {
    ...MOVE,
    title: 'Move forward',
    text: 'Kodo hops one square forward, the way its eyes are looking.',
    scene: { map: ['....'], start: [0, 0, 'EAST'] },
    play: (d) => {
      d.part('outer');
      d.hop(1, 0);
      d.wait(0.5);
    },
  },
  turn_right: {
    ...TURN_RIGHT,
    title: 'Turn right',
    text: 'Kodo spins to face its right. It stays on the same square, only the way it looks changes.',
    scene: { map: ['...', '...', '...'], start: [1, 1, 'EAST'] },
    play: (d) => {
      d.part('outer');
      d.turn('SOUTH');
      d.wait(0.6);
    },
  },
  turn_left: {
    label: 'turn left',
    icon: 'left',
    color: COLOR.turn,
    title: 'Turn left',
    text: 'Kodo spins to face its left. It stays on the same square, only the way it looks changes.',
    scene: { map: ['...', '...', '...'], start: [1, 1, 'EAST'] },
    play: (d) => {
      d.part('outer');
      d.turn('NORTH');
      d.wait(0.6);
    },
  },
  repeat_times: {
    label: 'repeat 3 times',
    icon: 'repeat',
    color: COLOR.loop,
    inner: [MOVE],
    title: 'Repeat',
    text: 'Does the blocks inside again and again. Change the number to pick how many times. Way fewer blocks!',
    counter: 3,
    scene: { map: ['....'], start: [0, 0, 'EAST'] },
    play: (d) => {
      [1, 2, 3].forEach((n) => {
        d.part('outer');
        d.count(n);
        d.part('inner0');
        d.hop(n, 0);
      });
      d.wait(0.5);
    },
  },
  while_path: {
    label: 'while path ahead',
    icon: 'repeat',
    color: COLOR.while,
    inner: [MOVE],
    title: 'While path',
    text: 'Keeps doing the blocks inside as long as there is a path. When something is in the way, it stops.',
    scene: { map: ['...#'], start: [0, 0, 'EAST'] },
    play: (d) => {
      [1, 2].forEach((x) => {
        d.part('outer');
        d.peek(x, 0, true);
        d.part('inner0');
        d.hop(x, 0);
      });
      d.part('outer');
      d.peek(3, 0, false);
      d.part(null);
      d.wait(0.5);
    },
  },
  repeat_until_goal: {
    label: 'repeat until home',
    icon: 'repeat',
    color: COLOR.while,
    inner: [MOVE],
    title: 'Repeat until home',
    text: 'Keeps going round and round until Kodo gets home. No counting needed!',
    scene: { map: ['...H'], start: [0, 0, 'EAST'] },
    play: (d) => {
      [1, 2, 3].forEach((x) => {
        d.part('outer');
        d.part('inner0');
        d.hop(x, 0);
      });
      d.part(null);
      d.party();
    },
  },
  if_path_ahead: {
    label: 'if path to the right',
    icon: 'peek',
    color: COLOR.logic,
    inner: [TURN_RIGHT],
    title: 'If path',
    text: 'Kodo peeks first. Only if there is a path that way does it do the blocks inside. Pick ahead, left or right in the menu.',
    scene: { map: ['.#', 'T.'], start: [0, 0, 'EAST'] },
    play: (d) => {
      d.part('outer');
      d.peek(0, 1, true);
      d.part('inner0');
      d.turn('SOUTH');
      d.wait(0.5);
      d.restart();
      d.bush(true);
      d.part('outer');
      d.peek(0, 1, false);
      d.part(null);
      d.wait(0.4);
    },
  },
  if_else_path: {
    label: 'if path ahead',
    icon: 'peek',
    color: COLOR.logic,
    inner: [MOVE],
    elseInner: [TURN_RIGHT],
    title: 'If path… else',
    text: 'If there is a path, Kodo does the top part. If not, it does the “else” part instead.',
    scene: { map: ['.T', '..'], start: [0, 0, 'EAST'] },
    play: (d) => {
      d.part('outer');
      d.peek(1, 0, true);
      d.part('inner0');
      d.hop(1, 0);
      d.wait(0.4);
      d.restart();
      d.bush(true);
      d.part('outer');
      d.peek(1, 0, false);
      d.part('else0');
      d.turn('SOUTH');
      d.wait(0.5);
    },
  },
};

export const BLOCK_INTROS = BLOCKS;

const ICON_PATHS = {
  move: <><path d="M12 20V5" /><path d="m6 11 6-6 6 6" /></>,
  left: <><path d="M9 14 4 9l5-5" /><path d="M4 9h9a6 6 0 0 1 0 12h-1" /></>,
  right: <><path d="m15 14 5-5-5-5" /><path d="M20 9h-9a6 6 0 0 0 0 12h1" /></>,
  repeat: <><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>,
  peek: <><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="2.6" fill="currentColor" /></>,
};

function BlockIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

const partClass =
  'transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] data-[active=true]:-rotate-2 data-[active=true]:scale-[1.07]';

function Pill({ block, part }) {
  return (
    <div data-part={part} className={`flex w-max items-center gap-2 rounded-xl px-3 py-1.5 font-display text-lg text-onfill ${partClass}`} style={{ backgroundColor: block.color }}>
      <BlockIcon name={block.icon} />
      {block.label}
    </div>
  );
}

// A flat copy of the block, the same colours as in the code editor.
function Replica({ block }) {
  if (!block.inner) return <Pill block={block} part="outer" />;
  const mouth = (list, prefix) => (
    <div className="ml-4 flex flex-col gap-1 rounded-l-xl bg-paper p-1.5">
      {list.map((b, i) => (
        <Pill key={i} block={b} part={`${prefix}${i}`} />
      ))}
    </div>
  );
  return (
    <div className="w-max rounded-2xl pb-3 pt-0.5" style={{ backgroundColor: block.color }}>
      <div data-part="outer" className={`flex origin-left items-center gap-2 px-3 py-1.5 font-display text-lg text-onfill ${partClass}`}>
        <BlockIcon name={block.icon} />
        {block.label}
      </div>
      {mouth(block.inner, 'inner')}
      {block.elseInner && (
        <>
          <div className="px-3 py-1 font-display text-lg text-onfill">else</div>
          {mouth(block.elseInner, 'else')}
        </>
      )}
    </div>
  );
}

function DemoBush() {
  return (
    <g>
      <circle cx="-11" cy="6" r="13" fill="var(--color-leaf-deep)" />
      <circle cx="11" cy="6" r="13" fill="var(--color-leaf-deep)" />
      <circle cx="0" cy="-5" r="16" fill="var(--color-leaf)" />
    </g>
  );
}

const center = (x, y) => ({ x: x * C + C / 2, y: y * C + C / 2 });

function Demo({ type }) {
  const rootRef = useRef(null);
  const block = BLOCKS[type];
  const { map, start } = block.scene;
  const rows = map.length;
  const cols = map[0].length;

  useEffect(() => {
    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const [walker] = q('.dw');
    const [hop] = q('.dh');
    const [pupils] = q('.kodo-pupils');
    const [chip] = q('.dchip');
    const [glow] = q('.dglow');
    const [toggle] = q('.dtoggle');
    const [home] = q('.dhome');
    const counts = q('.dcount');
    // Block parts live just outside the svg, in the card.
    const parts = gsap.utils.toArray('[data-part]', root.closest('[data-intro]'));
    const setPart = (id) => parts.forEach((p) => (p.dataset.active = String(p.dataset.part === id)));
    const [sx, sy, sdir] = start;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
      const begin = () => {
        tl.set(walker, { ...center(sx, sy), opacity: 1 })
          .set(chip, { rotation: ANGLE[sdir], transformOrigin: '50% 50%' })
          .set(pupils, { x: LOOK[sdir][0], y: LOOK[sdir][1] })
          .set(hop, { x: 0, y: 0, rotation: 0 });
      };
      const d = {
        wait: (t) => tl.to({}, { duration: t }),
        part: (id) => tl.call(() => setPart(id)).to({}, { duration: 0.3 }),
        hop: (x, y) =>
          tl
            .to(walker, { ...center(x, y), duration: 0.45, ease: 'power2.inOut' })
            .to(hop, { y: -14, duration: 0.225, yoyo: true, repeat: 1, ease: 'power1.out' }, '<')
            .to({}, { duration: 0.2 }),
        turn: (dir) =>
          tl
            .to(chip, { rotation: ANGLE[dir], duration: 0.5, ease: 'back.out(2)' })
            .to(pupils, { x: LOOK[dir][0], y: LOOK[dir][1], duration: 0.3 }, '<')
            .to(hop, { rotation: ANGLE[dir] > ANGLE[sdir] ? 10 : -10, duration: 0.15, yoyo: true, repeat: 1, transformOrigin: '50% 100%' }, '<'),
        peek: (x, y, ok) =>
          tl
            .set(glow, { ...center(x, y), attr: { fill: ok ? 'var(--color-leaf)' : 'var(--color-berry)' } })
            .fromTo(glow, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.35, ease: 'back.out(2.5)', transformOrigin: '50% 50%' })
            .to(hop, ok ? { y: -4, duration: 0.15, yoyo: true, repeat: 1 } : { x: 4, duration: 0.07, yoyo: true, repeat: 5 })
            .to(glow, { opacity: 0, scale: 0.6, duration: 0.25 }, '+=0.25'),
        count: (n) =>
          tl.call(() => counts.forEach((c, i) => (c.dataset.on = String(i < n)))).fromTo(counts[n - 1], { scale: 0.5 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, '<'),
        bush: (show) => tl.to(toggle, { scale: show ? 1 : 0, duration: 0.4, ease: show ? 'back.out(2.5)' : 'back.in(2)', transformOrigin: '50% 80%' }),
        party: () =>
          tl
            .to(home, { scaleX: 1.08, scaleY: 0.92, duration: 0.14, yoyo: true, repeat: 3, transformOrigin: '50% 100%' })
            .to(hop, { y: -18, duration: 0.14, yoyo: true, repeat: 3 }, '<')
            .to({}, { duration: 0.3 }),
        restart: () => {
          tl.to(walker, { opacity: 0, duration: 0.2 });
          begin();
        },
      };

      tl.set(toggle, { scale: 0 }).call(() => {
        setPart(null);
        counts.forEach((c) => (c.dataset.on = 'false'));
      });
      begin();
      d.wait(0.5);
      block.play(d);
      if (toggle) d.bush(false);
      tl.to(walker, { opacity: 0, duration: 0.25 });
      return () => tl.kill();
    });
    return () => mm.revert();
  }, [block, start, type]);

  const cells = [];
  map.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const { x: cx, y: cy } = center(x, y);
      cells.push(
        <g key={`${x}-${y}`}>
          {ch !== '#' && <rect x={x * C + 4} y={y * C + 4} width={C - 8} height={C - 8} rx="14" fill="var(--color-sand)" />}
          {ch === '#' && (
            <g transform={`translate(${cx} ${cy})`}>
              <DemoBush />
            </g>
          )}
          {ch === 'T' && (
            <g transform={`translate(${cx} ${cy})`}>
              <g className="dtoggle" style={{ transform: 'scale(0)' }}>
                <DemoBush />
              </g>
            </g>
          )}
          {ch === 'H' && (
            <g className="dhome">
              <Cottage x={cx - 28} y={cy - 36} width="56" height="56" />
            </g>
          )}
        </g>
      );
    })
  );
  const s = center(start[0], start[1]);

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-3">
      <svg viewBox={`-6 -14 ${cols * C + 12} ${rows * C + 20}`} className="h-44 w-full" role="img" aria-label={`Kodo shows what "${block.label}" does`}>
        <rect x="-6" y="-6" width={cols * C + 12} height={rows * C + 12} rx="22" fill="var(--color-grass)" />
        {cells}
        <circle className="dglow" r="20" cx="0" cy="0" fill="var(--color-leaf)" opacity="0" />
        <g className="dw" transform={`translate(${s.x} ${s.y})`}>
          <g className="dh">
            <Kodo x="-27" y="-36" width="54" height="54" shadow={false} title="" />
          </g>
          <g className="dchip">
            <circle r="40" fill="transparent" />
            <g transform="translate(34 4)">
              <circle r="9" fill="var(--color-ink)" />
              <path d="M-2.5 -4 L2 0 L-2.5 4" fill="none" stroke="var(--color-paper)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </g>
      </svg>
      {block.counter && (
        <div className="flex gap-2" aria-hidden="true">
          {Array.from({ length: block.counter }, (_, i) => (
            <span
              key={i}
              data-on="false"
              className="dcount flex h-9 w-9 items-center justify-center rounded-full bg-paper font-display text-lg text-ink-soft transition-colors data-[on=true]:bg-sun data-[on=true]:text-ink"
            >
              {i + 1}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewBlockIntro({ blocks, onClose }) {
  const [page, setPage] = useState(0);
  const cardRef = useRef(null);
  const type = blocks[page];
  const block = BLOCKS[type];
  const last = page === blocks.length - 1;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { scale: 0.6, y: 60, rotate: -4, opacity: 0 }, { scale: 1, y: 0, rotate: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' });
      gsap.from('.intro-sunny', { y: 50, scaleY: 0.4, duration: 0.6, delay: 0.25, ease: 'back.out(2.5)' });
    }, cardRef);
    return () => {
      window.removeEventListener('keydown', onKey);
      ctx.revert();
    };
  }, [onClose]);

  if (!block || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]" onClick={onClose} />
      <div ref={cardRef} data-intro className="card-sticker relative mt-12 w-full max-w-2xl rounded-[34px] p-6 pt-10 sm:p-8 sm:pt-10">
        <Sunny className="intro-sunny absolute -top-14 left-6 h-24 w-24" mood="cheer" shadow={false} title="Sunny" />
        <button type="button" onClick={onClose} aria-label="Close" className="btn-chunky absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream">
          <CloseIcon />
        </button>

        <p className="font-display text-2xl text-leaf-deep">{blocks.length > 1 ? `new block ${page + 1} of ${blocks.length}!` : 'ooh, a new block!'}</p>
        <h2 id="intro-title" className="headline mt-1 text-5xl sm:text-6xl">
          {block.title}
        </h2>

        <div className="mt-5 grid items-center gap-5 sm:grid-cols-[1fr_1.15fr]">
          <div>
            <Replica block={block} />
            <p className="mt-4 text-lg font-semibold leading-snug text-ink-soft">{block.text}</p>
          </div>
          <div className="rounded-[26px] bg-cream p-3">
            <Demo key={type} type={type} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {blocks.length > 1 ? (
            <div className="flex gap-1.5" aria-hidden="true">
              {blocks.map((b, i) => (
                <span key={b} className={`h-2.5 rounded-full transition-all ${i === page ? 'w-7 bg-ink' : 'w-2.5 bg-line'}`} />
              ))}
            </div>
          ) : (
            <span />
          )}
          {last ? (
            <FunButton onClick={onClose} icon={<PlayIcon className="h-5 w-5" />}>
              Got it, let&apos;s code!
            </FunButton>
          ) : (
            <FunButton color="sun" onClick={() => setPage((p) => p + 1)} iconAfter={<ArrowRightIcon />}>
              Next block
            </FunButton>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

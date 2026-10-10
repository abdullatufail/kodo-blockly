'use client';

import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import Kodo from './brand/Kodo';
import { Heart, Star } from './brand/Stickers';
import { BerryArt, blobCellPath, CELL, GrassDetail, Home, Obstacle } from './game/BoardArt';
import { sfx } from '@/lib/sfx';

const PAD = 18;
const ANGLE = { EAST: 0, SOUTH: 90, WEST: 180, NORTH: 270 };
const STEP = { NORTH: [0, -1], EAST: [1, 0], SOUTH: [0, 1], WEST: [-1, 0] };

// The puzzle board. GamePlay drives it through the ref:
//   play(frames, { speed, onFrame }) -> Promise   animate a run from the engine
//   reset()                                       put Kodo back at the start
//   celebrate() / setSpeed(n)
export default function GameBoard({ level, scenery = 'garden', ref }) {
  const { grid, water, berries, startPosition, startDirection, goalPosition } = level;
  const rows = grid.length;
  const cols = grid[0].length;
  const W = cols * CELL;
  const H = rows * CELL;

  const kodoRef = useRef(null);
  const hopRef = useRef(null);
  const arrowRef = useRef(null);
  const ouchRef = useRef(null);
  const heartsRef = useRef(null);
  const berryRefs = useRef(new Map());
  const timelineRef = useRef(null);
  const angleRef = useRef(ANGLE[startDirection]);
  const [facing, setFacing] = useState(startDirection);
  const [mood, setMood] = useState('happy');

  const isPath = useCallback((x, y) => grid[y]?.[x] !== undefined && grid[y][x] !== 'OBSTACLE', [grid]);
  const isWater = useCallback((x, y) => !!water[y]?.[x], [water]);

  const cells = useMemo(() => grid.flatMap((row, y) => row.map((tile, x) => ({ x, y, tile }))), [grid]);

  // Puts every sprite back where the level starts (GSAP only, no React state).
  const placeSprites = useCallback(() => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    angleRef.current = ANGLE[startDirection];
    gsap.set(kodoRef.current, { x: startPosition.x * CELL, y: startPosition.y * CELL });
    gsap.set(hopRef.current, { y: 0, scaleX: 1, scaleY: 1, rotation: 0 });
    gsap.set(arrowRef.current, { rotation: angleRef.current, svgOrigin: '50 50' });
    gsap.set(ouchRef.current, { opacity: 0 });
    gsap.set(heartsRef.current, { opacity: 0 });
    berryRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, scale: 1, y: 0, svgOrigin: '50 50' }));
  }, [startDirection, startPosition]);

  const placeAtStart = useCallback(() => {
    placeSprites();
    setFacing(startDirection);
    setMood('happy');
  }, [placeSprites, startDirection]);

  // Place everything when the level loads (state already starts there). Kill any running animation on unmount.
  useEffect(() => {
    placeSprites();
    return () => timelineRef.current?.kill();
  }, [placeSprites]);

  useImperativeHandle(ref, () => ({
    reset: placeAtStart,

    setSpeed(speed) {
      timelineRef.current?.timeScale(speed);
    },

    play(frames, { speed = 1, onFrame } = {}) {
      placeAtStart();
      return new Promise((resolve) => {
        const kodo = kodoRef.current;
        const hop = hopRef.current;
        const tl = gsap.timeline({ paused: true, onComplete: resolve });
        timelineRef.current = tl;

        frames.forEach((frame) => {
          tl.call(() => onFrame?.(frame));

          if (frame.kind === 'check') {
            tl.to({}, { duration: 0.16 });
          } else if (frame.kind === 'move') {
            tl.call(() => sfx.step());
            tl.to(kodo, { x: frame.x * CELL, y: frame.y * CELL, duration: 0.42, ease: 'power1.inOut' });
            tl.to(hop, { y: -24, duration: 0.21, ease: 'sine.out', yoyo: true, repeat: 1 }, '<');
            tl.to(hop, { scaleY: 0.84, scaleX: 1.12, svgOrigin: '50 74', duration: 0.07, yoyo: true, repeat: 1 });
            if (frame.berry) {
              const el = berryRefs.current.get(`${frame.x},${frame.y}`);
              tl.call(() => sfx.berry());
              tl.to(el, { y: -60, scale: 1.5, opacity: 0, svgOrigin: '50 50', duration: 0.5, ease: 'back.in(1.4)' }, '<');
            }
          } else if (frame.kind === 'turn') {
            angleRef.current += frame.side === 'right' ? 90 : -90;
            const angle = angleRef.current;
            tl.call(() => {
              sfx.turn();
              setFacing(frame.dir);
            });
            tl.to(arrowRef.current, { rotation: angle, svgOrigin: '50 50', duration: 0.3, ease: 'back.out(2)' });
            tl.to(hop, { rotation: frame.side === 'right' ? 10 : -10, svgOrigin: '50 72', duration: 0.12, yoyo: true, repeat: 1 }, '<');
          } else if (frame.kind === 'bump') {
            const [dx, dy] = STEP[frame.dir];
            tl.call(() => {
              sfx.bump();
              setMood('oops');
            });
            tl.to(kodo, { x: frame.x * CELL + dx * 32, y: frame.y * CELL + dy * 32, duration: 0.16, ease: 'power2.in' });
            tl.set(ouchRef.current, { x: frame.x * CELL + dx * 55, y: frame.y * CELL + dy * 55 - 20 });
            tl.fromTo(ouchRef.current, { opacity: 1, scale: 0.4, svgOrigin: '50 50' }, { scale: 1.2, duration: 0.25, ease: 'back.out(3)' });
            tl.to(kodo, { x: frame.x * CELL, y: frame.y * CELL, duration: 0.45, ease: 'bounce.out' });
            tl.to(ouchRef.current, { opacity: 0, duration: 0.3 }, '-=0.15');
          }
        });

        tl.timeScale(speed).play();
      });
    },

    celebrate() {
      setMood('cheer');
      const hop = hopRef.current;
      gsap
        .timeline()
        .to(hop, { y: -36, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 3 })
        .fromTo(
          heartsRef.current,
          { opacity: 1, y: 0 },
          { y: -70, opacity: 0, duration: 1.4, ease: 'power1.out' },
          0
        );
    },

    sulk() {
      setMood('oops');
    },
  }));

  const salt = level.id * 13;

  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${W + PAD * 2} ${H + PAD * 2}`}
      className="h-full w-full"
      role="img"
      aria-label={`Puzzle board, ${cols} squares wide and ${rows} squares tall. Kodo starts facing ${startDirection.toLowerCase()}.`}
    >
      {/* Lawn */}
      <rect x={-PAD} y={-PAD} width={W + PAD * 2} height={H + PAD * 2} rx="34" fill="var(--color-grass)" />
      {cells.map(({ x, y }) =>
        (x + y) % 2 === 0 ? <rect key={`c${x}-${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} fill="var(--color-grass-deep)" opacity="0.18" /> : null
      )}
      {cells.map(({ x, y, tile }) => (tile === 'OBSTACLE' && !isWater(x, y) ? <GrassDetail key={`g${x}-${y}`} x={x} y={y} salt={salt} /> : null))}

      {/* Ponds */}
      {cells.map(({ x, y }) =>
        isWater(x, y) ? <path key={`w${x}-${y}`} d={blobCellPath(x, y, isWater, 8, 30)} fill="var(--color-sky)" /> : null
      )}
      {cells.map(({ x, y }) =>
        isWater(x, y) && (x + y) % 2 === 0 ? (
          <g key={`lily${x}-${y}`} transform={`translate(${x * CELL + 30} ${y * CELL + 40})`}>
            <path d="M0 10 A14 10 0 1 1 14 18 L10 8 Z" fill="var(--color-leaf-deep)" />
            <path d="M34 34 q8 -6 16 0" fill="none" stroke="var(--color-paper)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </g>
        ) : null
      )}

      {/* Sandy trail */}
      {cells.map(({ x, y, tile }) =>
        tile !== 'OBSTACLE' ? <path key={`p${x}-${y}`} d={blobCellPath(x, y, isPath)} fill="var(--color-sand)" /> : null
      )}
      {/* Dotted seams so kids can count the squares */}
      {cells.map(({ x, y, tile }) => {
        if (tile === 'OBSTACLE') return null;
        const seams = [];
        if (isPath(x + 1, y)) seams.push(<path key="r" d={`M${(x + 1) * CELL} ${y * CELL + 22} V${y * CELL + 78}`} />);
        if (isPath(x, y + 1)) seams.push(<path key="d" d={`M${x * CELL + 22} ${(y + 1) * CELL} H${x * CELL + 78}`} />);
        return (
          <g key={`s${x}-${y}`} stroke="var(--color-sand-deep)" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 11">
            {seams}
          </g>
        );
      })}

      {/* Start mat */}
      <g transform={`translate(${startPosition.x * CELL} ${startPosition.y * CELL})`}>
        <ellipse cx="50" cy="80" rx="34" ry="11" fill="var(--color-sand-deep)" opacity="0.6" />
      </g>

      {cells.map(({ x, y, tile }) =>
        tile === 'OBSTACLE' && !isWater(x, y) ? <Obstacle key={`o${x}-${y}`} x={x} y={y} scenery={scenery} salt={salt} /> : null
      )}

      <Home x={goalPosition.x} y={goalPosition.y} />
      <g ref={heartsRef} opacity="0" transform={`translate(${goalPosition.x * CELL} ${goalPosition.y * CELL - 30})`}>
        <Heart x="10" y="0" width="34" height="34" />
        <Heart x="55" y="-14" width="28" height="28" fill="var(--color-grape)" />
      </g>

      {berries.map(({ x, y }) => (
        <g key={`b${x}-${y}`} transform={`translate(${x * CELL} ${y * CELL})`}>
          <g ref={(el) => (el ? berryRefs.current.set(`${x},${y}`, el) : berryRefs.current.delete(`${x},${y}`))}>
            <BerryArt />
          </g>
        </g>
      ))}

      {/* Kodo + the arrow showing which way it faces */}
      <g ref={kodoRef}>
        <g ref={arrowRef}>
          <g transform="translate(97 50)">
            <circle r="13" fill="var(--color-ink)" />
            <path d="M-4 -6 L4 0 L-4 6" fill="none" stroke="var(--color-paper)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <g ref={hopRef}>
          <Kodo x="6" y="-8" width="88" height="88" mood={mood} look={facing} title="" aria-hidden="true" />
        </g>
      </g>

      <g ref={ouchRef} opacity="0">
        <Star x="10" y="10" width="34" height="34" fill="var(--color-sun-deep)" />
        <Star x="46" y="0" width="24" height="24" fill="var(--color-berry)" />
        <Star x="40" y="40" width="20" height="20" />
      </g>
    </svg>
  );
}

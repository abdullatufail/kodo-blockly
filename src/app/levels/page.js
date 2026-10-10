'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Kodo from '@/components/brand/Kodo';
import Blob from '@/components/brand/Blobs';
import { Cloud, Cottage, Flower, Star, Sun } from '@/components/brand/Stickers';
import { Obstacle } from '@/components/game/BoardArt';
import FunButton from '@/components/ui/FunButton';
import { LockIcon, PlayIcon } from '@/components/ui/Icons';
import { levels, stages, getLevelsByStage, isLevelUnlocked } from '@/data/levels';
import { useProgress } from '@/hooks/useProgress';

gsap.registerPlugin(ScrollTrigger);

const STEP_Y = 132;
const TOP = 70;
// Where each stop sits across the trail, in % of the column width.
const WAVE = [50, 76, 60, 28, 44];

function SceneryBit({ scenery, salt, className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <Obstacle x={0} y={0} scenery={scenery} salt={salt} />
    </svg>
  );
}

function Trail({ points, height }) {
  // A smooth curve through every stop. x is in %, y in px; the stroke ignores the stretch.
  const d = points.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x} ${p.y - TOP}`;
    const prev = points[i - 1];
    const mid = (p.y - prev.y) / 2;
    return `${acc} C${prev.x} ${prev.y + mid} ${p.x} ${p.y - mid} ${p.x} ${p.y}`;
  }, '');
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d} V${height}`} fill="none" stroke="var(--color-sand)" strokeWidth="24" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path
        d={`${d} V${height}`}
        fill="none"
        stroke="var(--color-sand-deep)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 14"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function LevelStop({ level, x, y, state, stars, color }) {
  const style = { left: `${x}%`, top: y };
  const label = `Level ${level.id}: ${level.title}`;

  if (state === 'locked') {
    return (
      <div className="map-stop absolute -translate-x-1/2 -translate-y-1/2" style={style} aria-label={`${label} (locked)`}>
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-paper text-ink-soft">
          <LockIcon className="h-7 w-7" />
        </div>
      </div>
    );
  }

  return (
    <div className="map-stop absolute -translate-x-1/2 -translate-y-1/2" style={style}>
      {state === 'current' && (
        <>
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-4 border-ink/40" aria-hidden="true" />
          <Kodo className="pointer-events-none absolute -top-[74px] left-1/2 h-20 w-20 -translate-x-1/2 animate-bob" title="" aria-hidden="true" />
        </>
      )}
      <Link
        href={`/level/${level.id}`}
        aria-label={`${label}${state === 'done' ? `, ${stars} of 3 stars` : ''}`}
        className="btn-chunky group relative flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full font-display text-3xl font-bold text-onfill"
        style={{ backgroundColor: color }}
      >
        <span className="transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">{level.id}</span>
      </Link>
      {state === 'done' ? (
        <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 gap-0.5">
          {[1, 2, 3].map((i) => (
            <Star key={i} className={`h-6 w-6 ${i === 2 ? '-translate-y-1' : ''}`} fill={i <= stars ? 'var(--color-ink)' : 'var(--color-line)'} />
          ))}
        </div>
      ) : (
        <span className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-lg bg-paper px-2 py-0.5 font-display text-xs font-semibold">
          <PlayIcon className="h-3 w-3" /> Play!
        </span>
      )}
      <p
        className={`pointer-events-none absolute top-1/2 hidden w-32 -translate-y-1/2 font-display text-sm font-semibold leading-tight text-ink-soft sm:block ${
          x > 55 ? 'right-full mr-4 text-right' : 'left-full ml-4'
        }`}
      >
        {level.title}
      </p>
    </div>
  );
}

export default function LevelsPage() {
  const { progress, totalStars, loading } = useProgress();
  const rootRef = useRef(null);

  const completed = levels.filter((l) => progress[l.id]?.completed).length;
  const current = levels.find((l) => !progress[l.id]?.completed && isLevelUnlocked(l.id, progress)) || levels[levels.length - 1];

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.map-stop', {
        start: 'top 92%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(batch, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'back.out(2)', overwrite: true }),
      });
      gsap.utils.toArray('.land-banner').forEach((el) => {
        gsap.from(el, { y: 50, rotate: -2, opacity: 0, duration: 0.7, ease: 'back.out(1.6)', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
    }, rootRef);

    // Bring the next level into view for returning players.
    const target = document.getElementById(`stop-${current.id}`);
    if (target && current.id > 1) target.scrollIntoView({ block: 'center', behavior: 'smooth' });

    return () => ctx.revert();
  }, [loading, current.id]);

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 text-center sm:px-6">
        <p className="font-display text-3xl text-leaf-deep">Kodo&apos;s long way home</p>
        <h1 className="headline mt-2 text-6xl sm:text-7xl">Pick a level!</h1>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="card-sticker flex items-center gap-2 rounded-2xl px-4 py-2 font-display text-lg font-semibold">
            <Star className="h-7 w-7" /> {totalStars} / {levels.length * 3} stars
          </span>
          <span className="card-sticker flex items-center gap-2 rounded-2xl px-4 py-2 font-display text-lg font-semibold">
            <Cottage className="h-7 w-7" /> {completed} / {levels.length} levels
          </span>
          {!loading && (
            <FunButton href={`/level/${current.id}`} color="leaf" icon={<PlayIcon />}>
              {completed === 0 ? 'Start playing' : `Continue: level ${current.id}`}
            </FunButton>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {stages.map((stage, stageIndex) => {
          const stageLevels = getLevelsByStage(stage.id);
          const doneHere = stageLevels.filter((l) => progress[l.id]?.completed).length;
          const starsHere = stageLevels.reduce((sum, l) => sum + (progress[l.id]?.stars || 0), 0);
          const points = stageLevels.map((_, i) => ({ x: WAVE[i % WAVE.length], y: TOP + i * STEP_Y }));
          const height = TOP + stageLevels.length * STEP_Y;

          return (
            <section key={stage.id} className="relative mt-10" aria-labelledby={`land-${stage.id}`}>
              <div className="land-banner card-sticker relative z-10 flex flex-col gap-4 overflow-hidden rounded-[30px] p-5 sm:flex-row sm:items-center sm:p-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cream" aria-hidden="true">
                  <Blob shape={stage.shape} color={stage.deep} face={stage.shape !== 'loop'} className="h-12 w-12 transition-transform duration-500 hover:rotate-45" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold uppercase tracking-wider text-ink-soft">
                    Land {stageIndex + 1} · {stage.concept}
                  </p>
                  <h2 id={`land-${stage.id}`} className="text-3xl font-bold">{stage.name}</h2>
                  <p className="mt-1 font-semibold text-ink-soft">{stage.description}</p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="font-display text-lg font-semibold">{doneHere}/{stageLevels.length} done</p>
                  <p className="flex items-center gap-1 font-display font-semibold text-ink-soft sm:justify-end">
                    <Star className="h-5 w-5" /> {starsHere}/{stageLevels.length * 3}
                  </p>
                  <div className="mt-2 h-3 w-40 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(doneHere / stageLevels.length) * 100}%`, backgroundColor: stage.color }} />
                  </div>
                </div>
              </div>

              <div className="relative mx-auto max-w-xl" style={{ height }}>
                <Trail points={points} height={height} />
                {!loading &&
                  stageLevels.map((level, i) => {
                    const p = progress[level.id];
                    const state = p?.completed ? 'done' : !isLevelUnlocked(level.id, progress) ? 'locked' : 'current';
                    return (
                      <div key={level.id} id={`stop-${level.id}`}>
                        <LevelStop level={level} x={points[i].x} y={points[i].y} state={state} stars={p?.stars || 0} color={stage.color} />
                      </div>
                    );
                  })}

                {/* Scenery along the trail on wide screens */}
                <SceneryBit scenery={stage.scenery} salt={stageIndex * 7 + 1} className="absolute -left-40 top-24 hidden h-28 w-28 lg:block" />
                <SceneryBit scenery={stage.scenery} salt={stageIndex * 7 + 2} className="absolute -right-36 top-64 hidden h-24 w-24 lg:block" />
                <SceneryBit scenery={stage.scenery} salt={stageIndex * 7 + 3} className="absolute -left-28 top-[440px] hidden h-20 w-20 lg:block" />
                {stageIndex === 0 && <Sun className="absolute -right-44 top-6 hidden h-24 w-24 animate-spin-slow lg:block" />}
                {stageIndex === 1 && <Cloud className="absolute -right-48 top-8 hidden h-20 w-36 animate-float lg:block" />}
                {stageIndex === 2 && <Flower className="absolute -right-36 top-[480px] hidden h-14 w-14 animate-wiggle lg:block" />}
              </div>
            </section>
          );
        })}

        <div className="flex flex-col items-center pt-2">
          <Cottage className="h-36 w-36" />
          <p className="headline text-4xl">Home!</p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

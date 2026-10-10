'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import Kodo from './brand/Kodo';
import Blob from './brand/Blobs';
import { Cottage } from './brand/Stickers';
import FunButton from './ui/FunButton';
import { ArrowRightIcon, PlayIcon } from './ui/Icons';
import DemoBoard from './landing/DemoBoard';
import ArcSection from './ui/ArcSection';
import StoryCard, { Circled } from './ui/StoryCard';
import LineIcon from './ui/LineIcons';
import SkillsRoad from './landing/SkillsRoad';
import { levels, stages, getLevelsByStage } from '@/data/levels';
import { useProgress } from '@/hooks/useProgress';
import { whenRevealed } from '@/lib/pageReveal';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, Draggable, InertiaPlugin);

const ROAD =
  'M-40 330 C60 330 100 340 112 392 C126 452 40 476 66 548 C92 618 214 640 318 622 C430 602 474 664 604 666 C734 668 770 604 884 612 C984 620 1020 664 1084 640 C1132 622 1140 572 1112 540';

const TAGS = [
  { label: '#Sequences', color: 'var(--color-leaf)' },
  { label: '#Loops', color: 'var(--color-sky)' },
  { label: '#Debugging', color: 'var(--color-berry)' },
  { label: '#Decisions', color: 'var(--color-grape)' },
  { label: '#Patterns', color: 'var(--color-sun)' },
  { label: '#Problem solving', color: 'var(--color-lime)' },
];

// Each land gets a blob in a colour that pops against its card.
const LAND_ACCENT = {
  simple: 'var(--color-sun)',
  loops: 'var(--color-lime)',
  conditions: 'var(--color-lime)',
  combined: 'var(--color-sun)',
};

const SKILLS = [
  { title: 'Tiny steps', icon: 'steps', color: 'var(--color-leaf-deep)', hook: 'One move at a time.', text: 'Kids break a long walk into small, ordered instructions, just like real programs.' },
  { title: 'Spot patterns', icon: 'loop', color: 'var(--color-sky-deep)', hook: 'Same steps twice?', text: 'Wrap them in a loop and let Kodo do the repeating.' },
  { title: 'Make choices', icon: 'fork', color: 'var(--color-grape-deep)', hook: 'Path or bush?', text: '"If" blocks let Kodo peek ahead and pick the right way.' },
  { title: 'Fix mistakes', icon: 'magnifier', color: 'var(--color-peach-deep)', hook: 'Bumped a bush?', text: 'Watch what happened, find the sneaky block and try again.' },
  { title: 'Keep trying', icon: 'smile', color: 'var(--color-berry-deep)', hook: 'Three stars.', text: 'Little wins keep kids going until every star shines.' },
];

const STATS = [
  { value: levels.length, label: 'puzzles to solve', shape: 'flower', color: 'var(--color-sun)' },
  { value: 8, label: 'blocks to master', shape: 'bloom', color: 'var(--color-sky)' },
  { value: 0, label: 'typing needed', shape: 'splat', color: 'var(--color-berry)' },
];

function FlatTree({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-5" y="10" width="10" height="44" rx="5" fill="var(--color-ink)" />
      <circle cx="0" cy="0" r="34" fill="var(--color-leaf-deep)" />
      <path d="M-16 -4 q4 -6 8 0 q4 -6 8 0 M-6 12 q4 -6 8 0 q4 -6 8 0" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Grass({ x, y }) {
  return (
    <path
      d={`M${x} ${y} l6 -18 l4 14 l6 -22 l5 20 l7 -14 l3 20`}
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

// Each word sits in a clipping mask so its letters can pop up from below.
function BouncyLine({ text }) {
  return (
    <span className="block" aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span key={w} aria-hidden="true">
          {w > 0 && ' '}
          <span className="inline-block overflow-clip pb-[0.06em]">
            {[...word].map((ch, i) => (
              <span key={i} className="hero-char inline-block">
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

function Tag({ label, color, className = '' }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-6 py-2.5 font-display text-xl font-bold text-onfill ${className}`}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

function HeroScene() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="930" cy="190" r="120" fill="var(--color-paper)" opacity="0.9" data-depth="0.4" />
      <g data-depth="0.8">
        <Blob shape="cloud" color="var(--color-paper)" x="120" y="70" width="190" height="190" className="hero-cloud" />
      </g>
      <g data-depth="0.6">
        <Blob shape="cloud" color="var(--color-paper)" x="980" y="40" width="240" height="240" className="hero-cloud" />
      </g>

      <path className="hero-road" d={ROAD} fill="none" stroke="var(--color-paper)" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" />
      <path
        className="hero-road-dash"
        d={ROAD}
        fill="none"
        stroke="var(--color-sun-deep)"
        strokeWidth="4"
        strokeDasharray="2 18"
        strokeLinecap="round"
        opacity="0.5"
      />

      <ellipse cx="40" cy="660" rx="150" ry="70" fill="var(--color-sky-deep)" />
      <path d="M-10 650 q10 -8 20 0 q10 -8 20 0 M60 690 q10 -8 20 0 q10 -8 20 0" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />

      <g data-depth="0.3">
        <FlatTree x={210} y={420} />
        <FlatTree x={268} y={470} s={0.8} />
        <FlatTree x={1010} y={420} s={0.9} />
        <FlatTree x={1150} y={380} s={1.1} />
      </g>
      <Grass x={380} y={700} />
      <Grass x={760} y={570} />
      <Grass x={980} y={710} />

      {/* A little signpost pointing the way */}
      <g transform="translate(150 528)">
        <path d="M0 0 V-58" stroke="var(--color-peach-deep)" strokeWidth="5" strokeLinecap="round" />
        <path d="M-4 -70 H30 L42 -58 L30 -46 H-4 Z" fill="var(--color-peach)" />
        <path d="M-12 2 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      </g>

      <Cottage x="1058" y="458" width="110" height="110" />

      <g className="hero-walker" opacity="0">
        <g className="hero-hop">
          <Kodo x="-38" y="-70" width="76" height="76" shadow={false} look="EAST" title="" aria-hidden="true" />
        </g>
      </g>

      {[
        [360, 120, 26],
        [820, 360, 20],
        [560, 580, 18],
        [1120, 300, 24],
      ].map(([x, y, s], i) => (
        <g key={i} data-depth="1.2">
          <Blob shape="sparkle" color="var(--color-peach-deep)" x={x} y={y} width={s} height={s} className="hero-spark" />
        </g>
      ))}
    </svg>
  );
}

export default function LandingPage() {
  const { progress, loading } = useProgress();
  const rootRef = useRef(null);

  const completed = levels.filter((l) => progress[l.id]?.completed).length;
  const continueId = levels.find((l) => !progress[l.id]?.completed)?.id || 1;

  useEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    let cancelled = false;

    // Split text only once the web fonts are in, so the letters measure correctly.
    Promise.all([document.fonts.ready, whenRevealed()]).then(() => {
      if (cancelled) return;

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ── Hero: bouncy letters, a road that draws itself and Kodo walking it ──
        gsap.from('.hero-char', {
          yPercent: 120,
          rotate: () => gsap.utils.random(-25, 25),
          duration: 0.9,
          ease: 'back.out(1.7)',
          stagger: 0.045,
          delay: 0.15,
        });
        gsap.from('.hero-fade', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.7 });
        gsap.from('.hero-road', { drawSVG: '0%', duration: 1.8, ease: 'power2.inOut', delay: 0.2 });
        gsap.from('.hero-road-dash', { opacity: 0, duration: 0.6, delay: 1.8 });
        gsap.from('.hero-blob', { scale: 0, rotate: -90, duration: 0.9, ease: 'back.out(2)', stagger: 0.12, delay: 0.9 });
        gsap.to('.hero-cloud', { x: 30, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 1.5 });
        gsap.to('.hero-spark', { scale: 0.4, transformOrigin: '50% 50%', duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.3 });

        gsap
          .timeline({ repeat: -1, delay: 1.6 })
          .set('.hero-walker', { opacity: 1, scale: 1 })
          .to('.hero-walker', {
            duration: 16,
            ease: 'none',
            motionPath: { path: ROAD },
          })
          .to('.hero-walker', { scale: 0, opacity: 0, duration: 0.4, ease: 'back.in(2)' });
        gsap.to('.hero-hop', { y: -10, duration: 0.28, yoyo: true, repeat: -1, ease: 'power1.out' });

        // Pointer parallax: everything tagged with data-depth drifts with the cursor.
        const layers = gsap.utils.toArray('[data-depth]', root).map((el) => ({
          depth: parseFloat(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' }),
        }));
        const hero = root.querySelector('.hero');
        const onMove = (e) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach((l) => {
            l.x(nx * 30 * l.depth);
            l.y(ny * 20 * l.depth);
          });
        };
        hero.addEventListener('pointermove', onMove);

        // ── Marquees that speed up (and flip direction) with your scrolling ──
        const loops = gsap.utils
          .toArray('.marquee-row', root)
          .map((row, i) => gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 30, ease: 'none', repeat: -1 }));
        ScrollTrigger.create({
          trigger: '.marquee-band',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 4);
            loops.forEach((t) => {
              gsap
                .timeline({ overwrite: true })
                .to(t, { timeScale: boost * self.direction, duration: 0.15 })
                .to(t, { timeScale: self.direction, duration: 1.2, ease: 'power2.out' });
            });
          },
        });

        // ── Section headlines rise word by word ──
        const headSplits = gsap.utils.toArray('.reveal-head', root).map((el) => {
          const split = SplitText.create(el, { type: 'words', mask: 'words' });
          gsap.from(split.words, {
            yPercent: 110,
            duration: 0.8,
            ease: 'back.out(1.4)',
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          });
          return split;
        });

        // ── Land cards deal themselves onto the table ──
        gsap.from('.land-card', {
          y: 140,
          rotate: (i) => (i % 2 ? 8 : -8),
          opacity: 0,
          duration: 0.9,
          ease: 'back.out(1.3)',
          stagger: 0.12,
          clearProps: 'transform',
          scrollTrigger: { trigger: '.land-grid', start: 'top 80%', once: true },
        });

        // ── Stats: blobs spin as you scroll, numbers count up ──
        gsap.utils.toArray('.stat-blob', root).forEach((el, i) => {
          gsap.to(el, {
            rotate: i % 2 ? -120 : 120,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        });
        gsap.utils.toArray('.stat-num', root).forEach((el) => {
          const target = Number(el.dataset.value);
          if (!target) return;
          const counter = { v: 0 };
          el.textContent = '0';
          gsap.to(counter, {
            v: target,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => (el.textContent = Math.round(counter.v)),
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          });
        });

        // ── Skills: the road draws itself as you scroll and Kodo walks along it ──
        gsap.from('.skills-circle', { drawSVG: '0%', duration: 0.9, ease: 'power2.inOut', scrollTrigger: { trigger: '.skills', start: 'top 65%', once: true } });
        gsap
          .timeline({ scrollTrigger: { trigger: '.skills', start: 'top 70%', end: 'bottom 75%', scrub: 1.2, invalidateOnRefresh: true } })
          .from('.skills-road', { drawSVG: '0%', ease: 'none' })
          .to(
            '.skills-kodo',
            {
              ease: 'none',
              motionPath: { path: '.skills-road', align: '.skills-road', alignOrigin: [0.5, 0.85] },
            },
            0
          );

        // ── Skills: cards swing in from their side of the road as you scroll ──
        gsap.utils.toArray('.skill-row', root).forEach((row, i) => {
          const fromRight = i % 2 === 1;
          gsap.fromTo(
            row,
            { x: fromRight ? '110vw' : '-110vw', rotate: fromRight ? 24 : -24 },
            {
              x: 0,
              rotate: fromRight ? 1.5 : -1.5,
              ease: 'back.out(1.2)',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 45%', scrub: 1 },
            }
          );
          // ...and once it lands, its badge pops and the hook gets circled.
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: 'top 48%', once: true } })
            .from(row.querySelector('.story-badge'), { scale: 0, rotate: -90, duration: 0.6, ease: 'back.out(2.5)' })
            .from(row.querySelector('.story-circle'), { drawSVG: '0%', duration: 0.7, ease: 'power2.inOut' }, '-=0.2');
        });

        // ── Big CTA: Kodo pops up and keeps an eye on your cursor ──
        const ctaKodo = root.querySelector('.cta-kodo');
        gsap.from(ctaKodo, {
          yPercent: 60,
          rotate: -12,
          duration: 1.1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: '.cta', start: 'top 75%', once: true },
        });
        const pupils = ctaKodo.querySelector('.kodo-pupils');
        const px = gsap.quickTo(pupils, 'x', { duration: 0.3 });
        const py = gsap.quickTo(pupils, 'y', { duration: 0.3 });
        const onLook = (e) => {
          const r = ctaKodo.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height * 0.55);
          const len = Math.hypot(dx, dy) || 1;
          px((dx / len) * 13);
          py((dy / len) * 10);
        };
        window.addEventListener('pointermove', onLook);

        return () => {
          hero.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointermove', onLook);
          headSplits.forEach((split) => split.revert());
        };
      });

      // Blobs and tags can be flung around (they only move when you move them).
      mm.add('all', () => {
        const draggables = gsap.utils.toArray('.drag-me', root).flatMap((el) =>
          Draggable.create(el, {
            type: 'x,y',
            inertia: true,
            bounds: el.closest('[data-drag-bounds]'),
            zIndexBoost: true,
            onPress() {
              gsap.to(el, { scale: 1.12, duration: 0.25, ease: 'back.out(3)' });
            },
            onRelease() {
              gsap.to(el, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            },
          }),
        );
        return () => draggables.forEach((d) => d.kill());
      });
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip">
      <SiteHeader />

      {/* ───────────────────────────── Hero ───────────────────────────── */}
      <section className="hero relative -mt-[68px] overflow-hidden bg-sky" data-drag-bounds>
        <HeroScene />

        <Blob
          shape="flower"
          color="var(--color-sun)"
          face
          className="hero-blob drag-me absolute bottom-[20%] right-[8%] h-20 w-20 cursor-grab sm:bottom-auto sm:top-[16%] sm:h-32 sm:w-32"
        />
        <Blob
          shape="asterisk"
          color="var(--color-berry-deep)"
          className="hero-blob drag-me absolute bottom-[22%] left-[8%] h-14 w-14 cursor-grab sm:bottom-auto sm:top-[22%] sm:h-20 sm:w-20"
        />
        <Blob shape="splat" color="var(--color-peach)" className="hero-blob drag-me absolute bottom-[30%] right-[18%] hidden h-20 w-20 cursor-grab md:block" />
        <p className="hero-fade pointer-events-none absolute right-[3%] top-[40%] hidden rotate-[-6deg] font-display text-2xl xl:block">psst, drag us around!</p>

        <div className="relative mx-auto flex min-h-[680px] max-w-6xl flex-col items-center px-4 pb-52 pt-32 text-center sm:min-h-[780px] sm:pt-36">
          <p className="hero-fade font-display text-2xl sm:text-3xl">a cozy coding game for kids</p>
          <h1 className="headline mt-3 text-[clamp(4.2rem,15vw,12rem)]">
            <BouncyLine text="Help Kodo" />
            <BouncyLine text="find home" />
          </h1>
          <p className="hero-fade mt-6 max-w-xl text-lg font-semibold sm:text-xl">
            Snap colourful blocks together, press Go, and watch Kodo hop through gardens, meadows and woods. Real coding ideas, zero typing.
          </p>
          <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3">
            {!loading && (
              <FunButton href={`/level/${continueId}`} color="ink" size="lg" icon={<PlayIcon />}>
                {completed === 0 ? 'Start playing' : `Continue: level ${continueId}`}
              </FunButton>
            )}
            <FunButton href="#how" color="paper" size="lg">
              How it works
            </FunButton>
          </div>
        </div>
      </section>

      {/* ──────────────────────────── Marquee ─────────────────────────── */}
      <section className="marquee-band relative z-10 -mb-6 -mt-24 overflow-hidden py-12" aria-label="What kids practise">
        <div className="-mx-4 -rotate-2 bg-ink py-4">
          <div className="marquee-row flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-3 pr-3" aria-hidden={copy === 1}>
                {[...TAGS, ...TAGS].map((t, i) => (
                  <Tag key={i} {...t} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="-mx-4 -mt-3 rotate-[1.5deg] bg-lime py-3" aria-hidden="true">
          <div className="marquee-row flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-10 pr-10">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="headline flex items-center gap-10 whitespace-nowrap text-4xl">
                    Snap · Press go · Hop home
                    <Blob shape={['flower', 'asterisk', 'bloom'][i % 3]} color="var(--color-leaf-deep)" className="h-8 w-8" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────── Lands ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6" aria-labelledby="lands-title">
        <div className="grid items-end gap-8 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="font-display text-2xl text-leaf-deep">four lands, twenty puzzles</p>
            <h2 id="lands-title" className="reveal-head headline mt-2 text-6xl sm:text-7xl">
              A long walk <span className="font-display text-leaf-deep">home</span>
            </h2>
            <p className="mt-4 max-w-md text-lg font-semibold text-ink-soft">
              Every land teaches one big coding idea. Start with simple steps and finish by mixing loops and decisions like a pro.
            </p>
          </div>

          <div className="relative h-56" data-drag-bounds aria-hidden="true">
            <Tag label="#Sequences" color="var(--color-berry)" className="drag-me absolute left-[4%] top-[8%] rotate-[18deg] cursor-grab" />
            <Tag label="#Loops" color="var(--color-grape)" className="drag-me absolute right-[6%] top-[14%] -rotate-12 cursor-grab" />
            <Tag label="#Decisions" color="var(--color-leaf)" className="drag-me absolute bottom-[10%] left-[22%] rotate-[10deg] cursor-grab" />
            <span className="drag-me absolute left-[46%] top-[2%] flex h-14 w-14 cursor-grab items-center justify-center rounded-full bg-lime">
              <Blob shape="sparkle" color="var(--color-ink)" className="h-6 w-6" />
            </span>
            <span className="drag-me absolute bottom-[34%] left-[4%] flex h-14 w-14 cursor-grab items-center justify-center rounded-full bg-sun">
              <Blob shape="asterisk" color="var(--color-ink)" className="h-7 w-7" />
            </span>
            <span className="drag-me absolute bottom-[4%] right-[8%] flex h-14 w-14 cursor-grab items-center justify-center rounded-full bg-berry">
              <Blob shape="flower" color="var(--color-ink)" className="h-7 w-7" />
            </span>
          </div>
        </div>

        <div className="land-grid mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, i) => {
            const stageLevels = getLevelsByStage(stage.id);
            const first = stageLevels[0].id;
            const last = stageLevels[stageLevels.length - 1].id;
            const [word, ...rest] = stage.name.split(' ');
            return (
              <Link
                key={stage.id}
                href="/levels"
                className={`land-card group relative flex min-h-[360px] flex-col overflow-hidden rounded-[32px] p-6 text-onfill transition-transform duration-500 ease-[cubic-bezier(.3,1.5,.5,1)] hover:-translate-y-2 ${
                  i % 2 ? 'hover:rotate-1 lg:mt-14' : 'hover:-rotate-1'
                }`}
                style={{ backgroundColor: stage.color }}
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full border-[1.5px] border-ink px-3 py-0.5 text-sm font-bold">
                    Levels {first}–{last}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-ink transition-all duration-300 group-hover:-rotate-45 group-hover:bg-ink group-hover:text-paper">
                    <ArrowRightIcon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="relative z-10 mt-6 text-[2.6rem] leading-[0.9]">
                  {word}
                  <span className="block font-display text-[2.6rem] leading-none">
                    {rest.join(' ')}
                  </span>
                </h3>
                <p className="relative z-10 mt-3 max-w-[15rem] font-semibold">
                  <span className="font-bold">{stage.concept}.</span> {stage.description}
                </p>
                <Blob
                  shape={stage.shape}
                  color={LAND_ACCENT[stage.id]}
                  className="absolute -bottom-10 -right-8 h-40 w-40 transition-transform duration-700 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover:-translate-y-3 group-hover:rotate-45 group-hover:scale-110"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────── How it works ─────────────────────── */}
      <ArcSection id="how" wrapperClassName="mt-36" className="scroll-mt-28 px-4 pb-24 pt-6 sm:px-6" aria-labelledby="how-title">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-display text-2xl text-sky-deep">how it works</p>
            <h2 id="how-title" className="reveal-head headline mt-2 text-6xl sm:text-7xl">
              Snap. Go. <span className="font-display text-sky-deep">Hop!</span>
            </h2>
            <ol className="mt-8 space-y-5">
              {[
                ['Snap blocks together', 'Drag "move", "turn" and "repeat" blocks under the pink start block.', 'var(--color-leaf)'],
                ['Press the big Go button', 'Kodo follows your blocks one by one, and the block running right now lights up.', 'var(--color-sky)'],
                ['Bring Kodo home', 'Grab every berry and use as few blocks as you can to earn all three stars.', 'var(--color-berry)'],
              ].map(([title, text, color], i) => (
                <li key={title} className="flex gap-4">
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <Blob shape="bloom" color={color} className="absolute inset-0 h-full w-full" />
                    <span className="headline relative text-3xl">{i + 1}</span>
                  </span>
                  <div>
                    <h3 className="text-2xl">{title}</h3>
                    <p className="mt-1 font-semibold text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative rounded-[32px] bg-peach p-5 sm:p-7">
            <Blob shape="sparkle" color="var(--color-sun)" className="absolute -right-3 -top-4 h-12 w-12 animate-spin-slow" />
            <Blob shape="loop" color="var(--color-leaf-deep)" className="absolute -bottom-8 -left-6 h-24 w-24" />
            <DemoBoard />
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="mx-auto mt-24 grid max-w-6xl gap-10 rounded-[40px] bg-ink px-6 py-14 text-paper sm:grid-cols-3" aria-label="Kodo in numbers">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="relative flex h-44 w-44 items-center justify-center">
                <Blob shape={s.shape} color={s.color} className="stat-blob absolute inset-0 h-full w-full" />
                <span className="stat-num headline relative text-7xl text-ink" data-value={s.value}>
                  {s.value}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </ArcSection>

      {/* ──────────────────────────── Skills ──────────────────────────── */}
      <ArcSection color="var(--color-leaf-soft)" className="skills px-4 pb-24 pt-8 sm:px-6" aria-labelledby="skills-title">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-2xl text-leaf-deep">for curious minds</p>
          <h2 id="skills-title" className="headline mt-2 text-6xl sm:text-7xl">
            What kids{' '}
            <span className="relative inline-block text-leaf-deep">
              really
              <svg viewBox="0 0 220 90" className="pointer-events-none absolute -inset-x-6 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+3rem)]" preserveAspectRatio="none" aria-hidden="true">
                <path
                  className="skills-circle"
                  d="M150 12 C90 2 18 14 10 44 C2 76 90 86 160 76 C214 68 222 30 180 16 C150 6 100 8 70 14"
                  fill="none"
                  stroke="var(--color-leaf-deep)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            learn
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg font-semibold text-ink-soft">
            Under all the berries and bushes are the same ideas real programmers use every day.
          </p>
        </div>

        <div className="skills-track relative mx-auto mt-14 max-w-5xl">
          {/* The winding road Kodo follows as you scroll */}
          <SkillsRoad className="absolute inset-0 hidden h-full w-full overflow-visible sm:block" />
          <div className="skills-kodo pointer-events-none absolute left-0 top-0 z-[5] hidden h-20 w-20 sm:block" aria-hidden="true">
            <Kodo className="h-full w-full" shadow={false} title="" />
          </div>

          <ul className="relative z-10 space-y-10 py-10 sm:space-y-24">
            {SKILLS.map((skill, i) => (
              <StoryCard
                key={skill.title}
                as="li"
                icon={skill.icon}
                title={skill.title}
                color={skill.color}
                className={`skill-row sm:w-[54%] ${i % 2 ? 'sm:ml-auto' : ''}`}
              >
                <Circled>{skill.hook}</Circled> {skill.text}
              </StoryCard>
            ))}
          </ul>
        </div>

        <div className="relative z-10 mx-auto mt-14 flex max-w-md items-center gap-4 rounded-[28px] bg-grape p-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper text-grape-deep">
            <LineIcon name="book" className="h-8 w-8" />
          </span>
          <div>
            <p className="font-display text-xl">Parent or teacher?</p>
            <Link href="/program" className="group inline-flex items-center gap-1 font-semibold underline decoration-2 underline-offset-4">
              Read the grown-ups guide
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </ArcSection>

      {/* ────────────────────────────── CTA ───────────────────────────── */}
      <ArcSection color="var(--color-sun)" className="cta overflow-hidden px-6 pt-10 text-center" data-drag-bounds>
        <Blob shape="flower" color="var(--color-sky-deep)" face className="drag-me absolute left-[6%] top-[14%] h-20 w-20 cursor-grab sm:h-28 sm:w-28" />
        <Blob shape="asterisk" color="var(--color-berry-deep)" className="drag-me absolute right-[8%] top-[10%] h-16 w-16 cursor-grab" />
        <Blob shape="splat" color="var(--color-peach)" className="drag-me absolute bottom-[18%] right-[12%] h-20 w-20 cursor-grab" />
        <Blob shape="bloom" color="var(--color-leaf-deep)" face className="drag-me absolute bottom-[24%] left-[12%] hidden h-16 w-16 cursor-grab sm:block" />

        <p className="font-display text-3xl">Kodo is waiting for you</p>
        <h2 className="reveal-head headline mx-auto mt-2 max-w-4xl text-[clamp(3.6rem,11vw,9rem)]">Ready to play?</h2>
        <div className="relative z-10 mt-8 flex justify-center">
          {!loading && (
            <FunButton href={`/level/${continueId}`} color="ink" size="lg" icon={<PlayIcon />}>
              {completed === 0 ? 'Play level 1' : `Continue: level ${continueId}`}
            </FunButton>
          )}
        </div>
        <Kodo className="cta-kodo relative mx-auto -mb-6 mt-8 block h-56 w-56 sm:h-72 sm:w-72" mood="cheer" shadow={false} title="Kodo waving hello" />
      </ArcSection>

      <SiteFooter flush />
    </div>
  );
}

'use client';

import { useRef } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageHero from '@/components/ui/PageHero';
import StoryCard, { Circled } from '@/components/ui/StoryCard';
import LineIcon from '@/components/ui/LineIcons';
import FunButton from '@/components/ui/FunButton';
import WaveText from '@/components/ui/WaveText';
import Blob from '@/components/brand/Blobs';
import Kodo from '@/components/brand/Kodo';
import { ArrowRightIcon, PlayIcon } from '@/components/ui/Icons';
import { useReveal } from '@/hooks/useReveal';
import { CREDITS } from '@/data/credits';

const PORTFOLIO = 'https://portfolio-master-gray-gamma.vercel.app/';
const GITHUB = 'https://github.com/abdullatufail/kodo-blockly';

const VALUES = [
  { title: 'Play first', icon: 'sparkle', color: 'var(--color-leaf-deep)', hook: 'Fun is the point.', text: 'Colourful blocks and a little friend to help make coding feel like a game, not homework.' },
  { title: 'For everyone', icon: 'hand', color: 'var(--color-sky-deep)', hook: 'No one left out.', text: 'High contrast, read-aloud and big, friendly controls are built in from the start.' },
  { title: 'Step by step', icon: 'stairs', color: 'var(--color-grape-deep)', hook: 'Small wins.', text: 'Each land adds one new idea, so confidence grows one puzzle at a time.' },
  { title: 'Free & open', icon: 'code', color: 'var(--color-peach-deep)', hook: 'Free forever.', text: 'Kodo is open source. Anyone can use it, host it or help make it better.' },
];

const ACCESS = [
  { icon: 'eye', title: 'High contrast', text: 'One tap swaps to bold, clearly different colours with strong edges.', color: 'var(--color-sun)' },
  { icon: 'speaker', title: 'Read aloud', text: 'Instructions and feedback can be read out loud for early readers.', color: 'var(--color-sky)' },
  { icon: 'keyboard', title: 'Keyboard friendly', text: 'Menus, buttons and the map work with the keyboard and show clear focus.', color: 'var(--color-leaf)' },
  { icon: 'ear', title: 'Screen readers', text: 'The board, buttons and missions carry labels that explain what is going on.', color: 'var(--color-berry)' },
  { icon: 'blocks', title: 'No typing', text: 'Drag-and-drop blocks with colours and shapes remove spelling and syntax worries.', color: 'var(--color-grape)' },
  { icon: 'bars', title: 'Gentle steps', text: 'Twenty puzzles over four lands, with hints whenever someone gets stuck.', color: 'var(--color-lime)' },
];

export default function AboutPage() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip">
      <SiteHeader />

      <PageHero eyebrow="about kodo" title="Coding for every kid" color="var(--color-grape)">
        Kodo is a cozy puzzle game that teaches real programming ideas with colourful blocks. The goal is simple: make coding fun, friendly and
        open to every child.
      </PageHero>

      {/* What we believe */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="values-title">
        <div className="text-center">
          <p className="font-display text-2xl text-leaf-deep">what we believe</p>
          <h2 id="values-title" className="reveal-head headline mt-2 text-6xl sm:text-7xl">
            Four little promises
          </h2>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-4 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <StoryCard key={v.title} icon={v.icon} title={v.title} color={v.color} className={`reveal-up ${i % 2 ? 'md:mt-24' : ''}`}>
              <Circled>{v.hook}</Circled> {v.text}
            </StoryCard>
          ))}
        </div>
      </section>

      {/* Accessibility */}
      <section className="mx-2 mt-28 rounded-[44px] bg-sky-soft px-4 py-20 sm:mx-4 sm:px-6" aria-labelledby="access-title">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-display text-2xl text-sky-deep">accessibility first</p>
            <h2 id="access-title" className="reveal-head headline mt-2 text-6xl sm:text-7xl">
              Built for everyone
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-ink-soft">
              Every part of Kodo is designed so kids with different needs and abilities can play.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ACCESS.map((f) => (
              <li key={f.title} className="reveal-up group rounded-[28px] bg-paper p-6 transition-transform duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] hover:-translate-y-1.5 hover:-rotate-1">
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full text-ink transition-transform duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover:rotate-12 group-hover:scale-110"
                  style={{ backgroundColor: f.color }}
                >
                  <LineIcon name={f.icon} className="h-8 w-8" />
                </span>
                <h3 className="mt-4 text-3xl">{f.title}</h3>
                <p className="mt-1 font-semibold text-ink-soft">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The maker */}
      <section className="mx-auto mt-28 max-w-6xl px-4 sm:px-6" aria-labelledby="maker-title">
        <div className="reveal-up relative grid items-center gap-8 overflow-hidden rounded-[40px] bg-grape p-8 sm:p-12 md:grid-cols-[1fr_auto]">
          <Blob shape="loop" color="var(--color-lime)" className="absolute -right-10 -top-10 h-48 w-48 opacity-90" />
          <div className="relative">
            <p className="font-display text-2xl text-grape-deep">who made kodo?</p>
            <h2 id="maker-title" className="reveal-head headline mt-2 text-6xl sm:text-7xl">
              Made with care
            </h2>
            <p className="mt-4 max-w-xl text-lg font-semibold">
              Kodo is designed and built as an independent project, from the puzzles and the little mascot to every bounce and wobble. Want to
              see what else I make?
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <FunButton href={PORTFOLIO} target="_blank" rel="noopener noreferrer" color="ink" size="lg" iconAfter={<ArrowRightIcon />}>
                Visit my portfolio
              </FunButton>
              <FunButton href={GITHUB} target="_blank" rel="noopener noreferrer" color="paper" size="lg">
                Kodo on GitHub
              </FunButton>
            </div>
          </div>
          <Kodo className="relative mx-auto h-40 w-40 sm:h-52 sm:w-52" mood="cheer" title="" />
        </div>
      </section>

      {/* Credits */}
      <section id="credits" className="mx-auto mt-28 max-w-6xl scroll-mt-28 px-4 sm:px-6" aria-labelledby="credits-title">
        <div className="text-center">
          <p className="font-display text-2xl text-peach-deep">thank you</p>
          <h2 id="credits-title" className="reveal-head headline mt-2 text-6xl sm:text-7xl">
            Built with friends
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-ink-soft">
            Kodo stands on the shoulders of these open source projects, web APIs and fonts. Huge thanks to the people who make them.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CREDITS.map((c, i) => (
            <li key={c.name} className="reveal-up">
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-center justify-between gap-4 rounded-[26px] p-5 transition-transform duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] hover:-translate-y-1 hover:-rotate-1"
                style={{ backgroundColor: ['var(--color-leaf-soft)', 'var(--color-sky-soft)', 'var(--color-grape-soft)', 'var(--color-berry-soft)', 'var(--color-sun-soft)', 'var(--color-peach-soft)'][i % 6] }}
              >
                <span>
                  <span className="block font-display text-2xl">
                    <WaveText text={c.name} />
                  </span>
                  <span className="block font-semibold text-ink-soft">
                    {c.what} · by {c.by}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-ink-soft/80">{c.license}</span>
                </span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper transition-transform duration-300 group-hover:-rotate-45">
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Mission */}
      <section className="relative mx-2 mt-28 overflow-hidden rounded-[44px] bg-sun px-6 py-20 text-center sm:mx-4" aria-labelledby="mission-title">
        <Blob shape="flower" color="var(--color-sky-deep)" face className="absolute left-[6%] top-10 hidden h-24 w-24 animate-spin-slow sm:block" />
        <Blob shape="splat" color="var(--color-peach)" className="absolute bottom-8 right-[8%] h-20 w-20 animate-wiggle" />
        <p className="font-display text-2xl">our mission</p>
        <h2 id="mission-title" className="reveal-head headline mx-auto mt-2 max-w-4xl text-[clamp(3rem,8vw,6.5rem)]">
          Every child can code
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold">
          A welcoming place where every child can discover the joy of coding, whatever their abilities or background.
        </p>
        <div className="mt-8 flex justify-center">
          <FunButton href="/levels" color="ink" size="lg" icon={<PlayIcon />}>
            Start playing
          </FunButton>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageHero from '@/components/ui/PageHero';
import StoryCard, { Circled } from '@/components/ui/StoryCard';
import LineIcon from '@/components/ui/LineIcons';
import FunButton from '@/components/ui/FunButton';
import WaveText from '@/components/ui/WaveText';
import Blob from '@/components/brand/Blobs';
import { ArrowRightIcon, CheckIcon, PlayIcon } from '@/components/ui/Icons';
import { stages, getLevelsByStage } from '@/data/levels';
import { useReveal } from '@/hooks/useReveal';
import { creditFor } from '@/data/credits';

const GITHUB = 'https://github.com/abdullatufail/kodo-blockly';

const TABS = [
  { id: 'curriculum', label: 'What they learn', icon: 'map', color: 'var(--color-leaf)' },
  { id: 'setup', label: 'Host your own', icon: 'server', color: 'var(--color-sky)' },
  { id: 'tech', label: 'How it’s built', icon: 'code', color: 'var(--color-grape)' },
  { id: 'contribute', label: 'Help out', icon: 'heart', color: 'var(--color-berry)' },
];

const LAND_ACCENT = { simple: 'var(--color-sun)', loops: 'var(--color-lime)', conditions: 'var(--color-lime)', combined: 'var(--color-sun)' };

function SectionTitle({ eyebrow, title, color = 'text-leaf-deep', children }) {
  return (
    <div className="max-w-2xl">
      <p className={`font-display text-2xl ${color}`}>{eyebrow}</p>
      <h2 className="reveal-head headline mt-2 text-5xl sm:text-6xl">{title}</h2>
      {children && <p className="mt-4 text-lg font-semibold text-ink-soft">{children}</p>}
    </div>
  );
}

function Code({ lines }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-2xl bg-ink p-5 font-mono text-sm leading-relaxed text-lime">
      {lines.map((l, i) => (
        <span key={i} className={`block ${l.startsWith('#') ? 'text-paper/50' : ''}`}>
          {l}
        </span>
      ))}
    </pre>
  );
}

function Curriculum() {
  return (
    <div className="space-y-20">
      <div>
        <SectionTitle eyebrow="the learning path" title="Four lands, one big idea each">
          Kodo grows with your child. Every land introduces one new programming idea and keeps practising the ones before it.
        </SectionTitle>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {stages.map((stage) => {
            const stageLevels = getLevelsByStage(stage.id);
            return (
              <div key={stage.id} className="reveal-up group relative overflow-hidden rounded-[32px] p-7" style={{ backgroundColor: stage.color }}>
                <span className="rounded-full border-[1.5px] border-ink px-3 py-0.5 text-sm font-bold">
                  Levels {stageLevels[0].id}–{stageLevels[stageLevels.length - 1].id}
                </span>
                <h3 className="relative z-10 mt-5 text-5xl">{stage.name}</h3>
                <p className="relative z-10 mt-2 max-w-sm font-semibold">
                  <span className="font-bold">{stage.concept}.</span> {stage.description}
                </p>
                <ul className="relative z-10 mt-5 flex max-w-sm flex-wrap gap-2">
                  {stageLevels.map((l) => (
                    <li key={l.id} className="rounded-full bg-paper/70 px-3 py-1 text-sm font-bold">
                      {l.id}. {l.title}
                    </li>
                  ))}
                </ul>
                <Blob
                  shape={stage.shape}
                  color={LAND_ACCENT[stage.id]}
                  className="absolute -bottom-12 -right-10 h-44 w-44 transition-transform duration-700 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover:rotate-45 group-hover:scale-110"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionTitle eyebrow="the big ideas" title="Real coding, kid sized" />
        <div className="mt-6 grid gap-x-6 md:grid-cols-3">
          <StoryCard icon="steps" title="Sequences" color="var(--color-leaf-deep)">
            <Circled>First this, then that.</Circled> Breaking a problem into ordered steps.
          </StoryCard>
          <StoryCard icon="loop" title="Loops" color="var(--color-sky-deep)">
            <Circled>Say it once.</Circled> Repeating a pattern instead of writing it again.
          </StoryCard>
          <StoryCard icon="fork" title="Decisions" color="var(--color-grape-deep)">
            <Circled>If, else.</Circled> Checking the path ahead and choosing what to do.
          </StoryCard>
        </div>
      </div>

      <div className="reveal-up rounded-[36px] bg-sun-soft p-8 sm:p-10">
        <h3 className="text-4xl">Tips for playing together</h3>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            'Ask “what will Kodo do?” before pressing Go.',
            'Celebrate bumps: every mistake shows which block to fix.',
            'Try to beat the block goal for the third star.',
            'Use the hint button together when someone is stuck.',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-3 font-semibold">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                <CheckIcon className="h-4 w-4" />
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Setup() {
  const steps = [
    { title: 'Get the code', lines: ['# Clone the repository', `git clone ${GITHUB}.git`, 'cd kodo-blockly', '', '# Install dependencies', 'npm install'] },
    {
      title: 'Add your settings (optional)',
      text: 'Create a .env.local file. Without it Kodo still works and saves progress on each device; with Supabase, players can sign in and keep their stars everywhere.',
      lines: ['# Supabase (optional)', 'NEXT_PUBLIC_SUPABASE_URL=your_supabase_url', 'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key'],
    },
    { title: 'Run it', text: 'Then open http://localhost:3000 in your browser.', lines: ['# Start the development server', 'npm run dev', '', '# Or build for production', 'npm run build && npm start'] },
  ];
  return (
    <div className="space-y-16">
      <SectionTitle eyebrow="for schools & clubs" title="Host Kodo yourself" color="text-sky-deep">
        Kodo is free and open source. Run your own copy for a classroom, a coding club or your kitchen table.
      </SectionTitle>

      <ul className="grid gap-5 sm:grid-cols-3">
        {[
          ['Node.js', 'Version 20.9 or newer'],
          ['Git', 'To download the code'],
          ['Supabase', 'Optional, for accounts'],
        ].map(([name, text], i) => (
          <li key={name} className="reveal-up rounded-[28px] p-6" style={{ backgroundColor: ['var(--color-leaf)', 'var(--color-sky)', 'var(--color-grape)'][i] }}>
            <h3 className="text-3xl">{name}</h3>
            <p className="font-semibold">{text}</p>
          </li>
        ))}
      </ul>

      <ol className="space-y-6">
        {steps.map((step, i) => (
          <li key={step.title} className="reveal-up flex gap-5 rounded-[32px] bg-paper p-6 sm:p-8">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              <Blob shape="bloom" color={['var(--color-sun)', 'var(--color-berry)', 'var(--color-leaf)'][i]} className="absolute inset-0 h-full w-full" />
              <span className="headline relative text-3xl">{i + 1}</span>
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-3xl">{step.title}</h3>
              {step.text && <p className="mt-1 font-semibold text-ink-soft">{step.text}</p>}
              <Code lines={step.lines} />
            </div>
          </li>
        ))}
      </ol>

      <div>
        <h3 className="reveal-head text-4xl">Where to put it online</h3>
        <ul className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            ['Vercel', 'One click deploys, made for Next.js apps.'],
            ['Netlify', 'Simple hosting with automatic builds.'],
            ['Your own server', 'Run it with Node, Docker or PM2.'],
          ].map(([name, text]) => (
            <li key={name} className="reveal-up rounded-[28px] bg-sky-soft p-6">
              <h4 className="text-2xl">{name}</h4>
              <p className="font-semibold text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Tech() {
  const stack = [
    ['Next.js 16', 'Fast pages with the App Router.', 'var(--color-ink)', 'text-paper'],
    ['React 19', 'Components for the game and site.', 'var(--color-sky)', ''],
    ['Tailwind CSS 4', 'Design tokens and quick styling.', 'var(--color-leaf)', ''],
    ['Blockly', 'Google’s drag-and-drop block editor.', 'var(--color-sun)', ''],
    ['GSAP', 'All the bounces, wobbles and walks.', 'var(--color-lime)', ''],
    ['Supabase', 'Optional sign-in and saved stars.', 'var(--color-grape)', ''],
  ];
  return (
    <div className="space-y-16">
      <SectionTitle eyebrow="under the hood" title="How Kodo is built" color="text-grape-deep">
        A small, modern web app. Everything you see is SVG and CSS, animated with GSAP.
      </SectionTitle>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map(([name, text, color, extra]) => (
          <li key={name} className="reveal-up">
            <a
              href={creditFor(name.replace(/ \d+$/, ''))?.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block h-full rounded-[28px] p-6 transition-transform duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] hover:-rotate-2 hover:scale-[1.03] ${extra}`}
              style={{ backgroundColor: color }}
            >
              <h3 className="flex items-center justify-between gap-2 text-4xl">
                {name}
                <ArrowRightIcon className="h-6 w-6 shrink-0 transition-transform group-hover:-rotate-45" />
              </h3>
              <p className="mt-1 font-semibold opacity-85">{text}</p>
              <p className="mt-2 text-sm font-bold opacity-70">by {creditFor(name.replace(/ \d+$/, ''))?.by}</p>
            </a>
          </li>
        ))}
      </ul>
      <div className="reveal-up rounded-[36px] bg-paper p-8 sm:p-10">
        <h3 className="text-4xl">Accessibility under the hood</h3>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {[
            ['speaker', 'Web Speech API', 'The browser’s own voices read content aloud.', creditFor('Web Speech API').href],
            ['ear', 'ARIA labels', 'Screen readers can describe the board and controls.'],
            ['eye', 'Theme tokens', 'One switch recolours the whole site for high contrast.'],
            ['keyboard', 'Focus rings', 'Clear outlines show where the keyboard is.'],
          ].map(([icon, name, text, href]) => (
            <li key={name} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-grape-soft text-grape-deep">
                <LineIcon name={icon} className="h-7 w-7" />
              </span>
              <div>
                <h4 className="text-2xl">
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4 hover:text-grape-deep">
                      {name}
                    </a>
                  ) : (
                    name
                  )}
                </h4>
                <p className="font-semibold text-ink-soft">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="reveal-up text-center text-lg font-semibold">
        Fonts, APIs and everything else Kodo uses are listed in the{' '}
        <Link href="/about#credits" className="font-bold underline decoration-2 underline-offset-4 hover:text-grape-deep">
          credits
        </Link>
        .
      </p>
    </div>
  );
}

function Contribute() {
  const ways = [
    { title: 'Code', icon: 'code', color: 'var(--color-leaf-deep)', items: ['New puzzle levels', 'New block types', 'Accessibility fixes', 'Bug fixes'] },
    { title: 'Teach', icon: 'book', color: 'var(--color-sky-deep)', items: ['Lesson plans', 'Video guides', 'Better docs', 'Translations'] },
    { title: 'Design', icon: 'brush', color: 'var(--color-berry-deep)', items: ['New lands & art', 'UI ideas', 'Animations', 'Accessibility reviews'] },
    { title: 'Test', icon: 'bug', color: 'var(--color-peach-deep)', items: ['Report bugs', 'Suggest features', 'Play with kids', 'Try assistive tech'] },
  ];
  return (
    <div className="space-y-12">
      <SectionTitle eyebrow="open source" title="Help Kodo grow" color="text-berry-deep">
        Developers, teachers and designers are all welcome. Here are a few ways to pitch in.
      </SectionTitle>
      <div className="grid gap-x-6 md:grid-cols-2">
        {ways.map((w) => (
          <StoryCard key={w.title} icon={w.icon} title={w.title} color={w.color}>
            <ul className="mx-auto mt-1 grid max-w-xs grid-cols-2 gap-2 text-left text-base">
              {w.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-paper" style={{ color: w.color }}>
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </StoryCard>
        ))}
      </div>
      <div className="reveal-up relative overflow-hidden rounded-[40px] bg-ink p-10 text-center text-paper">
        <Blob shape="sparkle" color="var(--color-sun)" className="absolute left-[10%] top-8 h-8 w-8" />
        <Blob shape="asterisk" color="var(--color-berry)" className="absolute bottom-8 right-[10%] h-12 w-12 animate-wiggle" />
        <h3 className="headline text-5xl text-sun sm:text-6xl">Ready to help?</h3>
        <p className="mx-auto mt-3 max-w-xl font-semibold text-paper/80">Open the repository, pick an issue and send your first pull request.</p>
        <div className="mt-6 flex justify-center">
          <FunButton href={GITHUB} target="_blank" rel="noopener noreferrer" color="sun" size="lg" iconAfter={<ArrowRightIcon />}>
            Open GitHub
          </FunButton>
        </div>
      </div>
    </div>
  );
}

const PANELS = { curriculum: Curriculum, setup: Setup, tech: Tech, contribute: Contribute };

export default function ProgramPage() {
  const rootRef = useRef(null);
  const [tab, setTab] = useState('curriculum');
  useReveal(rootRef, tab);
  const Panel = PANELS[tab];

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip">
      <SiteHeader />

      <PageHero eyebrow="for parents, teachers & tinkerers" title="Learn, build, share" color="var(--color-leaf)">
        See what kids learn in Kodo, host it for your own class or club, or help make it even better.
      </PageHero>

      <div className="sticky top-20 z-40 mx-auto mt-10 flex max-w-6xl justify-center px-4">
        <div role="tablist" aria-label="Guide sections" className="flex flex-wrap justify-center gap-2 rounded-full bg-paper p-2">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`btn-chunky group flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-lg ${active ? 'text-onfill' : 'bg-transparent text-ink-soft hover:bg-cream'}`}
                style={active ? { backgroundColor: t.color } : undefined}
              >
                <LineIcon name={t.icon} className="h-5 w-5" />
                <WaveText text={t.label} />
              </button>
            );
          })}
        </div>
      </div>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6" role="tabpanel" aria-label={TABS.find((t) => t.id === tab).label}>
        <Panel key={tab} />
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="reveal-up flex flex-col items-center justify-between gap-6 rounded-[40px] bg-sun p-8 text-center sm:flex-row sm:p-10 sm:text-left">
          <div>
            <h2 className="headline text-5xl sm:text-6xl">Try it yourself</h2>
            <p className="mt-2 font-semibold">The best way to understand Kodo is to play a few levels.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <FunButton href="/levels" color="ink" size="lg" icon={<PlayIcon />}>
              Play now
            </FunButton>
            <Link href="/about" className="group flex items-center gap-1 px-2 font-display text-lg">
              <WaveText text="About Kodo" />
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

import Link from 'next/link';
import Blob from './brand/Blobs';
import Kodo from './brand/Kodo';
import WaveText from './ui/WaveText';
import CookieSettingsButton from './CookieSettingsButton';

const LINKS = [
  { href: '/levels', label: 'Levels' },
  { href: '/program', label: 'For grown-ups' },
  { href: '/about', label: 'About' },
  { href: '/about#credits', label: 'Credits' },
];

export default function SiteFooter({ flush = false }) {
  return (
    <footer className={`relative overflow-hidden text-paper ${flush ? '-mt-1 bg-sun' : 'mt-24'}`}>
      {/* A soft scalloped edge, like the bottom of a picture-book page */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-10 w-full sm:h-14" aria-hidden="true">
        <path d="M0 60 V40 C120 0 240 0 360 30 C480 60 600 60 720 30 C840 0 960 0 1080 30 C1200 60 1320 60 1440 30 V60 Z" fill="var(--color-ink)" />
      </svg>

      <div className="relative bg-ink px-6 pb-8 pt-6">
        <Blob shape="flower" color="var(--color-sky-deep)" face className="absolute -right-6 bottom-12 hidden h-28 w-28 animate-spin-slow sm:block" />
        <Blob shape="sparkle" color="var(--color-sun)" className="absolute left-[46%] top-10 h-6 w-6" />
        <Blob shape="asterisk" color="var(--color-berry)" className="absolute bottom-24 left-6 hidden h-12 w-12 animate-wiggle md:block" />

        <div className="relative mx-auto flex max-w-6xl flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-sm">
            <p className="font-display text-3xl text-sun">little coders, big ideas</p>
            <p className="mt-3 font-semibold text-paper/80">A cozy coding game. Free forever, open source, and made for curious kids everywhere.</p>
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-2 font-display text-lg font-semibold">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="group">
                <WaveText text={l.label} className="transition-colors group-hover:text-sun" />
              </Link>
            ))}
            <a href="https://github.com/abdullatufail/kodo-blockly" target="_blank" rel="noopener noreferrer" className="group">
              <WaveText text="GitHub" className="transition-colors group-hover:text-sun" />
            </a>
          </nav>
        </div>

        <div className="relative mx-auto mt-10 flex max-w-6xl items-end gap-3">
          <p className="headline select-none text-[26vw] leading-[0.78] text-sun md:text-[17rem]" aria-hidden="true">
            Kodo
          </p>
          <Kodo className="mb-2 h-20 w-20 shrink-0 animate-bob sm:h-32 sm:w-32" mood="cheer" shadow={false} title="" aria-hidden="true" />
        </div>

        <div className="relative mx-auto mt-6 flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm font-semibold text-paper/60">
          <p>© {new Date().getFullYear()} Kodo · Made for little coders</p>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}

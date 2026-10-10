'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './brand/Logo';
import UserMenu from './UserMenu';
import { Star } from './brand/Stickers';
import FunButton from './ui/FunButton';
import WaveText from './ui/WaveText';
import { CloseIcon, MenuIcon, PlayIcon } from './ui/Icons';
import { useProgress } from '@/hooks/useProgress';
import { AUTH_ENABLED } from '@/lib/features';

const LINKS = [
  { href: '/levels', label: 'Levels' },
  { href: '/program', label: 'For grown-ups' },
  { href: '/about', label: 'About' },
];

function NavLink({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative rounded-full px-4 py-2 font-display text-[1.02rem] font-semibold transition-colors ${
        active ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/[0.06]'
      }`}
    >
      <WaveText text={label} />
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalStars, loading } = useProgress();

  // Close the mobile menu whenever we navigate.
  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-3 z-[80] px-3 sm:px-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pl-4 pr-2 transition-colors duration-300 sm:pl-5 ${
          scrolled || open ? 'bg-paper' : 'bg-transparent'
        }`}
      >
        <Link href="/" aria-label="Kodo home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.href} {...l} active={pathname === l.href} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!loading && totalStars > 0 && (
            <Link
              href="/levels"
              className="hidden items-center gap-1.5 rounded-full bg-sun-soft px-3 py-2 font-display font-bold sm:flex"
              title="Stars collected"
            >
              <Star className="h-6 w-6" />
              {totalStars}
            </Link>
          )}
          <UserMenu className="hidden md:flex" />
          <FunButton href="/levels" color="ink" size="sm" icon={<PlayIcon className="h-4 w-4" />} className="hidden !rounded-full sm:inline-flex">
            Play now
          </FunButton>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="btn-chunky flex h-11 w-11 items-center justify-center rounded-full bg-sun md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-[28px] bg-paper p-3 md:hidden">
          {LINKS.map((l) => (
            <NavLink key={l.href} {...l} active={pathname === l.href} onClick={() => setOpen(false)} />
          ))}
          {AUTH_ENABLED && (
            <div className="mt-2 border-t-2 border-dashed border-line pt-3">
              <UserMenu />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

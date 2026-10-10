'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';
import { UserIcon } from './ui/Icons';
import { AUTH_ENABLED } from '@/lib/features';

export default function UserMenu(props) {
  return AUTH_ENABLED ? <AccountMenu {...props} /> : null;
}

function AccountMenu({ className = '' }) {
  const { user, loading, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (loading) {
    return <div className={`h-11 w-28 animate-pulse rounded-2xl bg-line ${className}`} />;
  }

  if (!user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 font-display font-semibold transition-colors hover:bg-ink hover:text-paper ${className}`}
        >
          <UserIcon className="h-5 w-5" />
          Sign in
        </button>
        <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  const username = user.user_metadata?.username || user.email?.split('@')[0];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setShowDropdown((v) => !v)}
        aria-expanded={showDropdown}
        className="btn-chunky flex items-center gap-2 rounded-2xl bg-paper py-1.5 pl-1.5 pr-3 font-display font-semibold"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-grape text-onfill">
          {username?.[0]?.toUpperCase() || '?'}
        </span>
        <span className="max-w-28 truncate">{username}</span>
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="card-sticker absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl">
            <div className=" bg-grape-soft px-4 py-3">
              <p className="text-xs font-semibold text-ink-soft">Signed in as</p>
              <p className="truncate font-semibold">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                signOut();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 text-left font-display font-semibold text-berry-deep transition hover:bg-berry-soft"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

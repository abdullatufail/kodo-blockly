'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/context/AuthContext';
import Kodo from './brand/Kodo';
import { CloseIcon } from './ui/Icons';

const inputClass =
  'w-full rounded-2xl bg-cream px-4 py-3 font-semibold text-ink placeholder:text-ink-soft/60 outline-none transition focus:bg-paper';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { signIn, signUp, isConfigured } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        onClose();
      } else {
        if (!username.trim()) throw new Error('Please pick a username');
        await signUp(email, password, username);
        setSuccess('Account created! Check your email to confirm it, then sign in.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setSuccess('');
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />

      <div className="card-sticker relative w-full max-w-md rounded-[32px] p-6 pt-14 sm:p-8 sm:pt-16">
        <Kodo className="absolute -top-14 left-1/2 h-28 w-28 -translate-x-1/2 animate-bob" mood={success ? 'cheer' : 'happy'} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="btn-chunky absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream"
        >
          <CloseIcon />
        </button>

        <h2 id="auth-title" className="text-center text-3xl font-bold">
          {mode === 'login' ? 'Welcome back!' : 'Join the adventure!'}
        </h2>
        <p className="mt-1 text-center text-ink-soft">
          {mode === 'login' ? 'Sign in to keep your stars on every device.' : 'A grown-up can help make your account.'}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-cream p-1">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`rounded-xl py-2 font-display font-semibold transition ${mode === m ? 'bg-sun text-onfill' : 'text-ink-soft hover:text-ink'}`}
            >
              {m === 'login' ? 'Sign in' : 'New account'}
            </button>
          ))}
        </div>

        {!isConfigured && (
          <p className="mt-4 rounded-2xl bg-sun-soft px-4 py-3 text-sm font-semibold">
            Accounts aren&apos;t set up on this copy of Kodo yet, but your stars are still saved on this device.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {error && <p className="rounded-2xl bg-berry-soft px-4 py-3 text-sm font-semibold text-ink" role="alert">{error}</p>}
          {success && <p className="rounded-2xl bg-leaf-soft px-4 py-3 text-sm font-semibold text-ink" role="status">{success}</p>}

          {mode === 'signup' && (
            <label className="block">
              <span className="mb-1 block font-display text-sm font-semibold">Username</span>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="SuperCoder42" autoComplete="username" required />
            </label>
          )}
          <label className="block">
            <span className="mb-1 block font-display text-sm font-semibold">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="grownup@example.com" autoComplete="email" required />
          </label>
          <label className="block">
            <span className="mb-1 block font-display text-sm font-semibold">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="At least 6 characters"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </label>

          <button
            type="submit"
            disabled={loading || !isConfigured}
            className="btn-chunky mt-2 w-full rounded-2xl bg-leaf py-3.5 font-display text-lg font-semibold text-onfill"
          >
            {loading ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

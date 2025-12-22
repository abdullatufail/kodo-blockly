'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

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
        if (!username.trim()) {
          throw new Error('Username is required');
        }
        await signUp(email, password, username);
        setSuccess('Account created! Please check your email to verify your account.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#4ADE80] p-6 text-white relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-2xl font-bold">
              {mode === 'login' ? '👋 Welcome Back!' : '🚀 Join the Adventure!'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/50 text-xl"
            >
              ×
            </button>
          </div>
          <p className="text-white mt-1 relative z-10">
            {mode === 'login'
              ? 'Sign in to save your progress'
              : 'Create an account to track your achievements'}
          </p>
          {/* Decorative blob */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 blob-shape"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-[#F472B6]/20 border border-[#F472B6] text-[#9D174D] px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-[#4ADE80]/20 border border-[#4ADE80] text-[#166534] px-4 py-3 rounded-2xl text-sm">
              {success}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#E8E4F0] rounded-2xl focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] outline-none bg-[#E8E4F0]/30"
                placeholder="Choose a username"
                required={mode === 'signup'}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#E8E4F0] rounded-2xl focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] outline-none bg-[#E8E4F0]/30"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#E8E4F0] rounded-2xl focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] outline-none bg-[#E8E4F0]/30"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4ADE80] text-white py-3 rounded-full font-bold hover:bg-[#22C55E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : mode === 'login' ? (
              <>Sign In <span className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-sm">→</span></>
            ) : (
              <>Create Account <span className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-sm">→</span></>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-600">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={toggleMode}
              className="ml-2 text-[#A78BFA] font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#E8E4F0] animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 bg-[#4ADE80] text-gray-900 rounded-full font-medium hover:bg-[#22C55E] transition-colors flex items-center gap-2"
        >
          Sign In
          <span className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-sm">→</span>
        </button>
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </>
    );
  }

  const username = user.user_metadata?.username || user.email?.split('@')[0];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-[#A78BFA]/20 rounded-full hover:bg-[#A78BFA]/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#A78BFA] flex items-center justify-center text-white font-bold">
          {username?.[0]?.toUpperCase() || '?'}
        </div>
        <span className="font-medium text-gray-700">{username}</span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            showDropdown ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg py-2 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E8E4F0] bg-[#E8E4F0]/30">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-700 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => {
                signOut();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-3 text-[#F472B6] hover:bg-[#F472B6]/10 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

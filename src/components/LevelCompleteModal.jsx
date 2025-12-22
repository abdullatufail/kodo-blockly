'use client';

import { useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

const CONFETTI_COLORS = ['#4ADE80', '#A78BFA', '#F472B6', '#FACC15', '#38BDF8', '#FF6B6B', '#FFD93D'];

// Generate confetti pieces outside of component to avoid re-renders
function generateConfettiPieces() {
  const pieces = [];
  for (let i = 0; i < 100; i++) {
    const isCircle = Math.random() > 0.5;
    pieces.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 8 + Math.random() * 8,
      rotation: Math.random() * 360,
      borderRadius: isCircle ? '50%' : '2px',
    });
  }
  return pieces;
}

export default function LevelCompleteModal({ 
  isOpen, 
  onClose, 
  stars, 
  moveCount, 
  optimalMoves, 
  isNewBest, 
  isLoggedIn,
  nextLevelId,
  currentLevelId
}) {
  const modalRef = useRef(null);
  const confettiContainerRef = useRef(null);
  
  // Generate confetti pieces only when modal opens
  const confettiPieces = useMemo(() => {
    if (isOpen) {
      return generateConfettiPieces();
    }
    return [];
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Animate modal entrance
      if (modalRef.current) {
        gsap.fromTo(modalRef.current,
          { scale: 0.5, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
        );
      }

      // Play celebration sound
      try {
        const celebrationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgkMHRwJRfMCpWjsDXzqZtQjBGdaTG0cGZYDs1WHqlwci8lWU/NlZypL7FvJlpQjdXcqS9wruZaUI4V3KkvcK7mWlCOFdypL3Cu5lpQjhXcqS9wruZaUI4V3KkvcK7mWlCOFdypL3Cu5lpQjhXcqS9wruZaUI4V3KkvcK7mWlCOFdypL3Cu5lpQjhXcqS9wruZaUI4V3KkvcK7mWlCOFdypL3Cu5lpQjhXcqS9wruZaUI4V3KkvcK7mWlCOFdypL3Cu5lpQjhXcqS9wruZaUI4');
        celebrationSound.volume = 0.3;
        celebrationSound.play().catch(() => {});
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const starDisplay = Array(3).fill(0).map((_, i) => i < stars);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Confetti Container */}
      <div 
        ref={confettiContainerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${piece.left}%`,
              top: '-20px',
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.color,
              borderRadius: piece.borderRadius,
              animation: `confetti-fall ${piece.duration}s ease-in ${piece.delay}s forwards`,
              transform: `rotate(${piece.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-3xl p-8 border-4 border-black shadow-2xl max-w-md w-full mx-4 text-center z-10"
      >
        {/* Celebration Header */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            🎉 Level Complete!
          </h2>
          <p className="text-gray-600">
            You solved Level {currentLevelId}!
          </p>
        </div>

        {/* Stars Display */}
        <div className="flex justify-center gap-2 mb-6">
          {starDisplay.map((filled, i) => (
            <span 
              key={i} 
              className={`text-5xl transition-transform ${filled ? 'text-[#FACC15] scale-110' : 'text-gray-300'}`}
              style={{
                animation: filled ? `star-pop 0.5s ease-out ${0.3 + i * 0.15}s backwards` : 'none'
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border-2 border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Moves Used:</span>
            <span className="font-bold text-gray-900">{moveCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Optimal:</span>
            <span className="font-bold text-[#4ADE80]">{optimalMoves}</span>
          </div>
        </div>

        {/* New Best Badge */}
        {isNewBest && isLoggedIn && (
          <div className="bg-[#FACC15]/20 border-2 border-[#FACC15] rounded-full px-4 py-2 mb-6 inline-block">
            <span className="font-bold text-[#854D0E]">🏆 New Personal Best!</span>
          </div>
        )}

        {/* Sign in reminder */}
        {!isLoggedIn && (
          <div className="bg-[#A78BFA]/20 border-2 border-[#A78BFA] rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-[#5B21B6]">Sign in to save your progress!</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold border-3 border-black hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
          
          {nextLevelId ? (
            <Link
              href={`/level/${nextLevelId}`}
              className="flex-1 px-6 py-3 bg-[#4ADE80] text-gray-900 rounded-full font-bold border-3 border-black hover:bg-[#22C55E] transition-colors text-center"
            >
              Next Level →
            </Link>
          ) : (
            <Link
              href="/levels"
              className="flex-1 px-6 py-3 bg-[#A78BFA] text-white rounded-full font-bold border-3 border-black hover:bg-[#8B5CF6] transition-colors text-center"
            >
              All Levels
            </Link>
          )}
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes star-pop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

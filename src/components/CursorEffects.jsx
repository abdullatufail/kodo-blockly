'use client';

import { useEffect, useCallback } from 'react';

// Light "tuk" click sound as base64 (very short, soft click)
const CLICK_SOUND_BASE64 = 'data:audio/wav;base64,UklGRl4AAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNTguNzYuMTAwAGRhdGEYAAAAgH+AfoCAgH+AgICAfoCAgH+AgICA';

const CONFETTI_COLORS = ['#4ADE80', '#A78BFA', '#F472B6', '#FACC15', '#38BDF8', '#FF6B6B'];

export default function CursorEffects() {
  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio(CLICK_SOUND_BASE64);
      audio.volume = 0.15; // Very soft volume
      audio.playbackRate = 1.5; // Slightly faster for a snappier "tuk"
      audio.play().catch(() => {}); // Silently fail if blocked
    } catch (e) {
      // Audio not supported
    }
  }, []);

  const createConfetti = useCallback((x, y) => {
    const particles = [];
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'click-particle';
      
      // Random direction and distance
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const distance = 30 + Math.random() * 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      // Random size and color
      const size = 4 + Math.random() * 6;
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      
      particle.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        --tx: ${tx}px;
        --ty: ${ty}px;
      `;
      
      document.body.appendChild(particle);
      particles.push(particle);
    }
    
    // Clean up particles after animation
    setTimeout(() => {
      particles.forEach(p => p.remove());
    }, 600);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      playClickSound();
      createConfetti(e.clientX, e.clientY);
    };

    // Add click listener to document
    document.addEventListener('mousedown', handleClick);
    
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [playClickSound, createConfetti]);

  return null; // This component doesn't render anything visible
}

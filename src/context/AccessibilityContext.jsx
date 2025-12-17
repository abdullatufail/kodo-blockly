'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext({});

export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrast] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount (client-side only)
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast');
    const savedTts = localStorage.getItem('ttsEnabled');
    
    if (savedHighContrast === 'true') {
      setHighContrast(true);
    }
    if (savedTts === 'true') {
      setTtsEnabled(true);
    }
    setIsHydrated(true);
  }, []);

  // Apply high contrast mode to document
  useEffect(() => {
    if (!isHydrated) return;
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', JSON.stringify(highContrast));
  }, [highContrast, isHydrated]);

  // Save TTS preference
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('ttsEnabled', JSON.stringify(ttsEnabled));
  }, [ttsEnabled, isHydrated]);

  // Text-to-speech function
  const speak = (text) => {
    if (!ttsEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use a friendly voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Samantha') || 
      v.name.includes('Microsoft')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const toggleTts = () => {
    setTtsEnabled(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      toggleHighContrast,
      ttsEnabled,
      toggleTts,
      speak,
      stopSpeaking
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

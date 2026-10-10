'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { isMuted, setMuted } from '@/lib/sfx';

const AccessibilityContext = createContext({});

// Voice preference order for more natural, human-like speech
const PREFERRED_VOICE_NAMES = [
  // Premium/Natural voices (most human-like)
  'Microsoft Aria Online (Natural)',
  'Microsoft Jenny Online (Natural)',
  'Microsoft Guy Online (Natural)',
  'Google UK English Female',
  'Google UK English Male',
  'Google US English',
  'Samantha', // macOS natural voice
  'Alex', // macOS
  'Karen', // macOS Australian
  'Daniel', // macOS British
  // Fallback voices
  'Microsoft Zira',
  'Microsoft David',
  'Microsoft Mark',
];

export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrast] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(0.95); // Slightly slower for clarity
  const [speechPitch, setSpeechPitch] = useState(1.05); // Slightly higher for friendliness
  const utteranceRef = useRef(null);

  // Load voices when available
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        
        // Find the best natural-sounding voice
        let bestVoice = null;
        for (const preferredName of PREFERRED_VOICE_NAMES) {
          bestVoice = voices.find(v => 
            v.name.toLowerCase().includes(preferredName.toLowerCase()) ||
            v.name === preferredName
          );
          if (bestVoice) break;
        }
        
        // Fallback to English voices if no preferred voice found
        if (!bestVoice) {
          bestVoice = voices.find(v => 
            v.lang.startsWith('en') && 
            (v.name.includes('Female') || v.name.includes('Natural'))
          ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        }
        
        setSelectedVoice(bestVoice);
      }
    };

    // Load voices immediately and on change
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Hydrate from localStorage after mount (client-side only)
  // Using a callback pattern to batch state updates
  useEffect(() => {
    // Batch all state updates together
    const savedHighContrast = localStorage.getItem('highContrast');
    const savedTts = localStorage.getItem('ttsEnabled');
    const savedRate = localStorage.getItem('speechRate');
    const savedPitch = localStorage.getItem('speechPitch');
    
    // Use React 18's automatic batching
    const updates = () => {
      if (savedHighContrast === 'true') {
        setHighContrast(true);
      }
      if (savedTts === 'true') {
        setTtsEnabled(true);
      }
      if (savedRate) {
        setSpeechRate(parseFloat(savedRate));
      }
      if (savedPitch) {
        setSpeechPitch(parseFloat(savedPitch));
      }
      setSoundEnabled(!isMuted());
      setIsHydrated(true);
    };
    
    // Schedule updates for next tick to avoid synchronous state updates in effect
    queueMicrotask(updates);
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
    localStorage.setItem('speechRate', speechRate.toString());
    localStorage.setItem('speechPitch', speechPitch.toString());
  }, [ttsEnabled, speechRate, speechPitch, isHydrated]);

  // Enhanced text-to-speech function with more human-like delivery
  const speak = useCallback((text, options = {}) => {
    if (!ttsEnabled && !options.force) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Clean up text for better pronunciation
    const cleanText = text
      .replace(/\*\*/g, '') // Remove markdown bold
      .replace(/\*/g, '') // Remove markdown italic
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\n{2,}/g, '. ') // Convert multiple newlines to pauses
      .replace(/\n/g, ', ') // Convert single newlines to brief pauses
      .replace(/→/g, 'arrow') // Convert arrow symbols
      .replace(/↻/g, 'loop') // Convert loop symbol
      .replace(/★/g, 'star') // Convert star symbol
      .replace(/✓/g, 'checkmark') // Convert checkmark
      .replace(/⭐/g, 'star') // Convert star emoji
      .replace(/🎉/g, 'Congratulations!') // Convert celebration emoji
      .replace(/(\d+)\/(\d+)/g, '$1 out of $2') // Convert fractions
      .trim();

    // Split long text into sentences for more natural pauses
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    
    sentences.forEach((sentence, index) => {
      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      
      // Use the best available voice
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Human-like speech parameters
      utterance.rate = options.rate || speechRate;
      utterance.pitch = options.pitch || speechPitch;
      utterance.volume = options.volume || 1;
      
      // Add slight variation to make it more natural
      if (index > 0) {
        utterance.rate = utterance.rate * (0.98 + Math.random() * 0.04); // ±2% variation
      }
      
      // Store reference for cancellation
      if (index === sentences.length - 1) {
        utteranceRef.current = utterance;
      }
      
      window.speechSynthesis.speak(utterance);
    });
  }, [ttsEnabled, selectedVoice, speechRate, speechPitch]);

  // Speak with emphasis (for important messages)
  const speakWithEmphasis = useCallback((text, emphasis = 'normal') => {
    const emphasisSettings = {
      excited: { rate: 1.05, pitch: 1.15 },
      calm: { rate: 0.85, pitch: 0.95 },
      normal: { rate: speechRate, pitch: speechPitch },
      encouraging: { rate: 0.9, pitch: 1.1 },
    };
    
    speak(text, { ...emphasisSettings[emphasis], force: true });
  }, [speak, speechRate, speechPitch]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, []);

  const toggleTts = useCallback(() => {
    // Side effects stay outside the state updater so Strict Mode can't run them twice.
    if (ttsEnabled) {
      window.speechSynthesis.cancel();
      setTtsEnabled(false);
      return;
    }
    setTtsEnabled(true);
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance('Read aloud is on. I will read things out for you.');
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, [ttsEnabled, selectedVoice, speechRate, speechPitch]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isHydrated) setMuted(!soundEnabled);
  }, [soundEnabled, isHydrated]);

  // Adjust speech settings
  const adjustSpeechRate = useCallback((rate) => {
    setSpeechRate(Math.max(0.5, Math.min(2, rate)));
  }, []);

  const adjustSpeechPitch = useCallback((pitch) => {
    setSpeechPitch(Math.max(0.5, Math.min(2, pitch)));
  }, []);

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      toggleHighContrast,
      ttsEnabled,
      toggleTts,
      soundEnabled,
      toggleSound,
      speak,
      speakWithEmphasis,
      stopSpeaking,
      availableVoices,
      selectedVoice,
      setSelectedVoice,
      speechRate,
      adjustSpeechRate,
      speechPitch,
      adjustSpeechPitch,
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

import { store } from '@/lib/storage';
// Tiny synthesized sound effects (Web Audio), so there are no audio files to load.
// Everything is soft and short: this is a game for kids, not an arcade.

let ctx = null;
let muted = false;

if (typeof window !== 'undefined') {
  try {
    muted = store.get('kodo:muted') === 'true';
  } catch {
    // Storage can be blocked (private mode); sounds just stay on.
  }
}

export function setMuted(value) {
  muted = value;
  try {
    store.set('kodo:muted', String(value));
  } catch {}
}

export function isMuted() {
  return muted;
}

function audio() {
  if (muted || typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({ freq, to = freq, dur = 0.12, type = 'sine', vol = 0.12, delay = 0 }) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  tap: () => tone({ freq: 520, to: 700, dur: 0.06, vol: 0.05 }),
  step: () => tone({ freq: 330, to: 440, dur: 0.09, type: 'triangle', vol: 0.09 }),
  turn: () => tone({ freq: 600, to: 420, dur: 0.1, type: 'sine', vol: 0.06 }),
  snap: () => tone({ freq: 880, to: 1200, dur: 0.05, type: 'triangle', vol: 0.05 }),
  berry: () => {
    tone({ freq: 880, dur: 0.08, type: 'triangle', vol: 0.1 });
    tone({ freq: 1320, dur: 0.12, type: 'triangle', vol: 0.1, delay: 0.07 });
  },
  bump: () => {
    tone({ freq: 180, to: 90, dur: 0.22, type: 'square', vol: 0.06 });
    tone({ freq: 140, to: 70, dur: 0.18, type: 'sine', vol: 0.1, delay: 0.03 });
  },
  sad: () => {
    tone({ freq: 392, to: 370, dur: 0.18, type: 'triangle', vol: 0.08 });
    tone({ freq: 330, to: 262, dur: 0.32, type: 'triangle', vol: 0.08, delay: 0.18 });
  },
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, dur: 0.18, type: 'triangle', vol: 0.1, delay: i * 0.09 }));
  },
  star: (i = 0) => tone({ freq: 660 + i * 220, to: 990 + i * 220, dur: 0.16, type: 'triangle', vol: 0.09 }),
};

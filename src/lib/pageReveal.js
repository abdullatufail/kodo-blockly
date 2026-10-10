// The loader announces when the page has been revealed, so intro animations
// can wait for it instead of playing behind the curtain.
const EVENT = 'kodo:revealed';

export function markRevealed() {
  if (typeof window === 'undefined') return;
  window.__kodoRevealed = true;
  window.dispatchEvent(new Event(EVENT));
}

export function whenRevealed() {
  if (typeof window === 'undefined' || window.__kodoRevealed) return Promise.resolve();
  return new Promise((resolve) => window.addEventListener(EVENT, () => resolve(), { once: true }));
}

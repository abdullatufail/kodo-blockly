// Everything Kodo remembers on a device goes through here, so the visitor's
// choice in the cookie notice is respected everywhere.
//
// Kodo sets no cookies and no tracking. It only keeps stars, code and settings
// in this browser. If the visitor says "No thanks", saved data is cleared and
// further saves only live in memory until the tab is closed.

const CONSENT_KEY = 'kodo:consent';
const LEGACY_KEYS = ['highContrast', 'ttsEnabled', 'speechRate', 'speechPitch'];
export const CONSENT_EVENT = 'kodo:consent';
export const OPEN_CONSENT_EVENT = 'kodo:open-consent';

const memory = new Map();

export function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY); // 'accepted' | 'declined' | null
  } catch {
    return null;
  }
}

const savingAllowed = () => getConsent() !== 'declined';

function clearSaved() {
  try {
    Object.keys(localStorage)
      .filter((k) => (k.startsWith('kodo:') && k !== CONSENT_KEY) || LEGACY_KEYS.includes(k))
      .forEach((k) => {
        memory.set(k, localStorage.getItem(k));
        localStorage.removeItem(k);
      });
  } catch {}
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {}
  if (value === 'declined') clearSaved();
  if (value === 'accepted') {
    // Keep whatever was played while saving was off.
    try {
      memory.forEach((v, k) => localStorage.setItem(k, v));
      memory.clear();
    } catch {}
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export const store = {
  get(key) {
    if (memory.has(key)) return memory.get(key);
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    memory.set(key, value);
    if (!savingAllowed()) return;
    try {
      localStorage.setItem(key, value);
      memory.delete(key);
    } catch {}
  },
};

'use client';

import { OPEN_CONSENT_EVENT } from '@/lib/storage';

// Re-opens the cookie notice so visitors can change their choice.
export default function CookieSettingsButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="underline decoration-2 underline-offset-4 hover:text-sun">
      Cookie settings
    </button>
  );
}

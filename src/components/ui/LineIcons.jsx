// Friendly single-line icons for the round badges on story cards. They draw
// with `currentColor`, so the badge decides the colour.

function Line({ children, className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const LINE_ICONS = {
  steps: (
    <>
      <path d="M7 38 H17 V29 H26 V20 H35 V11 H41" />
      <circle cx="12" cy="31" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  loop: (
    <>
      <path d="M36 18 A13 13 0 1 0 37 30" />
      <path d="M37 9 V18 H28" />
    </>
  ),
  fork: (
    <>
      <path d="M24 42 V27 M24 27 C24 18 12 18 12 8 M24 27 C24 18 36 18 36 8" />
      <path d="M8 12 L12 7 L16 12 M32 12 L36 7 L40 12" />
    </>
  ),
  magnifier: (
    <>
      <circle cx="21" cy="21" r="12" />
      <path d="M30 30 L40 40" />
      <path d="M16 21 Q21 16 26 21" />
    </>
  ),
  smile: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M16 20 Q18 16 20 20 M28 20 Q30 16 32 20" />
      <path d="M15 27 Q24 37 33 27" />
    </>
  ),
  sparkle: <path d="M24 6 C26 18 30 22 42 24 C30 26 26 30 24 42 C22 30 18 26 6 24 C18 22 22 18 24 6 Z" />,
  hand: (
    <>
      <path d="M17 25 V12 a3 3 0 0 1 6 0 V22 M23 21 V9 a3 3 0 0 1 6 0 V22 M29 22 V12 a3 3 0 0 1 6 0 V27" />
      <path d="M35 24 C35 34 31 41 23 41 C16 41 12 36 9 30 L7 26 a3 3 0 0 1 5 -3 L17 28" />
    </>
  ),
  stairs: (
    <>
      <path d="M8 40 V32 H17 V24 H26 V16 H35 V8 H40" />
      <path d="M8 40 H40" />
    </>
  ),
  code: (
    <>
      <path d="M16 14 L6 24 L16 34 M32 14 L42 24 L32 34" />
      <path d="M27 10 L21 38" />
    </>
  ),
  eye: (
    <>
      <path d="M4 24 C10 13 17 9 24 9 C31 9 38 13 44 24 C38 35 31 39 24 39 C17 39 10 35 4 24 Z" />
      <circle cx="24" cy="24" r="6" />
    </>
  ),
  speaker: (
    <>
      <path d="M8 19 H15 L25 10 V38 L15 29 H8 Z" />
      <path d="M31 18 Q36 24 31 30 M36 13 Q45 24 36 35" />
    </>
  ),
  keyboard: (
    <>
      <rect x="5" y="13" width="38" height="22" rx="5" />
      <path d="M12 21 H13 M19 21 H20 M26 21 H27 M33 21 H35 M15 28 H33" />
    </>
  ),
  ear: (
    <>
      <path d="M15 20 C15 12 20 7 26 7 C33 7 37 12 37 19 C37 27 29 28 29 35 C29 39 26 42 22 42 C18 42 16 39 16 36" />
      <path d="M22 20 C22 16 24 14 27 14 C30 14 31 16 31 19" />
    </>
  ),
  blocks: (
    <>
      <path d="M8 10 H16 Q17 14 20 14 Q23 14 24 10 H40 V22 H24 Q23 26 20 26 Q17 26 16 22 H8 Z" />
      <path d="M8 26 H16 Q17 30 20 30 Q23 30 24 26 H32 V38 H8 Z" />
    </>
  ),
  bars: (
    <>
      <path d="M10 38 V30 M20 38 V22 M30 38 V15 M40 38 V8" />
    </>
  ),
  map: (
    <>
      <path d="M6 12 L17 8 L31 13 L42 9 V36 L31 40 L17 35 L6 39 Z M17 8 V35 M31 13 V40" />
    </>
  ),
  server: (
    <>
      <rect x="8" y="8" width="32" height="13" rx="4" />
      <rect x="8" y="27" width="32" height="13" rx="4" />
      <path d="M15 14.5 H16 M15 33.5 H16 M24 14.5 H33 M24 33.5 H33" />
    </>
  ),
  heart: <path d="M24 40 C10 31 6 24 6 17 C6 11 10 7 16 7 C20 7 23 10 24 13 C25 10 28 7 32 7 C38 7 42 11 42 17 C42 24 38 31 24 40 Z" />,
  brush: (
    <>
      <path d="M40 8 L22 28" />
      <path d="M21 27 C14 27 12 32 12 35 C12 38 9 40 7 40 C13 43 25 42 25 33 Z" />
    </>
  ),
  bug: (
    <>
      <rect x="15" y="15" width="18" height="24" rx="9" />
      <path d="M19 15 Q19 9 24 9 Q29 9 29 15 M15 24 H7 M33 24 H41 M16 32 L9 37 M32 32 L39 37 M16 18 L10 13 M32 18 L38 13 M24 21 V37" />
    </>
  ),
  book: (
    <>
      <path d="M24 13 C19 9 12 9 6 11 V38 C12 36 19 36 24 40 C29 36 36 36 42 38 V11 C36 9 29 9 24 13 Z M24 13 V40" />
    </>
  ),
};

export default function LineIcon({ name, className = '' }) {
  return <Line className={className}>{LINE_ICONS[name] || LINE_ICONS.smile}</Line>;
}

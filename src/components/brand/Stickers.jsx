// Little flat stickers used all over the site. No outlines: every shape is a
// solid fill, and a stroke in the same colour just rounds off sharp corners.

const round = (color, width = 6) => ({ stroke: color, strokeWidth: width, strokeLinejoin: 'round', strokeLinecap: 'round' });

export function Star({ className = '', fill = 'var(--color-ink)', ...props }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" {...props}>
      <path d="M30 7 L36.8 21.6 L52.5 23.5 L41 34.3 L44 50 L30 42.2 L16 50 L19 34.3 L7.5 23.5 L23.2 21.6 Z" fill={fill} {...round(fill, 7)} />
    </svg>
  );
}

export function Berry({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" {...props}>
      <path d="M30 24 Q31 14 37 9" fill="none" {...round('var(--color-leaf-deep)', 3.5)} />
      <path d="M33 14 C40 7 50 10 50 15 C44 21 37 20 33 14 Z" fill="var(--color-leaf-deep)" />
      <circle cx="23" cy="37" r="13" fill="var(--color-berry-deep)" />
      <circle cx="38" cy="35" r="13" fill="var(--color-berry-deep)" />
      <circle cx="19" cy="32" r="3.2" fill="#fff" opacity="0.75" />
      <circle cx="34" cy="30" r="3.2" fill="#fff" opacity="0.75" />
    </svg>
  );
}

export function Heart({ className = '', fill = 'var(--color-berry-deep)', ...props }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" {...props}>
      <path d="M30 52 C12 40 5 30 5 20 C5 11 12 6 19 6 C24 6 28 9 30 13 C32 9 36 6 41 6 C48 6 55 11 55 20 C55 30 48 40 30 52 Z" fill={fill} />
    </svg>
  );
}

export function Cloud({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden="true" {...props}>
      <path
        d="M25 60 C10 60 5 50 8 42 C11 34 20 31 27 33 C27 20 38 11 51 13 C60 4 79 6 84 19 C97 15 110 25 108 38 C116 42 116 60 100 60 Z"
        fill="var(--color-paper)"
      />
    </svg>
  );
}

export function Flower({ className = '', petal = 'var(--color-grape)', ...props }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" {...props}>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="30" cy="16" rx="9" ry="12" fill={petal} transform={`rotate(${r} 30 30)`} />
      ))}
      <circle cx="30" cy="30" r="8" fill="var(--color-sun-deep)" />
    </svg>
  );
}

export function Sun({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" {...props}>
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d="M40 5 L40 13" transform={`rotate(${i * 36} 40 40)`} {...round('var(--color-sun-deep)', 5)} />
      ))}
      <circle cx="40" cy="40" r="21" fill="var(--color-sun)" />
      <ellipse cx="34" cy="37" rx="2.6" ry="3.6" fill="var(--color-ink)" />
      <ellipse cx="46" cy="37" rx="2.6" ry="3.6" fill="var(--color-ink)" />
    </svg>
  );
}

// A jigsaw-ish code block, like the ones kids snap together in the game.
export function BlockPiece({ className = '', fill = 'var(--color-sky)', label = '', ...props }) {
  return (
    <svg viewBox="0 0 140 56" className={className} aria-hidden="true" {...props}>
      <path
        d="M10 6 H30 Q32 6 33 9 L36 15 Q37 17 40 17 H52 Q55 17 56 15 L59 9 Q60 6 62 6 H130 Q134 6 134 10 V42 Q134 46 130 46 H62 Q60 46 59 49 L56 55 Q55 57 52 57 H40 Q37 57 36 55 L33 49 Q32 46 30 46 H10 Q6 46 6 42 V10 Q6 6 10 6 Z"
        fill={fill}
      />
      {label && (
        <text x="72" y="32" textAnchor="middle" fontFamily="var(--font-display)" fontSize="17" fill="var(--color-onfill)">
          {label}
        </text>
      )}
    </svg>
  );
}

export function Cottage({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" {...props}>
      <ellipse cx="50" cy="92" rx="38" ry="5" fill="var(--color-ink)" opacity="0.12" />
      <rect x="64" y="18" width="10" height="20" rx="2" fill="var(--color-ink)" />
      <rect x="20" y="44" width="60" height="44" rx="5" fill="var(--color-paper)" />
      <path d="M10 48 L50 14 L90 48 Z" fill="var(--color-peach-deep)" {...round('var(--color-peach-deep)', 6)} />
      <path d="M43 88 V69 Q43 61 50 61 Q57 61 57 69 V88 Z" fill="var(--color-ink)" />
      <rect x="27" y="56" width="12" height="12" rx="3" fill="var(--color-sun)" />
      <rect x="61" y="56" width="12" height="12" rx="3" fill="var(--color-sun)" />
    </svg>
  );
}

export function Squiggle({ className = '', color = 'var(--color-berry)', ...props }) {
  return (
    <svg viewBox="0 0 120 24" className={className} aria-hidden="true" {...props}>
      <path d="M4 14 Q14 2 24 12 T44 12 T64 12 T84 12 T104 12 T116 10" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

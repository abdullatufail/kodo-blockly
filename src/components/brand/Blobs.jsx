// Flat, outline-free blob shapes in the spirit of cut-paper collage. Most of
// them are unions of simple circles and round-capped strokes, so with a single
// flat fill they read as one soft, wobbly shape.

function Face({ x = 50, y = 50, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="var(--color-ink)" stroke="none">
      <ellipse cx="-7" cy="-3" rx="2.6" ry="3.4" />
      <ellipse cx="7" cy="-3" rx="2.6" ry="3.4" />
      <path d="M-6 5 Q0 10 6 5" fill="none" stroke="var(--color-ink)" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function Flower({ color }) {
  const petals = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return [50 + Math.cos(a) * 25, 50 + Math.sin(a) * 25];
  });
  return (
    <g fill={color}>
      {petals.map(([cx, cy], i) => (
        <circle key={i} cx={cx.toFixed(2)} cy={cy.toFixed(2)} r="20" />
      ))}
      <circle cx="50" cy="50" r="28" />
    </g>
  );
}

function Asterisk({ color }) {
  const arms = [0, 60, 120, 180, 240, 300];
  const lengths = [36, 32, 37, 33, 35, 31];
  return (
    <g stroke={color} strokeWidth="17" strokeLinecap="round">
      {arms.map((r, i) => (
        <line key={r} x1="50" y1="50" x2="50" y2={50 - lengths[i]} transform={`rotate(${r + 8} 50 50)`} />
      ))}
    </g>
  );
}

// The chunky "play-dough" cross from the reference cards.
function Splat({ color }) {
  return (
    <g stroke={color} strokeLinecap="round" fill={color}>
      <line x1="50" y1="52" x2="22" y2="22" strokeWidth="27" />
      <line x1="50" y1="52" x2="82" y2="30" strokeWidth="25" />
      <line x1="50" y1="52" x2="76" y2="82" strokeWidth="27" />
      <line x1="50" y1="52" x2="18" y2="74" strokeWidth="23" />
      <circle cx="50" cy="52" r="20" stroke="none" />
    </g>
  );
}

function Loop({ color }) {
  return (
    <path
      d="M8 86 C20 60 34 34 56 22 C78 10 96 26 84 44 C72 62 44 56 50 36 C56 16 82 8 94 14"
      fill="none"
      stroke={color}
      strokeWidth="11"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Sparkle({ color }) {
  return <path d="M50 2 C54 36 64 46 98 50 C64 54 54 64 50 98 C46 64 36 54 2 50 C36 46 46 36 50 2 Z" fill={color} />;
}

function Pebble({ color }) {
  return (
    <path
      d="M52 6 C74 4 94 20 95 44 C96 70 80 94 52 95 C26 96 6 80 5 54 C4 30 26 8 52 6 Z"
      fill={color}
    />
  );
}

function Bloom({ color }) {
  // A rounder, five-lobed sibling of Flower.
  const lobes = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return [50 + Math.cos(a) * 22, 50 + Math.sin(a) * 22];
  });
  return (
    <g fill={color}>
      {lobes.map(([cx, cy], i) => (
        <circle key={i} cx={cx.toFixed(2)} cy={cy.toFixed(2)} r="24" />
      ))}
      <circle cx="50" cy="50" r="26" />
    </g>
  );
}

function Cloud({ color }) {
  return (
    <g fill={color}>
      <circle cx="30" cy="60" r="18" />
      <circle cx="52" cy="46" r="26" />
      <circle cx="74" cy="58" r="19" />
      <rect x="12" y="58" width="80" height="20" rx="10" />
    </g>
  );
}

function Wiggle({ color }) {
  return (
    <path
      d="M4 50 Q16 24 28 50 T52 50 T76 50 T96 46"
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
    />
  );
}

const SHAPES = { flower: Flower, asterisk: Asterisk, splat: Splat, loop: Loop, sparkle: Sparkle, pebble: Pebble, bloom: Bloom, cloud: Cloud, wiggle: Wiggle };

export const BLOB_SHAPES = Object.keys(SHAPES);

export default function Blob({ shape = 'flower', color = 'var(--color-sun)', face = false, className = '', ...props }) {
  const Shape = SHAPES[shape] || Flower;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" overflow="visible" {...props}>
      <Shape color={color} />
      {face && <Face y={shape === 'cloud' ? 58 : 50} scale={shape === 'sparkle' ? 0.7 : 1} />}
    </svg>
  );
}

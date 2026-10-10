// Kodo's friends. Same flat style as Kodo: one soft shape, dark eyes, no
// outlines. They reuse Kodo's CSS feelings (`.kodo` + `data-mood` squash,
// breathe and wander), and each one has a face of its own:
//
//   Sunny  the cheerleader       yellow flower, always grinning ^ ^
//   Bloo   the pattern spotter   blue flower, big curious eyes
//   Zip    the bug finder        pink plus, a friendly wink
//
// Moods: happy (their usual face), cheer, wow, oops, wink, sleepy.

import Kodo from './Kodo';

export const CREW = {
  kodo: {
    name: 'Kodo',
    role: 'The hero',
    text: 'Small, round and a long way from home. Follows your blocks one hop at a time.',
    color: 'var(--color-peach)',
    soft: 'var(--color-peach-soft)',
  },
  sunny: {
    name: 'Sunny',
    role: 'The cheerleader',
    text: 'Bursts into a grin every time a loop works on the first try.',
    color: 'var(--color-sun)',
    soft: 'var(--color-sun-soft)',
    face: 'happy',
  },
  bloo: {
    name: 'Bloo',
    role: 'The pattern spotter',
    text: 'Notices when steps repeat, and politely suggests a loop.',
    color: 'var(--color-sky)',
    soft: 'var(--color-sky-soft)',
    face: 'open',
  },
  zip: {
    name: 'Zip',
    role: 'The bug finder',
    text: 'Pops up when something goes wrong, with a hint, never a scolding.',
    color: 'var(--color-berry)',
    soft: 'var(--color-berry-soft)',
    face: 'wink',
  },
};

export const CREW_IDS = Object.keys(CREW);

const INK = 'var(--color-ink-dark, #11140f)';
const LOOK = { EAST: [10, 0], WEST: [-10, 0], NORTH: [0, -8], SOUTH: [0, 7], center: [0, 0] };

// Six round petals around a middle.
const PETALS = [-90, -30, 30, 90, 150, 210].map((a) => [60 + 25 * Math.cos((a * Math.PI) / 180), 62 + 25 * Math.sin((a * Math.PI) / 180)]);

function FlowerBody({ color }) {
  return (
    <g className="kodo-body" fill={color}>
      <circle cx="60" cy="62" r="30" />
      {PETALS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="22" />
      ))}
    </g>
  );
}

function PlusBody({ color }) {
  return (
    <g className="kodo-body" fill={color}>
      <rect x="12" y="45" width="96" height="34" rx="17" />
      <rect x="43" y="14" width="34" height="96" rx="17" />
    </g>
  );
}

const arc = (x) => `M${x - 8} 63 Q${x} 51 ${x + 8} 63`;
const sleepy = (x) => `M${x - 8} 59 Q${x} 66 ${x + 8} 59`;

// Faces are drawn around (60, 60); the body decides where they sit and how big.
function Face({ face }) {
  const stroke = { fill: 'none', stroke: INK, strokeWidth: 6, strokeLinecap: 'round' };
  switch (face) {
    case 'happy':
      return (
        <g {...stroke}>
          <path d={arc(46)} />
          <path d={arc(74)} />
        </g>
      );
    case 'sleepy':
      return (
        <g {...stroke}>
          <path d={sleepy(46)} />
          <path d={sleepy(74)} />
        </g>
      );
    case 'wink':
      return (
        <g>
          <ellipse className="eye-blink" cx="46" cy="58" rx="8" ry="11" fill={INK} />
          <path d={arc(74)} {...stroke} />
        </g>
      );
    case 'wow':
      return (
        <g fill={INK}>
          <circle cx="47" cy="55" r="9" />
          <circle cx="73" cy="55" r="9" />
          <ellipse cx="60" cy="74" rx="4.5" ry="5.5" />
        </g>
      );
    default:
      return (
        <g className="kodo-eyes eye-blink" fill={INK}>
          <ellipse cx="46" cy="58" rx="8" ry="11" />
          <ellipse cx="74" cy="58" rx="8" ry="11" />
        </g>
      );
  }
}

const MOOD_FACE = { cheer: 'happy', wow: 'wow', wink: 'wink', sleepy: 'sleepy' };

export function Buddy({ who = 'sunny', mood = 'happy', look = 'center', shadow = true, className = '', title, ...props }) {
  if (who === 'kodo') return <Kodo mood={mood} look={look} shadow={shadow} className={className} title={title ?? 'Kodo'} {...props} />;

  const friend = CREW[who] || CREW.sunny;
  const face = MOOD_FACE[mood] || (mood === 'oops' ? 'open' : friend.face);
  const [dx, dy] = LOOK[look] || LOOK.center;
  const label = title ?? friend.name;
  const isZip = who === 'zip';

  return (
    <svg
      viewBox="0 0 120 120"
      className={`kodo crew crew-${who} ${className}`}
      data-mood={mood}
      data-look={look}
      role="img"
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      overflow="visible"
      {...props}
    >
      {shadow && <ellipse className="kodo-shadow" cx="60" cy="116" rx="30" ry="4.5" fill="var(--color-ink)" opacity="0.12" />}
      <g className="kodo-squash">
        {isZip ? <PlusBody color={friend.color} /> : <FlowerBody color={friend.color} />}
        <g className="kodo-look" style={{ transform: `translate(${dx}px, ${dy}px)` }}>
          <g className="kodo-wander">
            <g transform={isZip ? 'translate(60 62) scale(0.72) translate(-60 -60)' : 'translate(0 2)'}>
              <Face face={face} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export const Sunny = (props) => <Buddy who="sunny" {...props} />;
export const Bloo = (props) => <Buddy who="bloo" {...props} />;
export const Zip = (props) => <Buddy who="zip" {...props} />;

// Scenery for the puzzle board. Every piece is drawn inside a 100×100 cell.
import { Berry as BerrySticker, Cottage } from '../brand/Stickers';

export const CELL = 100;

// Flat, outline-free scenery in the same cut-paper style as the rest of the site.
const line = (color, width = 3.5) => ({ fill: 'none', stroke: color, strokeWidth: width, strokeLinecap: 'round', strokeLinejoin: 'round' });
const ROCK = '#cfc6e0';
const ROCK_DARK = '#b3a6c9';

// Deterministic "random" so the same level always looks the same. Integer-only
// hashing gives identical results on the server and in every browser, which
// keeps hydration happy (Math.sin can differ in the last few digits).
export function rand(x, y, salt = 0) {
  let h = Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263) ^ Math.imul(salt + 1, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function Shadow({ rx = 30 }) {
  return <ellipse cx="50" cy="86" rx={rx} ry="6" fill="var(--color-ink)" opacity="0.12" />;
}

// The little "~~" marks from the reference illustrations.
function Marks({ x = 50, y = 50, color = 'var(--color-ink)' }) {
  return <path d={`M${x - 10} ${y} q2.5 -4 5 0 q2.5 -4 5 0 M${x - 3} ${y + 9} q2.5 -4 5 0 q2.5 -4 5 0`} {...line(color, 2.5)} opacity="0.55" />;
}

function Bush() {
  return (
    <g>
      <Shadow rx={34} />
      <circle cx="31" cy="62" r="20" fill="var(--color-leaf-deep)" />
      <circle cx="69" cy="62" r="20" fill="var(--color-leaf-deep)" />
      <circle cx="50" cy="47" r="25" fill="var(--color-leaf)" />
      <Marks x={50} y={44} />
    </g>
  );
}

function Cabbage() {
  return (
    <g>
      <Shadow rx={26} />
      <circle cx="50" cy="58" r="26" fill="var(--color-grass-deep)" />
      <circle cx="50" cy="60" r="16" fill="var(--color-lime)" />
      <path d="M50 46 V74 M40 54 Q50 62 60 54" {...line('var(--color-grass-deep)', 3)} />
    </g>
  );
}

function Sunflower() {
  return (
    <g>
      <Shadow rx={18} />
      <path d="M50 86 V48" {...line('var(--color-leaf-deep)', 4)} />
      <path d="M50 70 C38 60 30 66 30 70 C36 76 44 75 50 70 Z" fill="var(--color-leaf-deep)" />
      <path d="M50 64 C62 54 70 60 70 64 C64 70 56 69 50 64 Z" fill="var(--color-leaf-deep)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <ellipse key={r} cx="50" cy="20" rx="6" ry="10" fill="var(--color-sun)" transform={`rotate(${r} 50 34)`} />
      ))}
      <circle cx="50" cy="34" r="9" fill="var(--color-peach-deep)" />
    </g>
  );
}

function Rock() {
  return (
    <g>
      <Shadow rx={32} />
      <path d="M18 78 C12 60 22 40 42 36 C56 26 76 34 82 52 C90 66 84 80 70 82 L28 83 C22 83 19 81 18 78 Z" fill={ROCK} />
      <path d="M58 44 C66 46 72 52 73 60" {...line(ROCK_DARK, 4)} />
      <circle cx="36" cy="66" r="4" fill={ROCK_DARK} />
    </g>
  );
}

function Flowers() {
  const heads = [
    { x: 30, y: 46, c: 'var(--color-berry)' },
    { x: 66, y: 40, c: 'var(--color-grape)' },
    { x: 50, y: 62, c: 'var(--color-sun)' },
  ];
  return (
    <g>
      <Shadow rx={30} />
      {heads.map(({ x, y }, i) => (
        <path key={`s${i}`} d={`M${x} ${y} Q${x + 3} ${y + 18} ${50} 84`} {...line('var(--color-leaf-deep)', 3.5)} />
      ))}
      {heads.map(({ x, y, c }, i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((r) => (
            <circle key={r} cx={x} cy={y - 8} r="6.5" fill={c} transform={`rotate(${r} ${x} ${y})`} />
          ))}
          <circle cx={x} cy={y} r="4.5" fill="var(--color-paper)" />
        </g>
      ))}
    </g>
  );
}

function Mushroom() {
  return (
    <g>
      <Shadow rx={24} />
      <path d="M40 84 L42 56 H58 L60 84 Z" fill="var(--color-paper)" />
      <path d="M18 58 C18 30 82 30 82 58 Z" fill="var(--color-berry-deep)" stroke="var(--color-berry-deep)" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="36" cy="46" r="5" fill="var(--color-paper)" />
      <circle cx="58" cy="41" r="6" fill="var(--color-paper)" />
      <circle cx="70" cy="52" r="3.5" fill="var(--color-paper)" />
    </g>
  );
}

function PineTree() {
  return (
    <g>
      <Shadow rx={26} />
      <rect x="45" y="68" width="10" height="18" rx="4" fill="var(--color-ink)" />
      <path d="M50 8 L78 50 H64 L84 74 H16 L36 50 H22 Z" fill="var(--color-leaf-deep)" stroke="var(--color-leaf-deep)" strokeWidth="5" strokeLinejoin="round" />
      <Marks x={50} y={50} />
    </g>
  );
}

function RoundTree() {
  return (
    <g>
      <Shadow rx={28} />
      <rect x="45" y="56" width="10" height="30" rx="5" fill="var(--color-ink)" />
      <circle cx="50" cy="40" r="30" fill="var(--color-leaf-deep)" />
      <Marks x={50} y={36} />
    </g>
  );
}

const SCENERY = {
  garden: [Bush, Cabbage, Sunflower, Bush],
  meadow: [Rock, Flowers, Rock, Mushroom],
  woods: [PineTree, RoundTree, PineTree, Mushroom],
  hills: [RoundTree, Rock, Bush, Flowers],
  ridge: [PineTree, Rock, PineTree, Rock],
  caves: [Rock, Mushroom, Rock, Rock],
};

export function Obstacle({ x, y, scenery, salt }) {
  const kinds = SCENERY[scenery] || SCENERY.garden;
  const Kind = kinds[Math.floor(rand(x, y, salt) * kinds.length)];
  const s = 0.86 + rand(x, y, salt + 1) * 0.16;
  const dx = (rand(x, y, salt + 2) - 0.5) * 8;
  return (
    <g transform={`translate(${x * CELL + 50 + dx} ${y * CELL + 50}) scale(${s}) translate(-50 -50)`}>
      <Kind />
    </g>
  );
}

// Grass tufts and tiny flowers so the lawn never looks empty.
export function GrassDetail({ x, y, salt }) {
  const r = rand(x, y, salt + 9);
  if (r < 0.45) return null;
  const tx = x * CELL + 15 + rand(x, y, salt + 3) * 60;
  const ty = y * CELL + 20 + rand(x, y, salt + 4) * 60;
  if (r > 0.85) {
    return <circle cx={tx} cy={ty} r="4.5" fill="var(--color-paper)" />;
  }
  return (
    <path
      d={`M${tx - 7} ${ty + 4} q3 -9 5 -1 q2 -11 4 0 q3 -8 5 1`}
      fill="none"
      stroke="var(--color-grass-deep)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  );
}

// A rectangle with its own radius per corner: [topLeft, topRight, bottomRight, bottomLeft].
function roundRect(x0, y0, x1, y1, [tl, tr, br, bl]) {
  return [
    `M${x0 + tl} ${y0}`,
    `H${x1 - tr}`,
    tr ? `Q${x1} ${y0} ${x1} ${y0 + tr}` : '',
    `V${y1 - br}`,
    br ? `Q${x1} ${y1} ${x1 - br} ${y1}` : '',
    `H${x0 + bl}`,
    bl ? `Q${x0} ${y1} ${x0} ${y1 - bl}` : '',
    `V${y0 + tl}`,
    tl ? `Q${x0} ${y0} ${x0 + tl} ${y0}` : '',
    'Z',
  ].join(' ');
}

// Joins neighbouring cells into one smooth blob (trails, ponds).
export function blobCellPath(x, y, has, inset = 10, radius = 24) {
  const up = has(x, y - 1);
  const down = has(x, y + 1);
  const left = has(x - 1, y);
  const right = has(x + 1, y);
  const x0 = x * CELL + (left ? 0 : inset);
  const x1 = x * CELL + CELL - (right ? 0 : inset);
  const y0 = y * CELL + (up ? 0 : inset);
  const y1 = y * CELL + CELL - (down ? 0 : inset);
  return roundRect(x0, y0, x1, y1, [
    up || left ? 0 : radius,
    up || right ? 0 : radius,
    down || right ? 0 : radius,
    down || left ? 0 : radius,
  ]);
}

export function Home({ x, y }) {
  return <Cottage x={x * CELL - 8} y={y * CELL - 22} width={CELL + 16} height={CELL + 16} />;
}

export function BerryArt(props) {
  return <BerrySticker width="54" height="54" x="23" y="18" {...props} />;
}

// Kodo: a squishy little ball with big oval eyes. No outlines, just flat
// shapes. Its feelings show in how the body squashes and puffs up and where
// the eyes go. All the idle motion lives in CSS (see `.kodo` in globals.css),
// so Kodo looks alive even when nothing is animating it.
//
// Structure (other code relies on these class names):
//   .kodo-squash  the body + eyes, squashed and stretched per mood
//   .kodo-pupils  free for GSAP to move the eyes (cursor following, demos)
//   .kodo-look    the `look` prop's offset, eased with a CSS transition

const LOOK = {
  EAST: [13, 0],
  WEST: [-13, 0],
  NORTH: [0, -10],
  SOUTH: [0, 9],
  center: [0, 0],
};

export default function Kodo({
  mood = 'happy',
  look = 'center',
  blink = true,
  shadow = true,
  className = '',
  title = 'Kodo',
  ...props
}) {
  const [dx, dy] = LOOK[look] || LOOK.center;

  return (
    <svg
      viewBox="0 0 120 120"
      className={`kodo ${className}`}
      data-mood={mood}
      data-look={look}
      role="img"
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      overflow="visible"
      {...props}
    >
      {shadow && <ellipse className="kodo-shadow" cx="60" cy="112" rx="34" ry="5" fill="var(--color-ink)" opacity="0.12" />}

      <g className="kodo-squash">
        <ellipse className="kodo-body" cx="60" cy="63" rx="54" ry="45" fill="var(--color-peach)" />

        <g className="kodo-pupils">
          <g className="kodo-look" style={{ transform: `translate(${dx}px, ${dy}px)` }}>
            <g className="kodo-wander">
              {/* Open eyes */}
              <g className={`kodo-eyes ${blink ? 'eye-blink' : ''}`} fill="var(--color-ink-dark, #11140f)">
                <ellipse cx="46" cy="52" rx="9" ry="13" />
                <ellipse cx="74" cy="52" rx="9" ry="13" />
              </g>
              {/* Happy, squinting eyes for big cheers */}
              <g className="kodo-eyes-happy" fill="none" stroke="var(--color-ink-dark, #11140f)" strokeWidth="6" strokeLinecap="round">
                <path d="M37 55 Q46 42 55 55" />
                <path d="M65 55 Q74 42 83 55" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

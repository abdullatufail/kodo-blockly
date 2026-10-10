import LineIcon from './LineIcons';

// A hand-scribbled loop drawn around a short phrase. The `story-circle` path
// can be drawn in with DrawSVG by the page that uses it.
export function Circled({ children, color = 'currentColor' }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] overflow-visible"
        aria-hidden="true"
      >
        <path
          className="story-circle"
          d="M150 8 C100 0 20 4 8 28 C-2 50 80 58 150 54 C194 50 204 24 176 12 C150 2 90 4 50 10"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// A flat colour card with a round white badge poking out of the top, a big
// sign-painted title and a little story underneath.
export default function StoryCard({ icon, title, color, children, className = '', titleClassName = 'text-paper', textClassName = 'text-paper/90', as: Tag = 'div', ...props }) {
  return (
    <Tag className={`story-card relative mt-12 rounded-[30px] px-6 pb-9 pt-14 text-center ${className}`} style={{ backgroundColor: color }} {...props}>
      <span
        className="story-badge absolute left-1/2 top-0 flex h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper"
        style={{ color }}
        aria-hidden="true"
      >
        <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-[2.5px] border-current">
          <LineIcon name={icon} className="h-9 w-9" />
        </span>
      </span>
      <h3 className={`headline text-5xl sm:text-6xl ${titleClassName}`}>{title}</h3>
      <div className={`mx-auto mt-5 max-w-md text-lg font-semibold leading-snug ${textClassName}`}>{children}</div>
    </Tag>
  );
}

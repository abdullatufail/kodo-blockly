import Kodo from './Kodo';

const LETTERS = ['K', 'O', 'D', 'O'];

export default function Logo({ size = 'md', className = '', color = 'var(--color-ink)' }) {
  const big = size === 'lg';
  return (
    <span className={`group inline-flex items-center gap-1.5 select-none ${className}`}>
      <Kodo
        className={`${big ? 'h-14 w-14' : 'h-10 w-10'} -my-1 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110`}
        shadow={false}
        title=""
        aria-hidden="true"
      />
      <span className={`headline leading-none ${big ? 'text-6xl' : 'text-[2.1rem]'}`} style={{ color }} aria-label="Kodo">
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover:-translate-y-1.5"
            style={{ transitionDelay: `${i * 45}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

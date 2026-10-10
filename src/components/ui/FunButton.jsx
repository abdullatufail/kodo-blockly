import Link from 'next/link';
import WaveText from './WaveText';

const COLORS = {
  leaf: 'bg-leaf text-onfill',
  sun: 'bg-sun text-onfill',
  sky: 'bg-sky text-onfill',
  berry: 'bg-berry text-onfill',
  grape: 'bg-grape text-onfill',
  peach: 'bg-peach text-onfill',
  paper: 'bg-paper text-ink',
  cream: 'bg-cream text-ink',
  ink: 'bg-ink text-paper',
  lime: 'bg-lime text-onfill',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm gap-1.5 rounded-2xl',
  md: 'px-6 py-3 text-base gap-2 rounded-[18px]',
  lg: 'px-8 py-4 text-xl gap-3 rounded-[22px]',
};

// A pressable, chunky button. String labels get the hover "text swap" effect.
export default function FunButton({
  href,
  children,
  color = 'leaf',
  size = 'md',
  icon,
  iconAfter,
  className = '',
  ...props
}) {
  const classes = `btn-chunky group relative inline-flex items-center justify-center font-display font-semibold whitespace-nowrap ${COLORS[color]} ${SIZES[size]} ${className}`;

  const label = typeof children === 'string' ? <WaveText text={children} /> : children;

  const content = (
    <>
      {icon && <span className="inline-flex shrink-0 transition-transform duration-300 group-hover:-rotate-[20deg] group-hover:scale-125">{icon}</span>}
      {label}
      {iconAfter && <span className="inline-flex shrink-0 transition-transform duration-300 group-hover:translate-x-1">{iconAfter}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}

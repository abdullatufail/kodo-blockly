import Blob from '../brand/Blobs';
import Kodo from '../brand/Kodo';

// The big sunny banner at the top of the content pages.
export default function PageHero({ eyebrow, title, children, color = 'var(--color-sun)', mood = 'happy' }) {
  return (
    <section className="relative -mt-[68px] overflow-hidden px-4 pb-16 pt-32 text-center sm:pb-20 sm:pt-40" style={{ backgroundColor: color }}>
      <Blob shape="cloud" color="var(--color-paper)" className="absolute -left-6 top-16 h-28 w-28 animate-float sm:h-40 sm:w-40" />
      <Blob shape="flower" color="var(--color-sky-deep)" face className="absolute right-[6%] top-28 hidden h-24 w-24 animate-spin-slow md:block" />
      <Blob shape="asterisk" color="var(--color-berry-deep)" className="absolute bottom-10 left-[8%] h-12 w-12 animate-wiggle sm:h-16 sm:w-16" />
      <Blob shape="sparkle" color="var(--color-peach-deep)" className="absolute right-[24%] top-24 h-6 w-6" />
      <Blob shape="sparkle" color="var(--color-peach-deep)" className="absolute bottom-24 right-[30%] hidden h-5 w-5 sm:block" />
      <Kodo className="absolute -bottom-3 right-[7%] hidden h-24 w-24 sm:block" mood={mood} title="" />

      <div className="relative mx-auto max-w-4xl">
        <p className="font-display text-2xl">{eyebrow}</p>
        <h1 className="reveal-head headline mt-3 text-[clamp(3.4rem,10vw,7.5rem)]">{title}</h1>
        <div className="mx-auto mt-6 max-w-2xl text-lg font-semibold sm:text-xl">{children}</div>
      </div>
    </section>
  );
}

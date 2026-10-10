// Splits a label into letters that hop one after another when the parent
// `.group` is hovered. Screen readers get the plain text.
export default function WaveText({ text, className = '' }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex whitespace-pre">
        {[...text].map((ch, i) => (
          <span key={i} className="wave-char inline-block" style={{ '--i': i }}>
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

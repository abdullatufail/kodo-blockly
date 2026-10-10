// Rounded line icons that match the chunky outline style.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const make = (paths) =>
  function Icon({ className = 'h-5 w-5', ...props }) {
    return (
      <svg {...base} className={className} {...props}>
        {paths}
      </svg>
    );
  };

export const PlayIcon = make(<path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" />);
export const StopIcon = make(<rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" />);
export const ResetIcon = make(<><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.5h4.5" /></>);
export const ArrowRightIcon = make(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
export const ArrowLeftIcon = make(<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>);
export const CloseIcon = make(<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>);
export const MenuIcon = make(<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>);
export const CheckIcon = make(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const LockIcon = make(<><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>);
export const BulbIcon = make(<><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" /></>);
export const MapIcon = make(<><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" /><path d="M9 4v14" /><path d="M15 6v14" /></>);
export const TrashIcon = make(<><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" /><path d="M9 7V4h6v3" /></>);
export const EyeIcon = make(<><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" fill="currentColor" /></>);
export const SpeakerIcon = make(<><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" /><path d="M16 9a4 4 0 0 1 0 6" /><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" /></>);
export const NoteIcon = make(<><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" fill="currentColor" /><circle cx="16.5" cy="16" r="2.5" fill="currentColor" /></>);
export const SlidersIcon = make(<><path d="M5 6h14" /><path d="M5 12h14" /><path d="M5 18h14" /><circle cx="9" cy="6" r="2" fill="currentColor" /><circle cx="15" cy="12" r="2" fill="currentColor" /><circle cx="8" cy="18" r="2" fill="currentColor" /></>);
export const StepIcon = make(<><path d="M6 5v14" /><path d="M10 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4l-8.3-5.5a.8.8 0 0 0-1.2.7Z" fill="currentColor" /></>);
export const SnailIcon = make(<><path d="M3 18h13a5 5 0 0 0 5-5" /><circle cx="11" cy="12" r="5" /><path d="M11 12a1.7 1.7 0 1 1 1.7-1.7" /><path d="M19 13V8" /><path d="M21 13V9" /></>);
export const RabbitIcon = make(<><path d="M9 21c-3 0-5-2-5-5s2.5-5 6-5h2c3 0 6 2 6 5 0 1.5-.5 3-2 4" /><path d="M14 11 13 4.5a1.5 1.5 0 0 1 3 0L16.5 11" /><path d="M10 11 7.5 5a1.4 1.4 0 0 1 2.6-1L12 10.5" /><circle cx="15.5" cy="15" r="0.9" fill="currentColor" /></>);
export const UserIcon = make(<><circle cx="12" cy="8.5" r="4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>);

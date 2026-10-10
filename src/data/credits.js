// The open source projects, APIs and fonts Kodo is built on, with links to
// the people who made them.
export const CREDITS = [
  { name: 'Blockly', by: 'Google', what: 'The drag-and-drop block editor', href: 'https://developers.google.com/blockly', license: 'Apache 2.0' },
  { name: 'GSAP', by: 'GreenSock', what: 'Every bounce, wobble and walk', href: 'https://gsap.com', license: 'Free license' },
  { name: 'Next.js', by: 'Vercel', what: 'The web app framework', href: 'https://nextjs.org', license: 'MIT' },
  { name: 'React', by: 'Meta & contributors', what: 'Building the interface', href: 'https://react.dev', license: 'MIT' },
  { name: 'Tailwind CSS', by: 'Tailwind Labs', what: 'Styling and design tokens', href: 'https://tailwindcss.com', license: 'MIT' },
  { name: 'Supabase', by: 'Supabase', what: 'Sign-in and saved stars', href: 'https://supabase.com', license: 'Apache 2.0' },
  { name: 'Web Speech API', by: 'W3C & browser makers', what: 'Reading text aloud', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API', license: 'Web standard' },
  { name: 'Web Audio API', by: 'W3C & browser makers', what: 'The little game sounds', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API', license: 'Web standard' },
  { name: 'Ranchers', by: 'Impallari Type', what: 'The headline font', href: 'https://fonts.google.com/specimen/Ranchers', license: 'SIL OFL' },
  { name: 'Figtree', by: 'Erik Kennedy', what: 'The body font', href: 'https://fonts.google.com/specimen/Figtree', license: 'SIL OFL' },
];

export const creditFor = (name) => CREDITS.find((c) => c.name === name);

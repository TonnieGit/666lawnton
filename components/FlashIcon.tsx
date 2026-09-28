// Line icons in the spirit of traditional tattoo flash. Decorative only (aria-hidden).

const PATHS = {
  dagger: (
    <>
      <path d="M12 2.5 14 12h-4l2-9.5Z" />
      <path d="M7 12h10M12 12v6.5" />
      <circle cx="12" cy="20" r="1.5" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
      <path d="M12 10.5v5M9.5 13h5" />
    </>
  ),
  key: (
    <>
      <circle cx="6.5" cy="12" r="3.5" />
      <circle cx="6.5" cy="12" r="1" />
      <path d="M10 12h11.5M17.5 12v3.5M20.5 12v2.5" />
    </>
  ),
  star: (
    <>
      <path d="M12 2.5 14.35 9.26 21.51 9.41 15.8 13.74 17.88 20.59 12 16.5 6.12 20.59 8.2 13.74 2.49 9.41 9.65 9.26Z" />
      <path d="M12 12.5V2.5M12 12.5l9.51-3.09M12 12.5l5.88 8.09M12 12.5l-5.88 8.09M12 12.5 2.49 9.41" />
    </>
  ),
} as const;

export type FlashIconName = keyof typeof PATHS;

export function FlashIcon({ name, className = "size-6" }: { name: FlashIconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}

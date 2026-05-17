export function WeaponArcIcon({ className = '', strokeWidth = 1.75, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...props}>
      <circle cx="12" cy="12" r="7.1" fill="currentColor" opacity="0.08" />
      <path
        d="M18.15 8.45A7.1 7.1 0 0 0 6.9 6.9M5.85 15.55A7.1 7.1 0 0 0 17.1 17.1"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M7.55 12c0-2.45 2-4.45 4.45-4.45h3.05M16.45 12c0 2.45-2 4.45-4.45 4.45H8.95"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.55" fill="currentColor" opacity="0.13" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function ModuleBlocksIcon({ className = '', strokeWidth = 1.75, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...props}>
      <path d="M5.25 5.25h5.6v5.6h-5.6z" fill="currentColor" opacity="0.08" />
      <path d="M13.15 5.25h5.6v5.6h-5.6z" fill="currentColor" opacity="0.08" />
      <path d="M5.25 13.15h5.6v5.6h-5.6z" fill="currentColor" opacity="0.08" />
      <path d="M10.85 13.15h5.6v5.6h-5.6z" fill="currentColor" opacity="0.08" />
      <path
        d="M5.25 5.25h5.6v5.6h-5.6zM13.15 5.25h5.6v5.6h-5.6zM5.25 13.15h5.6v5.6h-5.6zM10.85 13.15h5.6v5.6h-5.6z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

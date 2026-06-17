// GCSEase brand mark — a modern 3D app-icon monogram.
//
// A bold rounded "G" on a vibrant mint→teal→cyan squircle. Depth comes from an
// extruded side face under the tile, a soft cast shadow, a glossy top sheen and
// an embossed (shadow + highlight) "G", with a small spark accent (the "ease").
// Font-independent vector paths so it also works as an app icon.

export function GCSEaseLogo({ size = 44, className = '', title = 'GCSEase' }) {
  const id = 'gl' + Math.random().toString(36).slice(2, 8);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} className={className}>
      <defs>
        <linearGradient id={`${id}-tile`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4dec8a" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e8f86" />
          <stop offset="100%" stopColor="#0b6f86" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="32%" cy="24%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-cast`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0a4f5e" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* extruded side face (gives the tile thickness) */}
      <rect x="9" y="13" width="82" height="82" rx="24" fill={`url(#${id}-side)`} />
      {/* top face of the tile */}
      <g filter={`url(#${id}-cast)`}>
        <rect x="9" y="7" width="82" height="82" rx="24" fill={`url(#${id}-tile)`} />
        <rect x="9" y="7" width="82" height="82" rx="24" fill={`url(#${id}-glow)`} />
        <rect x="9" y="7" width="82" height="56" rx="24" fill={`url(#${id}-sheen)`} />
      </g>

      {/* embossed "G": dark shadow underneath, white face, light top highlight */}
      <g transform="translate(0 1)">
        <path d="M67 36 A21 21 0 1 0 67 64" fill="none" stroke="#0a5f6e" strokeOpacity="0.35" strokeWidth="11" strokeLinecap="round" />
        <rect x="49" y="46.5" width="22" height="11" rx="5.5" fill="#0a5f6e" fillOpacity="0.35" />
      </g>
      <path d="M67 35 A21 21 0 1 0 67 63" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" />
      <rect x="49" y="45.5" width="22" height="11" rx="5.5" fill="#ffffff" />
      {/* subtle top highlight on the G for a glossy bevel */}
      <path d="M67 35 A21 21 0 0 0 35 50" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" transform="translate(0 -2.5)" />

      {/* spark accent with a touch of depth */}
      <path d="M75 22 q2.4 6 8 8 q-5.6 2 -8 8 q-2.4-6 -8-8 q5.6-2 8-8 Z" fill="#bb8a0a" transform="translate(0.5 1)" />
      <path d="M75 22 q2.4 6 8 8 q-5.6 2 -8 8 q-2.4-6 -8-8 q5.6-2 8-8 Z" fill="#fde047" />
    </svg>
  );
}

// Compact DentEdTech mark for the footer (a small 3D-feel monogram tile).
export function DentEdTechMark({ size = 16, className = '' }) {
  const id = 'dt' + Math.random().toString(36).slice(2, 8);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="DentEdTech" className={className}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a7bd5" />
          <stop offset="100%" stopColor="#1f3a8a" />
        </linearGradient>
      </defs>
      <rect x="3" y="6" width="26" height="23" rx="7" fill="#11214d" />
      <rect x="3" y="3" width="26" height="23" rx="7" fill={`url(#${id}-g)`} />
      <text x="16" y="20" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="700" fontSize="13" fill="#ffffff">D</text>
    </svg>
  );
}

export default GCSEaseLogo;

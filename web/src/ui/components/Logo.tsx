import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  // Cores: no modo light (sidebar escura) a lupa fica branca; normal usa azul+verde da marca
  const lupaColor   = light ? '#ffffff' : '#132d5e';
  const verdeColor  = light ? '#7fffcf' : '#0e9e6e';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 110 110"
      width={size}
      height={size}
      aria-label="TranspJardim"
    >
      {/* Lupa: anel */}
      <circle cx="45" cy="45" r="32" fill="none" stroke={lupaColor} strokeWidth="8" />

      {/* Barras dentro da lente */}
      <rect x="30" y="46" width="7" height="16" fill={lupaColor} rx="1.5" />
      <rect x="42" y="34" width="7" height="28" fill={verdeColor} rx="1.5" />
      <rect x="54" y="40" width="7" height="22" fill={lupaColor} rx="1.5" />

      {/* Cabo */}
      <line x1="69" y1="69" x2="90" y2="91" stroke={lupaColor} strokeWidth="8" strokeLinecap="round" />

      {/* Ponto verde no cabo */}
      <circle cx="90" cy="91" r="6" fill={verdeColor} />
    </svg>
  );
}

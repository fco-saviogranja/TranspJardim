import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  const navy  = light ? '#ffffff' : '#132d5e';
  const green = light ? '#7fffcf' : '#1aaa6e';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 110 110"
      width={size}
      height={size}
      aria-label="TranspJardim"
      fill="none"
    >
      {/* Anel da lupa */}
      <circle cx="44" cy="44" r="30" stroke={navy} strokeWidth="9" />

      {/* Reflexo / arco interno (upper-left) */}
      <path
        d="M22 30 Q26 20 36 18"
        stroke={navy}
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Barra esquerda — azul */}
      <rect x="27" y="48" width="8" height="17" rx="2" fill={navy} />

      {/* Barra central — verde (mais alta) */}
      <rect x="40" y="34" width="8" height="31" rx="2" fill={green} />

      {/* Barra direita — verde */}
      <rect x="53" y="40" width="8" height="25" rx="2" fill={green} />

      {/* Checkmark verde sobre as barras */}
      <path
        d="M27 44 L37 55 L57 30"
        stroke={green}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cabo da lupa */}
      <line
        x1="67" y1="67"
        x2="92" y2="92"
        stroke={navy}
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}


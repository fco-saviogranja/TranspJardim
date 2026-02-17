import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  const primary = '#2f6b4f';
  const accent = '#8fbf6a';
  const textColor = light ? '#ffffff' : '#1f2937';
  const strokeColor = light ? '#e7f3ea' : primary;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TranspJardim logo"
    >
      {/* Base shape */}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={primary} opacity="0.12" />
      <rect x="4" y="4" width="40" height="40" rx="10" stroke={strokeColor} strokeWidth="2" />

      {/* Leaf */}
      <path d="M30 13c-5 0-9 4-9 9 5 0 9-4 9-9z" fill={accent} />
      <path d="M21 22c3-2 6-5 9-9" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />

      {/* Road */}
      <path d="M16 31c4-4 12-4 16 0" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      <path d="M24 22v11" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Monogram */}
      <text
        x="14"
        y="33"
        fontFamily="Cinzel, 'Times New Roman', serif"
        fontSize="12.5"
        fontWeight="700"
        fill={textColor}
      >
        TJ
      </text>
    </svg>
  );
}

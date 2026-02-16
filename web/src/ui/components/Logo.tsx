import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  const textColor = light ? '#ffffff' : '#0f172a';
  const accentColor = '#2563eb';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TranspJardim logo"
    >
      {/* Shield shape */}
      <path
        d="M24 4L6 12v12c0 11.11 7.67 21.47 18 24 10.33-2.53 18-12.89 18-24V12L24 4z"
        fill={accentColor}
        opacity="0.12"
      />
      <path
        d="M24 4L6 12v12c0 11.11 7.67 21.47 18 24 10.33-2.53 18-12.89 18-24V12L24 4z"
        stroke={accentColor}
        strokeWidth="2"
        fill="none"
      />
      {/* T letter */}
      <text
        x="15"
        y="30"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="18"
        fontWeight="800"
        fill={accentColor}
      >
        T
      </text>
      {/* J letter */}
      <text
        x="25"
        y="30"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="18"
        fontWeight="800"
        fill={textColor}
        opacity="0.7"
      >
        J
      </text>
    </svg>
  );
}

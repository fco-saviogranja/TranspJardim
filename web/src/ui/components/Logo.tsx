import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  const primary = '#2f6b4f'; // Institutional green
  const strokeColor = light ? '#e7f3ea' : primary;
  const leafFill = light ? '#ffffff' : '#4ade80'; // Bright green for leaf

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TranspJardim logo"
    >
      {/* 
        Concept: A stylized seedling growing from a road/path.
        Represents growth (garden/jardim) and transport/progress.
      */}
      
      {/* Background Circle/Shield base (optional, keeping it minimal) */}
      <circle cx="24" cy="24" r="20" fill={primary} fillOpacity="0.1" />

      {/* The Road: curving from bottom up */}
      <path 
        d="M14 36 C 14 36, 18 30, 24 30 C 30 30, 34 36, 34 36" 
        stroke={strokeColor} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M24 30 V 22" 
        stroke={strokeColor} 
        strokeWidth="3" 
        strokeLinecap="round" 
      />

      {/* The Leaf: Sprouting from top of the road stem */}
      <path 
        d="M24 22 C 24 16, 16 14, 16 14 C 16 14, 18 20, 24 22 Z" 
        fill={strokeColor} 
      />
       <path 
        d="M24 22 C 24 16, 32 14, 32 14 C 32 14, 30 20, 24 22 Z" 
        fill={leafFill} 
        fillOpacity="0.8"
      />

    </svg>
  );
}


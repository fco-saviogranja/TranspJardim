import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  return (
    <img
      src="/logo.svg"
      alt="TranspJardim"
      width={size}
      height={size}
      draggable={false}
    />
  );
}

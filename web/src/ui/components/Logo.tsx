import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  const navy  = light ? '#ffffff' : '#132d5e';
  const green = light ? '#7fffcf' : '#1aaa6e';
  // Fundo interno: branco no modo normal, ligeiramente translúcido no modo light
  const inner = light ? 'rgba(255,255,255,0.12)' : '#ffffff';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-label="TranspJardim"
      fill="none"
    >
      {/* ── Fundo branco do círculo interno ── */}
      <circle cx="82" cy="82" r="55" fill={inner} />

      {/* ── Anel da lupa (borda grossa navy) ── */}
      <circle cx="82" cy="82" r="55" stroke={navy} strokeWidth="16" />

      {/* ── Arco de reflexo (canto superior esquerdo) ── */}
      <path
        d="M44 55 Q50 36 68 32"
        stroke={navy}
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.30"
      />

      {/* ── Cabo da lupa ── */}
      <line
        x1="125" y1="125"
        x2="178" y2="178"
        stroke={navy}
        strokeWidth="20"
        strokeLinecap="round"
      />

      {/* ── Barra esquerda — navy (baixa) ── */}
      <rect x="52" y="88" width="17" height="30" rx="3" fill={navy} />

      {/* ── Barra central — verde (média) ── */}
      <rect x="74" y="68" width="17" height="50" rx="3" fill={green} />

      {/* ── Barra direita — verde (mais alta) ── */}
      <rect x="96" y="54" width="17" height="64" rx="3" fill={green} />

      {/* ── Checkmark verde sobreposto ── */}
      <path
        d="M46 84 L68 108 L112 56"
        stroke={green}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  const navy      = light ? '#ffffff'        : '#132d5e';
  const greenDark = light ? '#7fffcf'        : '#1aaa6e';   // verde escuro (barras centrais + check)
  const greenMid  = light ? 'rgba(127,255,207,0.7)' : '#2ec47a'; // verde médio (barra direita)
  const inner     = light ? 'rgba(255,255,255,0.12)' : '#ffffff';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 210 210"
      width={size}
      height={size}
      aria-label="TranspJardim"
      fill="none"
    >
      {/* ── Fundo branco do círculo interno ── */}
      <circle cx="85" cy="85" r="58" fill={inner} />

      {/* ── Anel da lupa (borda grossa navy) ── */}
      <circle cx="85" cy="85" r="58" stroke={navy} strokeWidth="17" />

      {/* ── Cabo da lupa ── */}
      <line
        x1="129" y1="129"
        x2="188" y2="188"
        stroke={navy}
        strokeWidth="22"
        strokeLinecap="round"
      />

      {/* ── Barra esquerda — navy (a mais baixa) ── */}
      <rect x="48" y="91" width="18" height="32" rx="3" fill={navy} />

      {/* ── Barra central — verde escuro (média) ── */}
      <rect x="72" y="71" width="18" height="52" rx="3" fill={greenDark} />

      {/* ── Barra direita — verde (a mais alta) ── */}
      <rect x="96" y="55" width="18" height="68" rx="3" fill={greenMid} />

      {/* ── Checkmark verde-escuro sobreposto ──
           Começa no canto inferior-esquerdo (abaixo/esquerda das barras),
           desce ligeiramente para o "V" e sobe até o canto superior-direito.
      ── */}
      <path
        d="M42 86 L64 112 L116 52"
        stroke={greenDark}
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

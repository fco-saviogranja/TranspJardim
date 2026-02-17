import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  const ink = light ? 'var(--sidebar-text-active)' : 'var(--primary)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TranspJardim"
    >
      {/* Documento (publicidade ativa / dados organizados) */}
      <rect
        x="9"
        y="9"
        width="22"
        height="30"
        rx="4"
        fill={ink}
        fillOpacity="0.12"
        stroke={ink}
        strokeWidth="2"
      />

      {/* Linhas de informação (linguagem cidadã / clareza) */}
      <path d="M14 16H26" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M14 22H26" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M14 28H24" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Lupa (controle, fiscalização, foco) */}
      <circle cx="31" cy="31" r="9.5" stroke={ink} strokeWidth="2.5" fill="none" />
      <path d="M38 38L42 42" stroke={ink} strokeWidth="3" strokeLinecap="round" />

      {/* Foco interno (misto: contorno + detalhe preenchido) */}
      <circle cx="31" cy="31" r="3.5" fill={ink} fillOpacity="0.85" />

    </svg>
  );
}



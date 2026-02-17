import React from 'react';

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  // Cores institucionais baseadas nos conceitos de Transparência e Gestão Pública
  const primary = '#2f6b4f'; // Verde institucional (Jardim/Gestão)
  const secondary = '#e7f3ea'; // Fundo claro
  const strokeColor = light ? '#ffffff' : primary; 
  const fillColor = light ? 'rgba(255, 255, 255, 0.2)' : 'rgba(47, 107, 79, 0.1)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Símbolo de Transparência Institucional"
    >
      {/* 
        CONCEITO: A "Lupa sobre o Documento Público" estilizada.
        
        1. Base (O Documento/Dados): Representa os atos de gestão, orçamento e licitações (Eixo 1 - Publicidade Ativa).
           Forma geométrica sólida e organizada.
      */}
      <path 
        d="M10 8H30V40H10V8Z" 
        fill={fillColor} 
        stroke={strokeColor} 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
      
      {/* Linhas de dados (simbolizando a informação organizada) */}
      <path d="M15 15H25" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d="M15 21H25" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d="M15 27H23" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

      {/* 
        2. A Lupa / Foco (Clareza e Controle): 
           Representa a fiscalização, o controle social e a clareza (Eixo 3 e 5).
           Sobreposta ao documento, trazendo "luz" aos dados.
      */}
      <circle cx="30" cy="30" r="11" stroke={strokeColor} strokeWidth="2.5" fill="none" />
      <path d="M38 38L42 42" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
      
      {/* Detalhe interno da lupa: O "olho" ou "foco" na informação correta */}
      <circle cx="30" cy="30" r="4" fill={light ? '#ffffff' : primary} />

    </svg>
  );
}



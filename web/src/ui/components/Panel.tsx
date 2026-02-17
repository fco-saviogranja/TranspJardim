import React from 'react';

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-[var(--panel-border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

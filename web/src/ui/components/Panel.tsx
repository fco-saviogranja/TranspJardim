import React from 'react';

export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-sm)]">
      {children}
    </section>
  );
}

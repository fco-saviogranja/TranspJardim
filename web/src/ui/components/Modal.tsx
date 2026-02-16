import React from 'react';
import { X } from 'lucide-react';

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--panel-border)] bg-white shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--panel-border)] px-6 py-4">
          <h2 className="text-base font-bold text-[var(--text)]">{title}</h2>
          <button
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--text)]"
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

import React from 'react';

type Variant = 'primary' | 'outline' | 'ghost';

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
) {
  const { variant = 'ghost', className = '', ...rest } = props;

  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition shadow-sm focus-visible:outline-none';

  const styles: Record<Variant, string> = {
    primary: 'bg-[var(--jardim-green)] text-white hover:opacity-95',
    outline: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
    ghost: 'bg-white text-slate-800 hover:bg-slate-100',
  };

  const computed = `${base} ${styles[variant]} ${className}`;

  return <button className={computed} {...rest} />;
}

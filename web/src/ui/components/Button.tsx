import React from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' }
) {
  const { variant = 'ghost', size = 'md', className = '', ...rest } = props;

  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
  };

  const styles: Record<Variant, string> = {
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-sm',
    outline: 'border border-[var(--panel-border)] bg-white text-[var(--text)] hover:bg-slate-50',
    ghost: 'text-[var(--text-secondary)] hover:bg-slate-100',
    danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
  };

  const computed = `${base} ${sizes[size]} ${styles[variant]} ${className}`;

  return <button className={computed} {...rest} />;
}

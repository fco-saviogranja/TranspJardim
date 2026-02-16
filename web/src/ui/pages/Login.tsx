import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Logo } from '../components/Logo';
import { authStorage, type User } from '../lib/authStorage';
import { apiJson } from '../lib/api';

type AuthMode = 'local' | 'easy-auth';

type LoginProps = {
  authMode: AuthMode;
  onAuthenticated: () => Promise<void> | void;
};

export default function Login({ authMode, onAuthenticated }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const safeFrom = from.startsWith('/') && !from.startsWith('//') ? from : '/';
  const easyAuthRedirectUri = `${window.location.origin}${safeFrom}`;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiJson<{ user: User; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      authStorage.setAuth({ user: data.user, token: data.token });
      await onAuthenticated();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  /* ─── card shared wrapper ─── */
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* left panel – branding */}
      <div className="hidden flex-col items-center justify-center gap-6 bg-[var(--sidebar-bg)] px-10 lg:flex">
        <Logo size={72} light />
        <h2 className="text-3xl font-extrabold tracking-tight text-white">TranspJardim</h2>
        <p className="max-w-xs text-center text-sm leading-relaxed text-slate-400">
          Plataforma de transparência, eficiência e monitoramento de critérios para gestão pública municipal.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="h-1.5 w-8 rounded-full bg-[var(--primary)]" />
          <span className="h-1.5 w-8 rounded-full bg-[var(--primary)]/40" />
          <span className="h-1.5 w-8 rounded-full bg-[var(--primary)]/20" />
        </div>
      </div>

      {/* right panel – form */}
      <div className="flex flex-col items-center justify-center bg-[var(--bg)] px-6 py-12">
        <div className="w-full max-w-sm">
          {/* mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <Logo size={40} />
            <span className="text-xl font-extrabold text-[var(--text)]">TranspJardim</span>
          </div>
          {children}
        </div>
        <p className="mt-10 text-center text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} Prefeitura Municipal de Jardim &middot; Controladoria Geral
        </p>
      </div>
    </div>
  );

  if (authMode === 'easy-auth') {
    return (
      <Card>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text)]">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Autenticação corporativa habilitada</p>
        </div>
        <a
          href={`/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(easyAuthRedirectUri)}`}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[var(--primary-dark)]"
        >
          <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none"><path d="M10 0H0v10h10V0Z" fill="#f25022"/><path d="M21 0H11v10h10V0Z" fill="#7fba00"/><path d="M10 11H0v10h10V11Z" fill="#00a4ef"/><path d="M21 11H11v10h10V11Z" fill="#ffb900"/></svg>
          Entrar com Microsoft
        </a>
      </Card>
    );
  }

  return (
    <Card>
      <div className="text-center lg:text-left">
        <h1 className="text-2xl font-bold text-[var(--text)]">Bem-vindo de volta</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Acesso ao painel de controle interno</p>
      </div>

      <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-[var(--text)]">Usuário</span>
          <input
            className="rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
            autoComplete="username"
            required
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-[var(--text)]">Senha</span>
          <input
            className="rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            autoComplete="current-password"
            required
            type="password"
          />
        </label>

        {error ? (
          <div className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3.5 py-2.5 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}

        <button
          className="rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[var(--primary-dark)] disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </Card>
  );
}

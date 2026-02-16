import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

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

  if (authMode === 'easy-auth') {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-to-b from-emerald-50 via-[#f4f8f4] to-[var(--bg)] px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-md)]">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-2xl bg-[var(--jardim-green-lighter)]">
            <ShieldCheck className="h-12 w-12 text-[var(--jardim-green)]" />
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm font-black tracking-widest text-[var(--jardim-green)]">TRANSPJARDIM</div>
            <div className="mt-2 text-sm text-slate-500">Autenticação corporativa habilitada.</div>
          </div>
          <a
            href={`/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(easyAuthRedirectUri)}`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[var(--jardim-green)] px-4 py-3 text-sm font-black text-white shadow-sm hover:opacity-95"
          >
            Entrar com Microsoft
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-emerald-50 via-[#f4f8f4] to-[var(--bg)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-md)]">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-2xl bg-[var(--jardim-green-lighter)]">
          <ShieldCheck className="h-12 w-12 text-[var(--jardim-green)]" />
        </div>

        <div className="mt-4 text-center">
          <div className="text-sm font-black tracking-widest text-[var(--jardim-green)]">TRANSPJARDIM</div>
          <div className="mt-2 text-sm text-slate-500">Acesso local de desenvolvimento</div>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold">
            <span className="text-slate-700">Usuário</span>
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-transparent focus:ring-4 focus:ring-emerald-200/60"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              autoComplete="username"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            <span className="text-slate-700">Senha</span>
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-transparent focus:ring-4 focus:ring-emerald-200/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
              type="password"
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">{error}</div>
          ) : null}

          <button
            className="rounded-xl bg-[var(--jardim-green)] px-4 py-3 text-sm font-black text-white shadow-sm hover:opacity-95 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

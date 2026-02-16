import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import {
  BarChart3,
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Criterios from './pages/Criterios';
import Secretarias from './pages/Secretarias';
import Alertas from './pages/Alertas';
import Relatorios from './pages/Relatorios';
import Administracao from './pages/Administracao';
import Login from './pages/Login';

import { authStorage, type User } from './lib/authStorage';
import { apiFetch, apiJson } from './lib/api';

type AuthMode = 'local' | 'easy-auth';

type SessionResponse = {
  authenticated: boolean;
  mode: AuthMode;
  user: User | null;
  token?: string | null;
  logoutUrl?: string | null;
};

function TopBar({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  return (
    <div className="bg-[var(--jardim-green)] text-white">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm">
        <div className="flex items-center gap-4">
          <a className="opacity-95 hover:opacity-100 hover:underline" href="#">Transparência</a>
          <a className="opacity-95 hover:opacity-100 hover:underline" href="#">Ouvidoria</a>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex h-2 w-2 rounded-full bg-green-400" aria-hidden />
          <span className="opacity-95">Online</span>
          <span className="opacity-60">•</span>
          <span className="font-semibold">{user?.name ?? 'Usuário'}</span>
          <button className="inline-flex items-center gap-2 opacity-95 hover:opacity-100 hover:underline" type="button" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

function HeaderNav() {
  const linkBase =
    'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100';
  const linkActive = 'bg-[var(--jardim-green)] text-white hover:bg-[var(--jardim-green)]';

  return (
    <div className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--jardim-green-lighter)]">
            <BarChart3 className="h-5 w-5 text-[var(--jardim-green)]" />
          </div>
          <div>
            <div className="text-3xl font-black leading-none text-[var(--jardim-green)]">
              TranspJardim
            </div>
            <div className="mt-0.5 text-xs text-slate-500">Transparência Municipal</div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Navegação principal">
          <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/criterios" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
            <FileText className="h-4 w-4" />
            Critérios
          </NavLink>
          <NavLink to="/alertas" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
            <Bell className="h-4 w-4" />
            Alertas
          </NavLink>
          <NavLink to="/relatorios" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </NavLink>
          <NavLink to="/administracao" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
            <Settings className="h-4 w-4" />
            Administração
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

function Breadcrumb() {
  const location = useLocation();

  const label = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/criterios/secretarias')) return 'Critérios de Controle › Gerenciar Secretarias';
    if (path.startsWith('/criterios')) return 'Critérios';
    if (path.startsWith('/alertas')) return 'Alertas';
    if (path.startsWith('/relatorios')) return 'Relatórios Avançados';
    if (path.startsWith('/administracao')) return 'Administração';
    return 'Dashboard';
  }, [location.pathname]);

  return (
    <div className="flex items-center gap-2 px-0 py-3 text-sm">
      <span className="text-slate-500">Início</span>
      <span className="text-slate-400">›</span>
      <span className="font-medium text-slate-700">{label}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 bg-[var(--jardim-green)] text-white">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">
        <div>
          <div className="text-base font-black">Controladoria Municipal de Jardim</div>
          <div className="mt-1 text-sm opacity-90">Ceará - Brasil</div>
          <p className="mt-4 text-sm opacity-90">
            Plataforma de transparência, eficiência e monitoriamento de critérios para gestão pública municipal.
          </p>
        </div>
        <div>
          <div className="text-base font-black">Contato</div>
          <div className="mt-2 text-sm opacity-90">Rua Central, s/n - Centro, Jardim/CE</div>
          <div className="mt-1 text-sm opacity-90">(85) 3000-0000</div>
          <div className="mt-1 text-sm opacity-90">controleinterno@transpjardim.com</div>
          <div className="mt-1 text-sm opacity-90">Seg-Sex: 8h às 17h</div>
        </div>
        <div>
          <div className="text-base font-black">Acesso Rápido</div>
          <div className="mt-2 text-sm opacity-90">Portal da Transparência</div>
          <div className="mt-1 text-sm opacity-90">Ouvidoria Municipal</div>
          <div className="mt-1 text-sm opacity-90">Lei de Acesso à Informação</div>
          <div className="mt-1 text-sm opacity-90">Portal de Serviços</div>
          <div className="mt-4 text-sm opacity-90">jardim.ce.gov.br</div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs opacity-90">
          <span>© 2026 Prefeitura Municipal de Jardim - Todos os direitos reservados</span>
          <span>TranspJardim v1.0 • Desenvolvido pela Controladoria Geral do Município</span>
        </div>
      </div>
    </footer>
  );
}

function Shell({ user, onLogout, children }: { user: User | null; onLogout: () => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopBar user={user} onLogout={onLogout} />
      <HeaderNav />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4">
        <Breadcrumb />
        {children}
      </main>
      <Footer />
    </div>
  );
}

function RequireAuth({ user, children }: { user: User | null; children: React.ReactNode }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());
  const [authMode, setAuthMode] = useState<AuthMode>('local');
  const [ready, setReady] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const session = await apiJson<SessionResponse>('/api/auth/session');
      setAuthMode(session.mode ?? 'local');

      if (session.authenticated && session.user) {
        authStorage.setAuth({
          user: session.user,
          token: session.mode === 'easy-auth' ? null : (session.token ?? authStorage.getToken()),
        });
      } else {
        authStorage.clear();
      }
    } catch (_err) {
      authStorage.clear();
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const unsub = authStorage.subscribe((nextUser) => setUser(nextUser));
    void refreshSession();
    return () => unsub();
  }, [refreshSession]);

  async function handleLogout() {
    const res = await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    const payload = res
      ? ((await res.json().catch(() => ({}))) as { logoutUrl?: string })
      : undefined;
    authStorage.clear();
    if (authMode === 'easy-auth') {
      const base = payload?.logoutUrl || '/.auth/logout';
      const post = encodeURIComponent(`${window.location.origin}/login`);
      const joiner = base.includes('?') ? '&' : '?';
      window.location.href = `${base}${joiner}post_logout_redirect_uri=${post}`;
    }
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-slate-600">
        Carregando sessão...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login authMode={authMode} onAuthenticated={refreshSession} />}
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/*"
        element={(
          <RequireAuth user={user}>
            <Shell user={user} onLogout={() => { void handleLogout(); }}>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="criterios" element={<Criterios />} />
                <Route path="criterios/secretarias" element={<Secretarias />} />
                <Route path="alertas" element={<Alertas />} />
                <Route path="relatorios" element={<Relatorios />} />
                <Route path="administracao" element={<Administracao />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Shell>
          </RequireAuth>
        )}
      />
    </Routes>
  );
}

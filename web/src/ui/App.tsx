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
  ChevronLeft,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Users,
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Criterios from './pages/Criterios';
import Secretarias from './pages/Secretarias';
import Alertas from './pages/Alertas';
import Relatorios from './pages/Relatorios';
import Administracao from './pages/Administracao';
import Login from './pages/Login';

import { Logo } from './components/Logo';
import { authStorage, type User } from './lib/authStorage';
import { apiFetch, apiJson } from './lib/api';

type AuthMode = 'local' | 'easy-auth' | 'hybrid';

type SessionResponse = {
  authenticated: boolean;
  mode: AuthMode;
  provider?: 'local' | 'easy-auth' | null;
  user: User | null;
  token?: string | null;
  logoutUrl?: string | null;
};

/* ─── Navigation items ─── */
const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/criterios', icon: FileText, label: 'Critérios' },
  { to: '/alertas', icon: Bell, label: 'Alertas' },
  { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  { to: '/administracao', icon: Settings, label: 'Administração' },
];

/* ─── Sidebar ─── */
function Sidebar({
  user,
  collapsed,
  onToggle,
  onLogout,
}: {
  user: User | null;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[var(--sidebar-bg)] transition-all duration-200 ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <Logo size={32} light />
        {!collapsed && (
          <span className="text-base font-bold tracking-tight text-white">
            TranspJardim
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-white'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer – user info */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && user && (
          <div className="mb-2 px-3">
            <div className="truncate text-sm font-semibold text-white">{user.name ?? 'Usuário'}</div>
            <div className="truncate text-xs text-[var(--sidebar-text)]">{user.email ?? ''}</div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            title="Sair"
            className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-white"
            type="button"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
          <button
            onClick={onToggle}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-white"
            type="button"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ─── Top bar ─── */
function TopBar({ user }: { user: User | null }) {
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith('/criterios/secretarias')) return 'Secretarias';
    if (p.startsWith('/criterios')) return 'Critérios';
    if (p.startsWith('/alertas')) return 'Alertas';
    if (p.startsWith('/relatorios')) return 'Relatórios';
    if (p.startsWith('/administracao')) return 'Administração';
    return 'Dashboard';
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--panel-border)] bg-white/80 px-6 backdrop-blur-md">
      <div>
        <h1 className="text-lg font-bold text-[var(--text)]">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-lighter)] text-sm font-bold text-[var(--primary)]">
          {(user?.name ?? 'U').charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-semibold text-[var(--text)]">{user?.name ?? 'Usuário'}</div>
          <div className="text-xs text-[var(--text-muted)]">{user?.role === 'admin' ? 'Administrador' : 'Padrão'}</div>
        </div>
      </div>
    </header>
  );
}

/* ─── Shell ─── */
function Shell({ user, onLogout, children }: { user: User | null; onLogout: () => void; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar user={user} collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} onLogout={onLogout} />
      <div
        className={`transition-all duration-200 ${collapsed ? 'ml-[68px]' : 'ml-[240px]'}`}
      >
        <TopBar user={user} />
        <main className="mx-auto w-full max-w-[1200px] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ─── Route guard ─── */
function RequireAuth({ user, children }: { user: User | null; children: React.ReactNode }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

/* ─── App root ─── */
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
          token: session.token ?? authStorage.getToken() ?? null,
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
    if (payload?.logoutUrl) {
      const base = payload.logoutUrl;
      const post = encodeURIComponent(`${window.location.origin}/login`);
      const joiner = base.includes('?') ? '&' : '?';
      window.location.href = `${base}${joiner}post_logout_redirect_uri=${post}`;
    }
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--primary-lighter)] border-t-[var(--primary)]" />
          <span className="text-sm font-medium text-[var(--text-muted)]">Carregando...</span>
        </div>
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

export type User = {
  id: string;
  username: string;
  role: 'admin' | 'padrao' | string;
  name: string;
  email: string;
};

type AuthPayload = {
  user: User;
  token?: string | null;
};

const STORAGE_KEY = 'transpjardim_auth';

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readAuth(): AuthPayload | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = safeJsonParse(raw);
  if (!parsed || typeof parsed !== 'object') return null;
  const p = parsed as Partial<AuthPayload>;
  if (!p.user) return null;
  return { user: p.user, token: p.token ?? null };
}

const listeners = new Set<(user: User | null) => void>();

export const authStorage = {
  getAuth(): AuthPayload | null {
    return readAuth();
  },

  getUser(): User | null {
    return readAuth()?.user ?? null;
  },

  getToken(): string | null {
    return readAuth()?.token ?? null;
  },

  setAuth(auth: AuthPayload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    for (const fn of listeners) fn(auth.user);
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    for (const fn of listeners) fn(null);
  },

  subscribe(fn: (user: User | null) => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

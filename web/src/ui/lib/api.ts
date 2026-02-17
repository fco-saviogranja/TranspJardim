import { authStorage } from './authStorage';

function buildHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers ?? {});
  const token = authStorage.getToken();
  if (token && !headers.has('x-auth-token')) {
    headers.set('x-auth-token', token);
  }
  if (
    init?.body &&
    !(init.body instanceof FormData) &&
    !headers.has('content-type')
  ) {
    headers.set('content-type', 'application/json');
  }
  return headers;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = authStorage.getToken();
  const res = await fetch(path, {
    ...init,
    headers: buildHeaders(init),
    // When we have a Bearer token, omit cookies so Azure Easy Auth does not
    // intercept the request (it blocks POST/PUT/DELETE with 403 when the
    // AppServiceAuthSession cookie is present).  Without a token we need
    // same-origin so the Easy Auth cookie flows on GET /api/auth/session.
    credentials: token ? 'omit' : 'same-origin',
  });

  if (res.status === 401) {
    authStorage.clear();
  }

  return res;
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  const payload = (await res.json().catch(() => ({}))) as {
    error?: string;
  } & T;
  if (!res.ok) {
    throw new Error(payload.error ?? 'Falha na requisição.');
  }
  return payload;
}

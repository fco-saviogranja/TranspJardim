import React, { useEffect, useState } from 'react';
import { Bell, Building2, FileText, Pencil, Plus, Shield, Trash2, Users } from 'lucide-react';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { apiFetch, apiJson } from '../lib/api';

type Overview = {
  usuariosAtivos: number;
  criteriosCadastrados: number;
  alertasAtivos: number;
  secretarias: number;
};

type Usuario = {
  id: string;
  username: string;
  role: string;
  name: string;
  email: string;
  secretariaId: string | null;
  secretariaNome?: string;
  isActive: boolean;
};

type UsuarioForm = {
  username: string;
  role: string;
  name: string;
  email: string;
  isActive: boolean;
  password: string;
  secretariaId: string;
};

type Secretaria = {
  id: string;
  nome: string;
  sigla: string;
  descricao?: string | null;
  dataCriacao?: string;
};

type SecretariaForm = {
  nome: string;
  sigla: string;
  descricao: string;
};

const emptySecretariaForm: SecretariaForm = {
  nome: '',
  sigla: '',
  descricao: '',
};

const emptyForm: UsuarioForm = {
  username: '',
  role: 'padrao',
  name: '',
  email: '',
  isActive: true,
  password: '',
  secretariaId: '',
};

export default function Administracao() {
  const [data, setData] = useState<Overview | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<Usuario | null>(null);
  const [form, setForm] = useState<UsuarioForm>(emptyForm);
  const [error, setError] = useState('');
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);

  /* Secretarias state */
  const [showNewSec, setShowNewSec] = useState(false);
  const [showEditSec, setShowEditSec] = useState(false);
  const [selectedSec, setSelectedSec] = useState<Secretaria | null>(null);
  const [secForm, setSecForm] = useState<SecretariaForm>(emptySecretariaForm);
  const [secError, setSecError] = useState('');

  useEffect(() => {
    Promise.all([
      apiJson<Overview>('/api/admin/overview'),
      apiJson<{ items: Usuario[] }>('/api/usuarios'),
      apiJson<{ items: Secretaria[] }>('/api/secretarias'),
    ])
      .then(([overviewRes, usuariosRes, secretariasRes]) => {
        setData(overviewRes);
        setUsuarios(usuariosRes.items ?? []);
        setSecretarias(secretariasRes.items ?? []);
      })
      .catch(() => {
        setData(null);
        setUsuarios([]);
        setSecretarias([]);
      });
  }, []);

  const overviewCards = [
    { label: 'Usuários Ativos', value: data?.usuariosAtivos ?? 0, icon: Users, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary-lighter)]' },
    { label: 'Critérios Cadastrados', value: data?.criteriosCadastrados ?? 0, icon: FileText, color: 'text-[var(--success)]', bg: 'bg-emerald-50' },
    { label: 'Alertas Ativos', value: data?.alertasAtivos ?? 0, icon: Bell, color: 'text-[var(--warning)]', bg: 'bg-amber-50' },
    { label: 'Secretarias', value: data?.secretarias ?? 0, icon: Shield, color: 'text-[var(--info)]', bg: 'bg-sky-50' },
  ];

  function openNewModal() {
    setForm(emptyForm);
    setError('');
    setShowNew(true);
  }

  function openEditModal(user: Usuario) {
    setSelected(user);
    setForm({
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      password: '',
      secretariaId: user.secretariaId ?? '',
    });
    setError('');
    setShowEdit(true);
  }

  async function createUsuario() {
    setError('');
    try {
      const created = await apiJson<Usuario>('/api/usuarios', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setUsuarios((prev) => [...prev, created]);
      setShowNew(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar usuário.');
    }
  }

  async function updateUsuario() {
    if (!selected) return;
    setError('');
    try {
      const payload = { ...form };
      if (!payload.password) {
        delete (payload as { password?: string }).password;
      }
      const updated = await apiJson<Usuario>(`/api/usuarios/${selected.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setUsuarios((prev) => prev.map((user) => (user.id === updated.id ? updated : user)));
      setShowEdit(false);
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar usuário.');
    }
  }

  async function deleteUsuario(id: string) {
    if (!confirm('Deseja excluir este usuário?')) return;
    const res = await apiFetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      alert(payload.error ?? 'Falha ao excluir usuário.');
      return;
    }
    setUsuarios((prev) => prev.filter((user) => user.id !== id));
  }

  /* ── Secretaria CRUD ── */
  function openNewSecModal() {
    setSecForm(emptySecretariaForm);
    setSecError('');
    setShowNewSec(true);
  }

  function openEditSecModal(sec: Secretaria) {
    setSelectedSec(sec);
    setSecForm({ nome: sec.nome, sigla: sec.sigla, descricao: sec.descricao ?? '' });
    setSecError('');
    setShowEditSec(true);
  }

  async function createSecretaria() {
    setSecError('');
    try {
      const created = await apiJson<Secretaria>('/api/secretarias', {
        method: 'POST',
        body: JSON.stringify(secForm),
      });
      setSecretarias((prev) => [...prev, created]);
      setShowNewSec(false);
    } catch (err) {
      setSecError(err instanceof Error ? err.message : 'Falha ao criar secretaria.');
    }
  }

  async function updateSecretaria() {
    if (!selectedSec) return;
    setSecError('');
    try {
      const updated = await apiJson<Secretaria>(`/api/secretarias/${selectedSec.id}`, {
        method: 'PUT',
        body: JSON.stringify(secForm),
      });
      setSecretarias((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setShowEditSec(false);
      setSelectedSec(null);
    } catch (err) {
      setSecError(err instanceof Error ? err.message : 'Falha ao atualizar secretaria.');
    }
  }

  async function deleteSecretaria(id: string) {
    if (!confirm('Deseja excluir esta secretaria?')) return;
    const res = await apiFetch(`/api/secretarias/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      alert(payload.error ?? 'Falha ao excluir secretaria.');
      return;
    }
    setSecretarias((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text)]">Painel Administrativo</h2>
        <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">Gerencie usuários, configurações e monitore o sistema</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Panel key={label} className="flex items-start gap-3">
            <div className={`grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color}`} />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-medium text-[var(--text-muted)]">{label}</div>
              <div className="mt-0.5 text-xl sm:text-2xl font-extrabold text-[var(--text)]">{value}</div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-bold text-[var(--text)]">Usuários</h3>
          <Button type="button" variant="primary" size="sm" onClick={openNewModal}><Plus className="mr-1.5 h-3.5 w-3.5" />Novo Usuário</Button>
        </div>

        {/* Cards mobile */}
        <div className="mt-4 grid gap-3 sm:hidden">
          {usuarios.map((user) => (
            <div key={user.id} className="flex items-start justify-between gap-3 rounded-lg border border-[var(--panel-border)] bg-white p-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text)]">{user.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-[var(--text-muted)]'}`}>
                    {user.role === 'admin' ? 'Admin' : 'Padrão'}
                  </span>
                  <span className={`inline-block h-2 w-2 rounded-full ${user.isActive ? 'bg-[var(--success)]' : 'bg-slate-300'}`} />
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">@{user.username} · {user.email}</p>
                {user.secretariaNome && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{user.secretariaNome}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]" type="button" title="Editar" onClick={() => openEditModal(user)}><Pencil className="h-4 w-4" /></button>
                <button className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-50 hover:text-[var(--danger)]" type="button" title="Excluir" onClick={() => { void deleteUsuario(user.id); }}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {usuarios.length === 0 && <p className="py-6 text-center text-sm text-[var(--text-muted)]">Nenhum usuário cadastrado.</p>}
        </div>

        {/* Tabela sm+ */}
        <div className="mt-4 hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Nome</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Username</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Email</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Secretaria</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Perfil</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Ativo</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id} className="text-sm transition-colors hover:bg-slate-50">
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 font-semibold text-[var(--text)]">{user.name}</td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 text-[var(--text-muted)]">{user.username}</td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 text-[var(--text-muted)]">{user.email}</td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 text-[var(--text-muted)]">{user.secretariaNome ?? '—'}</td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-[var(--text-muted)]'}`}>
                      {user.role === 'admin' ? 'Admin' : 'Padrão'}
                    </span>
                  </td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3">
                    <span className={`inline-block h-2 w-2 rounded-full ${user.isActive ? 'bg-[var(--success)]' : 'bg-slate-300'}`} />
                  </td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]" type="button" title="Editar" onClick={() => openEditModal(user)}><Pencil className="h-4 w-4" /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-50 hover:text-[var(--danger)]" type="button" title="Excluir" onClick={() => { void deleteUsuario(user.id); }}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal open={showNew} title="Novo Usuário" onClose={() => setShowNew(false)}>
        <UsuarioFields form={form} setForm={setForm} secretarias={secretarias} />
        {error ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void createUsuario(); }}>Criar</Button>
        </div>
      </Modal>

      <Modal open={showEdit} title="Editar Usuário" onClose={() => setShowEdit(false)}>
        <UsuarioFields form={form} setForm={setForm} secretarias={secretarias} />
        {error ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void updateUsuario(); }}>Salvar</Button>
        </div>
      </Modal>

      {/* ── Secretarias ── */}
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-bold text-[var(--text)]">Secretarias</h3>
          <Button type="button" variant="primary" size="sm" onClick={openNewSecModal}><Plus className="mr-1.5 h-3.5 w-3.5" />Nova Secretaria</Button>
        </div>

        {/* Cards mobile */}
        <div className="mt-4 grid gap-3 sm:hidden">
          {secretarias.map((sec) => (
            <div key={sec.id} className="flex items-start justify-between gap-3 rounded-lg border border-[var(--panel-border)] bg-white p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-[var(--info)]" />
                  <span className="text-sm font-semibold text-[var(--text)]">{sec.nome}</span>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-[var(--info)]">{sec.sigla}</span>
                </div>
                {sec.descricao && <p className="mt-1 text-xs text-[var(--text-muted)]">{sec.descricao}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]" type="button" title="Editar" onClick={() => openEditSecModal(sec)}><Pencil className="h-4 w-4" /></button>
                <button className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-50 hover:text-[var(--danger)]" type="button" title="Excluir" onClick={() => { void deleteSecretaria(sec.id); }}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {secretarias.length === 0 && <p className="py-6 text-center text-sm text-[var(--text-muted)]">Nenhuma secretaria cadastrada.</p>}
        </div>

        {/* Tabela sm+ */}
        <div className="mt-4 hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[700px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Nome</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Sigla</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Descrição</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Criação</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {secretarias.map((sec) => (
                <tr key={sec.id} className="text-sm transition-colors hover:bg-slate-50">
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 font-semibold text-[var(--text)]">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 shrink-0 text-[var(--info)]" />
                      {sec.nome}
                    </div>
                  </td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3">
                    <span className="inline-block rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-[var(--info)]">{sec.sigla}</span>
                  </td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 text-[var(--text-muted)]">{sec.descricao || '—'}</td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 text-[var(--text-muted)]">{sec.dataCriacao ?? '—'}</td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]" type="button" title="Editar" onClick={() => openEditSecModal(sec)}><Pencil className="h-4 w-4" /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-50 hover:text-[var(--danger)]" type="button" title="Excluir" onClick={() => { void deleteSecretaria(sec.id); }}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {secretarias.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">Nenhuma secretaria cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal open={showNewSec} title="Nova Secretaria" onClose={() => setShowNewSec(false)}>
        <SecretariaFields form={secForm} setForm={setSecForm} />
        {secError ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{secError}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowNewSec(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void createSecretaria(); }}>Criar</Button>
        </div>
      </Modal>

      <Modal open={showEditSec} title="Editar Secretaria" onClose={() => setShowEditSec(false)}>
        <SecretariaFields form={secForm} setForm={setSecForm} />
        {secError ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{secError}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowEditSec(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void updateSecretaria(); }}>Salvar</Button>
        </div>
      </Modal>
    </div>
  );
}

function UsuarioFields({
  form,
  setForm,
  secretarias,
}: {
  form: UsuarioForm;
  setForm: React.Dispatch<React.SetStateAction<UsuarioForm>>;
  secretarias: Secretaria[];
}) {
  const inputCls = 'rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)]';

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Nome *</span>
        <input className={inputCls} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Username *</span>
        <input className={inputCls} value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value.toLowerCase() }))} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Email *</span>
        <input className={inputCls} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value.toLowerCase() }))} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Perfil</span>
        <select className={inputCls} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
          <option value="padrao">Padrão</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Secretaria</span>
        <select className={inputCls} value={form.secretariaId} onChange={(e) => setForm((p) => ({ ...p, secretariaId: e.target.value }))}>
          <option value="">Nenhuma</option>
          {secretarias.map((s) => (
            <option key={s.id} value={s.id}>{s.nome} ({s.sigla})</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Senha {form.password ? '' : '(opcional em edição)'}</span>
        <input className={inputCls} type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Status</span>
        <select className={inputCls} value={String(form.isActive)} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'true' }))}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </label>
    </div>
  );
}

function SecretariaFields({
  form,
  setForm,
}: {
  form: SecretariaForm;
  setForm: React.Dispatch<React.SetStateAction<SecretariaForm>>;
}) {
  const inputCls = 'rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)]';

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Nome *</span>
        <input className={inputCls} value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Sigla *</span>
        <input className={inputCls} value={form.sigla} onChange={(e) => setForm((p) => ({ ...p, sigla: e.target.value.toUpperCase() }))} />
      </label>
      <label className="col-span-full grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Descrição</span>
        <textarea className={inputCls + ' min-h-[80px] resize-y'} value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} />
      </label>
    </div>
  );
}

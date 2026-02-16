import React, { useEffect, useState } from 'react';
import { Bell, FileText, Pencil, Plus, Shield, Trash2, Users } from 'lucide-react';
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
  isActive: boolean;
};

type UsuarioForm = {
  username: string;
  role: string;
  name: string;
  email: string;
  isActive: boolean;
  password: string;
};

const emptyForm: UsuarioForm = {
  username: '',
  role: 'padrao',
  name: '',
  email: '',
  isActive: true,
  password: '',
};

export default function Administracao() {
  const [data, setData] = useState<Overview | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<Usuario | null>(null);
  const [form, setForm] = useState<UsuarioForm>(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiJson<Overview>('/api/admin/overview'),
      apiJson<{ items: Usuario[] }>('/api/usuarios'),
    ])
      .then(([overviewRes, usuariosRes]) => {
        setData(overviewRes);
        setUsuarios(usuariosRes.items ?? []);
      })
      .catch(() => {
        setData(null);
        setUsuarios([]);
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

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-xl font-bold text-[var(--text)]">Painel Administrativo</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Gerencie usuários, configurações e monitore o sistema</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {overviewCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Panel key={label} className="flex items-start gap-3">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-muted)]">{label}</div>
              <div className="mt-0.5 text-2xl font-extrabold text-[var(--text)]">{value}</div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[var(--text)]">Usuários</h3>
          <Button type="button" variant="primary" size="sm" onClick={openNewModal}><Plus className="mr-1.5 h-3.5 w-3.5" />Novo Usuário</Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Nome</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Username</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Email</th>
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
        <UsuarioFields form={form} setForm={setForm} />
        {error ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void createUsuario(); }}>Criar</Button>
        </div>
      </Modal>

      <Modal open={showEdit} title="Editar Usuário" onClose={() => setShowEdit(false)}>
        <UsuarioFields form={form} setForm={setForm} />
        {error ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void updateUsuario(); }}>Salvar</Button>
        </div>
      </Modal>
    </div>
  );
}

function UsuarioFields({
  form,
  setForm,
}: {
  form: UsuarioForm;
  setForm: React.Dispatch<React.SetStateAction<UsuarioForm>>;
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

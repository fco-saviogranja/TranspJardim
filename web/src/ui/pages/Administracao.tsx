import React, { useEffect, useState } from 'react';
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

  const cards = [
    { label: 'Usuários Ativos', value: data?.usuariosAtivos ?? 0 },
    { label: 'Critérios Cadastrados', value: data?.criteriosCadastrados ?? 0 },
    { label: 'Alertas Ativos', value: data?.alertasAtivos ?? 0 },
    { label: 'Secretarias', value: data?.secretarias ?? 0 },
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
    <div className="grid gap-4">
      <Panel>
        <div className="text-xl font-black text-slate-800">Painel Administrativo</div>
        <div className="mt-1 text-sm text-slate-500">Gerencie usuários, configurações e monitore o sistema</div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-sm)]">
            <div className="text-xs font-bold text-slate-500">{c.label}</div>
            <div className="mt-2 text-3xl font-black text-slate-800">{c.value}</div>
          </div>
        ))}
      </div>

      <Panel>
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-black text-slate-800">Usuários</div>
          <Button type="button" variant="primary" onClick={openNewModal}>+ Novo Usuário</Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-black text-slate-600">
                <th className="border-b border-slate-200 px-3 py-3">Nome</th>
                <th className="border-b border-slate-200 px-3 py-3">Username</th>
                <th className="border-b border-slate-200 px-3 py-3">Email</th>
                <th className="border-b border-slate-200 px-3 py-3">Perfil</th>
                <th className="border-b border-slate-200 px-3 py-3">Ativo</th>
                <th className="border-b border-slate-200 px-3 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id} className="text-sm">
                  <td className="border-b border-slate-100 px-3 py-3 font-semibold text-slate-800">{user.name}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{user.username}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{user.email}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{user.role}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{user.isActive ? 'Sim' : 'Não'}</td>
                  <td className="border-b border-slate-100 px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-50" type="button" onClick={() => openEditModal(user)}>Editar</button>
                      <button className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50" type="button" onClick={() => { void deleteUsuario(user.id); }}>Excluir</button>
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
        {error ? <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void createUsuario(); }}>Criar</Button>
        </div>
      </Modal>

      <Modal open={showEdit} title="Editar Usuário" onClose={() => setShowEdit(false)}>
        <UsuarioFields form={form} setForm={setForm} />
        {error ? <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">{error}</div> : null}
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
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold">
        <span>Nome *</span>
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        <span>Username *</span>
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value.toLowerCase() }))} />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        <span>Email *</span>
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value.toLowerCase() }))} />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        <span>Perfil</span>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
          <option value="padrao">Padrão</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        <span>Senha {form.password ? '' : '(opcional em edição)'}</span>
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        <span>Status</span>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={String(form.isActive)} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'true' }))}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </label>
    </div>
  );
}

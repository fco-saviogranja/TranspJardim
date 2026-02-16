import React, { useEffect, useState } from 'react';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { apiFetch, apiJson } from '../lib/api';

type Secretaria = {
  id: string;
  nome: string;
  sigla: string;
  descricao: string | null;
  dataCriacao: string | null;
};

type FormState = {
  nome: string;
  sigla: string;
  descricao: string;
};

const emptyForm: FormState = {
  nome: '',
  sigla: '',
  descricao: '',
};

export default function Secretarias() {
  const [items, setItems] = useState<Secretaria[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<Secretaria | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    apiJson<{ items: Secretaria[] }>('/api/secretarias')
      .then((d) => setItems((d.items ?? []) as Secretaria[]))
      .catch(() => setItems([]));
  }, []);

  function openNewModal() {
    setForm(emptyForm);
    setError('');
    setShowNew(true);
  }

  function openEditModal(item: Secretaria) {
    setSelected(item);
    setForm({
      nome: item.nome,
      sigla: item.sigla,
      descricao: item.descricao ?? '',
    });
    setError('');
    setShowEdit(true);
  }

  async function handleCreate() {
    setError('');
    try {
      const created = await apiJson<Secretaria>('/api/secretarias', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setItems((prev) => [...prev, created]);
      setShowNew(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar secretaria.');
    }
  }

  async function handleUpdate() {
    if (!selected) return;
    setError('');
    try {
      const updated = await apiJson<Secretaria>(`/api/secretarias/${selected.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setShowEdit(false);
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar secretaria.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esta secretaria?')) return;
    const res = await apiFetch(`/api/secretarias/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      alert(payload.error ?? 'Falha ao excluir secretaria.');
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xl font-black text-slate-800">Gerenciar Secretarias</div>
          <div className="mt-1 text-sm text-slate-500">Cadastre e gerencie as secretarias do município</div>
        </div>
        <Button variant="primary" type="button" onClick={openNewModal}>+ Nova Secretaria</Button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs font-black text-slate-600">
              <th className="border-b border-slate-200 px-3 py-3">Nome</th>
              <th className="border-b border-slate-200 px-3 py-3">Sigla</th>
              <th className="border-b border-slate-200 px-3 py-3">Descrição</th>
              <th className="border-b border-slate-200 px-3 py-3">Data de Criação</th>
              <th className="border-b border-slate-200 px-3 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="text-sm">
                <td className="border-b border-slate-100 px-3 py-3 font-semibold text-slate-800">{it.nome}</td>
                <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{it.sigla}</td>
                <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{it.descricao ?? '-'}</td>
                <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{it.dataCriacao ?? '-'}</td>
                <td className="border-b border-slate-100 px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-50" type="button" onClick={() => openEditModal(it)}>Editar</button>
                    <button className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50" type="button" onClick={() => { void handleDelete(it.id); }}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}

            {!items.length ? (
              <tr>
                <td className="px-3 py-10 text-center text-sm text-slate-500" colSpan={5}>
                  Nenhuma secretaria cadastrada.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal open={showNew} title="Nova Secretaria" onClose={() => setShowNew(false)}>
        <SecretariaForm form={form} setForm={setForm} />
        {error ? <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void handleCreate(); }}>Criar</Button>
        </div>
      </Modal>

      <Modal open={showEdit} title="Editar Secretaria" onClose={() => setShowEdit(false)}>
        <SecretariaForm form={form} setForm={setForm} />
        {error ? <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void handleUpdate(); }}>Salvar</Button>
        </div>
      </Modal>
    </Panel>
  );
}

function SecretariaForm({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div className="mt-4 grid gap-3">
      <label className="grid gap-2 text-sm font-semibold">
        <span>Nome *</span>
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        <span>Sigla *</span>
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm uppercase" value={form.sigla} onChange={(e) => setForm((p) => ({ ...p, sigla: e.target.value.toUpperCase() }))} />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        <span>Descrição</span>
        <textarea className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} rows={3} />
      </label>
    </div>
  );
}

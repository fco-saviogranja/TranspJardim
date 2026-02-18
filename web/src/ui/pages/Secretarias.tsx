import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
    <div className="grid gap-5">
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text)]">Gerenciar Secretarias</h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">Cadastre e gerencie as secretarias do município</p>
          </div>
          <Button variant="primary" type="button" size="sm" onClick={openNewModal}><Plus className="mr-1.5 h-3.5 w-3.5" />Nova Secretaria</Button>
        </div>

        {/* Cards mobile */}
        <div className="mt-4 grid gap-3 sm:hidden">
          {items.map((it) => (
            <div key={it.id} className="flex items-start justify-between gap-3 rounded-lg border border-[var(--panel-border)] bg-white p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text)]">{it.nome}</p>
                <span className="mt-1 inline-block rounded-md bg-[var(--primary-lighter)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">{it.sigla}</span>
                {it.descricao && <p className="mt-1 text-xs text-[var(--text-muted)]">{it.descricao}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]" type="button" title="Editar" onClick={() => openEditModal(it)}><Pencil className="h-4 w-4" /></button>
                <button className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-50 hover:text-[var(--danger)]" type="button" title="Excluir" onClick={() => { void handleDelete(it.id); }}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {!items.length && <p className="py-6 text-center text-sm text-[var(--text-muted)]">Nenhuma secretaria cadastrada.</p>}
        </div>

        {/* Tabela sm+ */}
        <div className="mt-5 hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Nome</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Sigla</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Descrição</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Data de Criação</th>
                <th className="border-b border-[var(--panel-border)] px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="text-sm transition-colors hover:bg-slate-50">
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 font-semibold text-[var(--text)]">{it.nome}</td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3"><span className="inline-block rounded-md bg-[var(--primary-lighter)] px-2 py-0.5 text-xs font-semibold text-[var(--primary)]">{it.sigla}</span></td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 text-[var(--text-muted)]">{it.descricao ?? '-'}</td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 text-[var(--text-muted)]">{it.dataCriacao ?? '-'}</td>
                  <td className="border-b border-[var(--panel-border)]/50 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]" type="button" title="Editar" onClick={() => openEditModal(it)}><Pencil className="h-4 w-4" /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-50 hover:text-[var(--danger)]" type="button" title="Excluir" onClick={() => { void handleDelete(it.id); }}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {!items.length ? (
                <tr>
                  <td className="px-4 py-12 text-center text-sm text-[var(--text-muted)]" colSpan={5}>
                    Nenhuma secretaria cadastrada.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal open={showNew} title="Nova Secretaria" onClose={() => setShowNew(false)}>
        <SecretariaForm form={form} setForm={setForm} />
        {error ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void handleCreate(); }}>Criar</Button>
        </div>
      </Modal>

      <Modal open={showEdit} title="Editar Secretaria" onClose={() => setShowEdit(false)}>
        <SecretariaForm form={form} setForm={setForm} />
        {error ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void handleUpdate(); }}>Salvar</Button>
        </div>
      </Modal>
    </div>
  );
}

function SecretariaForm({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const inputCls = 'rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)]';

  return (
    <div className="mt-4 grid gap-4">
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Nome *</span>
        <input className={inputCls} value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Sigla *</span>
        <input className={`${inputCls} uppercase`} value={form.sigla} onChange={(e) => setForm((p) => ({ ...p, sigla: e.target.value.toUpperCase() }))} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Descrição</span>
        <textarea className={inputCls} value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} rows={3} />
      </label>
    </div>
  );
}

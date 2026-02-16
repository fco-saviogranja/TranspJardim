import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Panel } from '../components/Panel';
import { apiFetch, apiJson } from '../lib/api';

type Criterio = {
  id: string;
  nome: string;
  status: string;
  periodicidade: string;
  secretariaId: string | null;
  secretaria: string;
  responsavel: string;
  descricao?: string;
};

type Secretaria = {
  id: string;
  nome: string;
  sigla: string;
};

type FormState = {
  nome: string;
  status: string;
  secretariaId: string;
  responsavel: string;
  periodicidade: string;
  descricao: string;
};

const emptyForm: FormState = {
  nome: '',
  status: 'Ativo',
  secretariaId: '',
  responsavel: '',
  periodicidade: 'Mensal',
  descricao: '',
};

function buildCsv(items: Criterio[]): string {
  const header = ['Nome', 'Status', 'Periodicidade', 'Secretaria', 'Responsável'];
  const lines = items.map((item) =>
    [item.nome, item.status, item.periodicidade, item.secretaria, item.responsavel]
      .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
      .join(','));
  return [header.join(','), ...lines].join('\n');
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Criterios() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Criterio[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('todos');
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<Criterio | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiJson<{ items: Criterio[] }>('/api/criterios'),
      apiJson<{ items: Secretaria[] }>('/api/secretarias'),
    ])
      .then(([criteriosRes, secretariasRes]) => {
        setItems(criteriosRes.items ?? []);
        setSecretarias(secretariasRes.items ?? []);
      })
      .catch(() => {
        setItems([]);
        setSecretarias([]);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const matchesQuery = !q || it.nome.toLowerCase().includes(q);
      const matchesStatus = status === 'todos' || it.status.toLowerCase() === status;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, status]);

  function openCreateModal() {
    setError('');
    setForm(emptyForm);
    setShowNew(true);
  }

  function openEditModal(item: Criterio) {
    setError('');
    setSelected(item);
    setForm({
      nome: item.nome,
      status: item.status,
      secretariaId: item.secretariaId ?? '',
      responsavel: item.responsavel ?? '',
      periodicidade: item.periodicidade,
      descricao: item.descricao ?? '',
    });
    setShowEdit(true);
  }

  async function handleCreate() {
    setError('');
    try {
      const created = await apiJson<Criterio>('/api/criterios', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setItems((prev) => [created, ...prev]);
      setShowNew(false);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar o critério.');
    }
  }

  async function handleUpdate() {
    if (!selected) return;
    setError('');
    try {
      const updated = await apiJson<Criterio>(`/api/criterios/${selected.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setShowEdit(false);
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o critério.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este critério?')) return;
    const res = await apiFetch(`/api/criterios/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      alert(payload.error ?? 'Falha ao excluir critério.');
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function exportCsv() {
    const csv = buildCsv(filtered);
    downloadCsv('criterios.csv', csv);
  }

  return (
    <div className="grid gap-4">
      <Panel>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
          <div className="text-xl font-black text-slate-800">Critérios e Indicadores</div>
          <div className="mt-1 text-sm text-slate-500">Gerencie e acompanhe todos os critérios de transparência municipal</div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <input
              className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar critérios..."
            />

            <div className="flex flex-wrap items-center gap-2">
              <select
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="vencido">Vencido</option>
                <option value="concluído">Concluído</option>
              </select>

              <Button type="button" variant="outline" onClick={exportCsv}>Exportar</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/criterios/secretarias')}>Secretarias</Button>
              <Button type="button" variant="primary" onClick={openCreateModal}>+ Novo Critério</Button>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-black text-slate-600">
                <th className="border-b border-slate-200 px-3 py-3">Nome</th>
                <th className="border-b border-slate-200 px-3 py-3">Status</th>
                <th className="border-b border-slate-200 px-3 py-3">Periodicidade</th>
                <th className="border-b border-slate-200 px-3 py-3">Secretaria</th>
                <th className="border-b border-slate-200 px-3 py-3">Responsável</th>
                <th className="border-b border-slate-200 px-3 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it.id} className="text-sm">
                  <td className="border-b border-slate-100 px-3 py-3 font-semibold text-slate-800">{it.nome}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{it.status}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{it.periodicidade}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{it.secretaria}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{it.responsavel}</td>
                  <td className="border-b border-slate-100 px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-50" type="button" onClick={() => openEditModal(it)}>Editar</button>
                      <button className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50" type="button" onClick={() => { void handleDelete(it.id); }}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}

              {!filtered.length ? (
                <tr>
                  <td className="px-3 py-10 text-center text-sm text-slate-500" colSpan={6}>
                    Nenhum critério encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal open={showNew} title="Novo Critério" onClose={() => setShowNew(false)}>
        <div className="text-sm text-slate-500">
          Preencha as informações para criar um novo critério.
        </div>
        <FormFields form={form} setForm={setForm} secretarias={secretarias} />
        {error ? <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void handleCreate(); }}>Criar Critério</Button>
        </div>
      </Modal>

      <Modal open={showEdit} title="Editar Critério" onClose={() => setShowEdit(false)}>
        <FormFields form={form} setForm={setForm} secretarias={secretarias} />
        {error ? <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void handleUpdate(); }}>Salvar</Button>
        </div>
      </Modal>
    </div>
  );
}

function FormFields({
  form,
  setForm,
  secretarias,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  secretarias: Secretaria[];
}) {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold">
        <span>Nome do Critério *</span>
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
      </label>

      <label className="grid gap-2 text-sm font-semibold">
        <span>Status</span>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
          <option>Ativo</option>
          <option>Pendente</option>
          <option>Vencido</option>
          <option>Concluído</option>
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold">
        <span>Secretaria *</span>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.secretariaId} onChange={(e) => setForm((p) => ({ ...p, secretariaId: e.target.value }))}>
          <option value="">Selecione</option>
          {secretarias.map((secretaria) => (
            <option key={secretaria.id} value={secretaria.id}>{secretaria.nome}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold">
        <span>Responsável *</span>
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.responsavel} onChange={(e) => setForm((p) => ({ ...p, responsavel: e.target.value }))} />
      </label>

      <label className="grid gap-2 text-sm font-semibold">
        <span>Periodicidade *</span>
        <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.periodicidade} onChange={(e) => setForm((p) => ({ ...p, periodicidade: e.target.value }))}>
          <option>Mensal</option>
          <option>Bimestral</option>
          <option>Semestral</option>
          <option>Anual</option>
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        <span>Descrição</span>
        <textarea className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} rows={4} />
      </label>
    </div>
  );
}

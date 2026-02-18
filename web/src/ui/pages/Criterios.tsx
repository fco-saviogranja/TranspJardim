import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronDown, Download, Filter, Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Panel } from '../components/Panel';
import { apiFetch, apiJson } from '../lib/api';
import { useIsAdmin } from '../lib/userContext';

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
  const isAdmin = useIsAdmin();
  const [items, setItems] = useState<Criterio[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('todos');
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<Criterio | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  function toggleGroup(key: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

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

  // Agrupa os critérios filtrados por secretaria
  const porSecretaria = useMemo(() => {
    const map = new Map<string, { label: string; id: string | null; items: Criterio[] }>();

    for (const it of filtered) {
      const key = it.secretariaId ?? '__sem_secretaria__';
      if (!map.has(key)) {
        map.set(key, { label: it.secretaria || 'Sem Secretaria', id: it.secretariaId, items: [] });
      }
      map.get(key)!.items.push(it);
    }

    // Ordena os grupos: secretarias conhecidas em ordem alfabética, "Sem Secretaria" por último
    return [...map.values()].sort((a, b) => {
      if (!a.id) return 1;
      if (!b.id) return -1;
      return a.label.localeCompare(b.label, 'pt-BR');
    });
  }, [filtered]);

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

  async function handleConcluir(id: string) {
    try {
      const updated = await apiJson<Criterio>(`/api/criterios/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Concluído' }),
      });
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      alert('Não foi possível marcar como concluído.');
    }
  }

  function exportCsv() {
    const csv = buildCsv(filtered);
    downloadCsv('criterios.csv', csv);
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      Ativo: 'bg-emerald-50 text-[var(--success)]',
      Concluído: 'bg-blue-50 text-[var(--info)]',
      Pendente: 'bg-amber-50 text-[var(--warning)]',
      Vencido: 'bg-red-50 text-[var(--danger)]',
    };
    return map[s] ?? 'bg-slate-100 text-[var(--text-muted)]';
  };

  return (
    <div className="grid gap-5">
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">Critérios e Indicadores</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Gerencie e acompanhe todos os critérios de transparência municipal</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={exportCsv}><Download className="mr-1.5 h-3.5 w-3.5" />Exportar</Button>
            {isAdmin && (
              <>
                <Button type="button" variant="outline" size="sm" onClick={() => navigate('/criterios/secretarias')}><Users className="mr-1.5 h-3.5 w-3.5" />Secretarias</Button>
                <Button type="button" variant="primary" size="sm" onClick={openCreateModal}><Plus className="mr-1.5 h-3.5 w-3.5" />Novo Critério</Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              className="w-full rounded-lg border border-[var(--panel-border)] bg-white py-2 pl-9 pr-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar critérios..."
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-[var(--text-muted)]" />
            <select
              className="rounded-lg border border-[var(--panel-border)] bg-white px-3 py-2 text-sm text-[var(--text)] outline-none"
              title="Filtrar por status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="pendente">Pendente</option>
              <option value="vencido">Vencido</option>
              <option value="concluído">Concluído</option>
            </select>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--text)]">{filtered.length} critério{filtered.length !== 1 ? 's' : ''}</span>
            <span className="text-sm text-[var(--text-muted)]">em {porSecretaria.length} secretaria{porSecretaria.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Panel>

      {porSecretaria.length === 0 ? (
        <Panel>
          <p className="py-10 text-center text-sm text-[var(--text-muted)]">Nenhum critério encontrado com os filtros aplicados.</p>
        </Panel>
      ) : (
        porSecretaria.map((grupo) => (
          <Panel key={grupo.id ?? '__sem__'}>
            {/* Cabeçalho clicável */}
            <button
              type="button"
              className="flex w-full items-center gap-3 text-left"
              onClick={() => toggleGroup(grupo.id ?? '__sem__')}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-lighter)]">
                <Users className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[var(--text)]">{grupo.label}</h3>
                <p className="text-xs text-[var(--text-muted)]">{grupo.items.length} critério{grupo.items.length !== 1 ? 's' : ''}</p>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
                  expandedGroups.has(grupo.id ?? '__sem__') ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedGroups.has(grupo.id ?? '__sem__') && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[700px] border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="border-b border-[var(--panel-border)] px-4 py-3">Nome</th>
                    <th className="border-b border-[var(--panel-border)] px-4 py-3">Status</th>
                    <th className="border-b border-[var(--panel-border)] px-4 py-3">Periodicidade</th>
                    <th className="border-b border-[var(--panel-border)] px-4 py-3">Responsável</th>
                    <th className="border-b border-[var(--panel-border)] px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {grupo.items.map((it) => (
                    <tr key={it.id} className="text-sm transition-colors hover:bg-slate-50">
                      <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 font-semibold text-[var(--text)]">{it.nome}</td>
                      <td className="border-b border-[var(--panel-border)]/50 px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(it.status)}`}>{it.status}</span>
                      </td>
                      <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 text-[var(--text-muted)]">{it.periodicidade}</td>
                      <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 text-[var(--text-muted)]">{it.responsavel}</td>
                      <td className="border-b border-[var(--panel-border)]/50 px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {isAdmin ? (
                            <>
                              <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]" type="button" title="Editar" onClick={() => openEditModal(it)}><Pencil className="h-4 w-4" /></button>
                              <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-50 hover:text-[var(--danger)]" type="button" title="Excluir" onClick={() => { void handleDelete(it.id); }}><Trash2 className="h-4 w-4" /></button>
                            </>
                          ) : (
                            it.status !== 'Concluído' && (
                              <button
                                className="flex items-center gap-1.5 rounded-lg border border-[var(--success)] px-2.5 py-1 text-xs font-semibold text-[var(--success)] transition hover:bg-emerald-50"
                                type="button"
                                title="Marcar como Concluído"
                                onClick={() => { void handleConcluir(it.id); }}
                              >
                                <CheckCircle className="h-3.5 w-3.5" />Concluir
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </Panel>
        ))
      )}

      <Modal open={showNew} title="Novo Critério" onClose={() => setShowNew(false)}>
        <p className="text-sm text-[var(--text-muted)]">Preencha as informações para criar um novo critério.</p>
        <FormFields form={form} setForm={setForm} secretarias={secretarias} />
        {error ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{error}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void handleCreate(); }}>Criar Critério</Button>
        </div>
      </Modal>

      <Modal open={showEdit} title="Editar Critério" onClose={() => setShowEdit(false)}>
        <FormFields form={form} setForm={setForm} secretarias={secretarias} />
        {error ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{error}</div> : null}
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
  const inputCls = 'rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)]';

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Nome do Critério *</span>
        <input className={inputCls} value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
      </label>

      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Status</span>
        <select className={inputCls} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
          <option>Ativo</option>
          <option>Pendente</option>
          <option>Vencido</option>
          <option>Concluído</option>
        </select>
      </label>

      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Secretaria *</span>
        <select className={inputCls} value={form.secretariaId} onChange={(e) => setForm((p) => ({ ...p, secretariaId: e.target.value }))}>
          <option value="">Selecione</option>
          {secretarias.map((secretaria) => (
            <option key={secretaria.id} value={secretaria.id}>{secretaria.nome}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Responsável *</span>
        <input className={inputCls} value={form.responsavel} onChange={(e) => setForm((p) => ({ ...p, responsavel: e.target.value }))} />
      </label>

      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Periodicidade *</span>
        <select className={inputCls} value={form.periodicidade} onChange={(e) => setForm((p) => ({ ...p, periodicidade: e.target.value }))}>
          <option>Mensal</option>
          <option>Bimestral</option>
          <option>Semestral</option>
          <option>Anual</option>
        </select>
      </label>

      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)] md:col-span-2">
        <span>Descrição</span>
        <textarea className={inputCls} value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} rows={4} />
      </label>
    </div>
  );
}

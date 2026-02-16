import React, { useEffect, useMemo, useState } from 'react';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';
import { apiFetch, apiJson } from '../lib/api';

type Alerta = {
  id: string;
  tipo?: string;
  mensagem?: string;
  prioridade?: string;
  lido?: boolean;
  createdAt?: string;
};

function buildCsv(items: Alerta[]): string {
  const header = ['Tipo', 'Mensagem', 'Prioridade', 'Lido'];
  const lines = items.map((item) =>
    [item.tipo ?? '', item.mensagem ?? '', item.prioridade ?? '', item.lido ? 'sim' : 'não']
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
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

export default function Alertas() {
  const [items, setItems] = useState<Alerta[]>([]);
  const [tab, setTab] = useState<'alertas' | 'estatisticas'>('alertas');
  const [query, setQuery] = useState('');
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    apiJson<{ items: Alerta[] }>('/api/alertas')
      .then((d) => setItems((d.items ?? []) as Alerta[]))
      .catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => String(it.mensagem ?? it.tipo ?? '').toLowerCase().includes(q));
  }, [items, query]);

  const estatisticas = useMemo(() => ({
    total: items.length,
    lidos: items.filter((item) => item.lido).length,
    novos: items.filter((item) => !item.lido).length,
  }), [items]);

  async function markAsRead(id: string) {
    const res = await apiFetch(`/api/alertas/${id}/read`, { method: 'PATCH' });
    if (!res.ok) return;
    const payload = (await res.json().catch(() => null)) as Alerta | null;
    if (!payload) return;
    setItems((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
  }

  function exportCsv() {
    downloadCsv('alertas.csv', buildCsv(filtered));
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xl font-black text-slate-800">Central de Alertas</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" type="button" onClick={() => setCompact((prev) => !prev)}>
            {compact ? 'Vista Expandida' : 'Vista Compacta'}
          </Button>
          <Button variant="outline" type="button" onClick={exportCsv}>Exportar</Button>
        </div>
      </div>

      <div className="mt-4 inline-flex rounded-full bg-slate-100 p-1">
        <button
          className={`rounded-full px-4 py-2 text-sm font-black ${tab === 'alertas' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
          type="button"
          onClick={() => setTab('alertas')}
        >
          Alertas
        </button>
        <button
          className={`rounded-full px-4 py-2 text-sm font-black ${tab === 'estatisticas' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
          type="button"
          onClick={() => setTab('estatisticas')}
        >
          Estatísticas
        </button>
      </div>

      {tab === 'estatisticas' ? (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <StatsCard title="Total" value={estatisticas.total} />
          <StatsCard title="Novos" value={estatisticas.novos} />
          <StatsCard title="Lidos" value={estatisticas.lidos} />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <input
              className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar alertas..."
            />
          </div>

          {!filtered.length ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">
              Nenhum alerta ativo no momento
            </div>
          ) : (
            <div className={`mt-5 grid ${compact ? 'gap-1' : 'gap-2'}`}>
              {filtered.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-800">{it.mensagem ?? it.tipo}</div>
                    {!compact ? (
                      <div className="mt-1 text-xs text-slate-500">
                        {it.prioridade ?? 'baixa'} • {it.createdAt ? new Date(it.createdAt).toLocaleString('pt-BR') : 'sem data'}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{it.lido ? 'lido' : 'novo'}</span>
                    {!it.lido ? (
                      <Button type="button" variant="outline" onClick={() => { void markAsRead(it.id); }}>
                        Marcar lido
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-sm)]">
      <div className="text-xs font-bold text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-black text-slate-800">{value}</div>
    </div>
  );
}

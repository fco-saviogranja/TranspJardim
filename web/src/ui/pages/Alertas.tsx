import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle, Download, Eye, Search } from 'lucide-react';
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
    <div className="grid gap-5">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">Central de Alertas</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Monitore e gerencie alertas do sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" type="button" size="sm" onClick={() => setCompact((prev) => !prev)}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />{compact ? 'Expandida' : 'Compacta'}
            </Button>
            <Button variant="outline" type="button" size="sm" onClick={exportCsv}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Exportar
            </Button>
          </div>
        </div>

        <div className="mt-4 inline-flex rounded-lg border border-[var(--panel-border)] bg-[var(--bg)] p-1">
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${tab === 'alertas' ? 'bg-white text-[var(--text)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
            type="button"
            onClick={() => setTab('alertas')}
          >
            Alertas
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${tab === 'estatisticas' ? 'bg-white text-[var(--text)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
            type="button"
            onClick={() => setTab('estatisticas')}
          >
            Estatísticas
          </button>
        </div>
      </Panel>

      {tab === 'estatisticas' ? (
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard title="Total" value={estatisticas.total} icon={Bell} color="text-[var(--primary)]" bg="bg-[var(--primary-lighter)]" />
          <StatsCard title="Novos" value={estatisticas.novos} icon={Bell} color="text-[var(--warning)]" bg="bg-amber-50" />
          <StatsCard title="Lidos" value={estatisticas.lidos} icon={CheckCircle} color="text-[var(--success)]" bg="bg-emerald-50" />
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              className="w-full max-w-sm rounded-lg border border-[var(--panel-border)] bg-white py-2 pl-9 pr-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar alertas..."
            />
          </div>

          {!filtered.length ? (
            <Panel className="flex flex-col items-center justify-center py-12">
              <Bell className="h-8 w-8 text-[var(--text-muted)]" />
              <span className="mt-2 text-sm text-[var(--text-muted)]">Nenhum alerta ativo no momento</span>
            </Panel>
          ) : (
            <div className={`grid ${compact ? 'gap-1' : 'gap-2'}`}>
              {filtered.map((it) => (
                <Panel key={it.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-[var(--text)]">{it.mensagem ?? it.tipo}</div>
                    {!compact ? (
                      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityBadge(it.prioridade)}`}>
                          {it.prioridade ?? 'baixa'}
                        </span>
                        <span>{it.createdAt ? new Date(it.createdAt).toLocaleString('pt-BR') : 'sem data'}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${it.lido ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
                      {it.lido ? 'lido' : 'novo'}
                    </span>
                    {!it.lido ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => { void markAsRead(it.id); }}>
                        Marcar lido
                      </Button>
                    ) : null}
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function priorityBadge(p?: string) {
  const map: Record<string, string> = {
    alta: 'bg-red-50 text-[var(--danger)]',
    média: 'bg-amber-50 text-[var(--warning)]',
    baixa: 'bg-blue-50 text-[var(--info)]',
  };
  return map[(p ?? 'baixa').toLowerCase()] ?? 'bg-slate-100 text-[var(--text-muted)]';
}

function StatsCard({ title, value, icon: Icon, color, bg }: { title: string; value: number; icon: React.ElementType; color: string; bg: string }) {
  return (
    <Panel className="flex items-start gap-3">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div>
        <div className="text-xs font-medium text-[var(--text-muted)]">{title}</div>
        <div className="mt-0.5 text-2xl font-extrabold text-[var(--text)]">{value}</div>
      </div>
    </Panel>
  );
}

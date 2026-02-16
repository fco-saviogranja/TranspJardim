import React, { useEffect, useState } from 'react';
import { BarChart3, FileText } from 'lucide-react';
import { Panel } from '../components/Panel';
import { apiJson } from '../lib/api';

type ReportRow = {
  secretaria: string;
  total: number;
  concluidos: number;
  pendentes: number;
  vencidos: number;
};

export default function Relatorios() {
  const [rows, setRows] = useState<ReportRow[]>([]);

  useEffect(() => {
    apiJson<{ porSecretaria: ReportRow[] }>('/api/relatorios')
      .then((d) => setRows(d.porSecretaria ?? []))
      .catch(() => setRows([]));
  }, []);

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-xl font-bold text-[var(--text)]">Relatórios Avançados</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Visão consolidada por secretaria</p>
      </div>

      {!rows.length ? (
        <Panel className="flex flex-col items-center justify-center py-16">
          <FileText className="h-10 w-10 text-[var(--text-muted)]" />
          <span className="mt-3 text-sm text-[var(--text-muted)]">Nenhum critério disponível para análise</span>
        </Panel>
      ) : (
        <Panel>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--text)]">Resumo por Secretaria</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="border-b border-[var(--panel-border)] px-4 py-3">Secretaria</th>
                  <th className="border-b border-[var(--panel-border)] px-4 py-3">Total</th>
                  <th className="border-b border-[var(--panel-border)] px-4 py-3">Concluídos</th>
                  <th className="border-b border-[var(--panel-border)] px-4 py-3">Pendentes</th>
                  <th className="border-b border-[var(--panel-border)] px-4 py-3">Vencidos</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.secretaria} className="text-sm transition-colors hover:bg-slate-50">
                    <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 font-semibold text-[var(--text)]">{row.secretaria}</td>
                    <td className="border-b border-[var(--panel-border)]/50 px-4 py-3 font-medium text-[var(--text)]">{row.total}</td>
                    <td className="border-b border-[var(--panel-border)]/50 px-4 py-3"><span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-[var(--success)]">{row.concluidos}</span></td>
                    <td className="border-b border-[var(--panel-border)]/50 px-4 py-3"><span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-[var(--warning)]">{row.pendentes}</span></td>
                    <td className="border-b border-[var(--panel-border)]/50 px-4 py-3"><span className="inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-[var(--danger)]">{row.vencidos}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}

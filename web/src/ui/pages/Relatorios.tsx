import React, { useEffect, useState } from 'react';
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
    <Panel>
      <div className="text-xl font-black text-slate-800">Relatórios Avançados</div>
      <div className="mt-1 text-sm text-slate-500">Visão consolidada por secretaria</div>

      {!rows.length ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">
          Nenhum critério disponível para análise
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-black text-slate-600">
                <th className="border-b border-slate-200 px-3 py-3">Secretaria</th>
                <th className="border-b border-slate-200 px-3 py-3">Total</th>
                <th className="border-b border-slate-200 px-3 py-3">Concluídos</th>
                <th className="border-b border-slate-200 px-3 py-3">Pendentes</th>
                <th className="border-b border-slate-200 px-3 py-3">Vencidos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.secretaria} className="text-sm">
                  <td className="border-b border-slate-100 px-3 py-3 font-semibold text-slate-800">{row.secretaria}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{row.total}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{row.concluidos}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{row.pendentes}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{row.vencidos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

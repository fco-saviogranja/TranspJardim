import React, { useEffect, useState } from 'react';
import { Panel } from '../components/Panel';
import { apiJson } from '../lib/api';

type Metrics = {
  totalCriterios: number;
  criteriosConcluidos: number;
  pendentes: number;
  vencidos: number;
  alertasAtivos: number;
};

export default function Dashboard() {
  const [metricas, setMetricas] = useState<Metrics | null>(null);

  useEffect(() => {
    apiJson<{ metricas: Metrics }>('/api/dashboard')
      .then((d) => setMetricas(d.metricas ?? null))
      .catch(() => setMetricas(null));
  }, []);

  const cards = [
    { label: 'Total de Critérios', value: metricas?.totalCriterios ?? 0 },
    { label: 'Critérios Concluídos', value: metricas?.criteriosConcluidos ?? 0 },
    { label: 'Pendentes', value: metricas?.pendentes ?? 0 },
    { label: 'Vencidos', value: metricas?.vencidos ?? 0 },
    { label: 'Alertas Ativos', value: metricas?.alertasAtivos ?? 0 },
  ];

  return (
    <div className="grid gap-4">
      <Panel>
        <div className="text-xl font-black text-slate-800">Indicadores de Transparência</div>
        <div className="mt-1 text-sm text-slate-500">
          Acompanhe os indicadores e critérios de transparência da Prefeitura de Jardim/CE
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-sm)]">
            <div className="text-xs font-bold text-slate-500">{c.label}</div>
            <div className="mt-2 text-3xl font-black text-slate-800">{c.value}</div>
          </div>
        ))}
      </div>

      <Panel>
        <div className="text-lg font-black text-slate-800">Critérios Prioritários</div>
        <div className="mt-1 text-sm text-slate-500">
          Critérios que requerem atenção imediata ou estão próximos ao vencimento
        </div>
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
          Nenhum critério prioritário no momento
        </div>
      </Panel>

      <Panel>
        <div className="text-lg font-black text-slate-800">Análises Detalhadas</div>
        <div className="mt-1 text-sm text-slate-500">Visualize análises aprofundadas dos critérios e indicadores de transparência</div>
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
          Nenhum critério disponível para análise
        </div>
      </Panel>
    </div>
  );
}

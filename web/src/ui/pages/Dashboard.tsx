import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { Panel } from '../components/Panel';
import { apiJson } from '../lib/api';

type Metrics = {
  totalCriterios: number;
  criteriosConcluidos: number;
  pendentes: number;
  vencidos: number;
  alertasAtivos: number;
};

type CardDef = {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
};

export default function Dashboard() {
  const [metricas, setMetricas] = useState<Metrics | null>(null);

  useEffect(() => {
    apiJson<{ metricas: Metrics }>('/api/dashboard')
      .then((d) => setMetricas(d.metricas ?? null))
      .catch(() => setMetricas(null));
  }, []);

  const cards: CardDef[] = [
    {
      label: 'Total de Critérios',
      value: metricas?.totalCriterios ?? 0,
      icon: FileText,
      color: 'text-[var(--primary)]',
      bgColor: 'bg-[var(--primary-lighter)]',
    },
    {
      label: 'Concluídos',
      value: metricas?.criteriosConcluidos ?? 0,
      icon: CheckCircle2,
      color: 'text-[var(--success)]',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Pendentes',
      value: metricas?.pendentes ?? 0,
      icon: Clock,
      color: 'text-[var(--warning)]',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Vencidos',
      value: metricas?.vencidos ?? 0,
      icon: AlertTriangle,
      color: 'text-[var(--danger)]',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Alertas Ativos',
      value: metricas?.alertasAtivos ?? 0,
      icon: Bell,
      color: 'text-[var(--info)]',
      bgColor: 'bg-sky-50',
    },
  ];

  return (
    <div className="grid gap-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text)]">Indicadores de Transparência</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Acompanhe os critérios de transparência da Prefeitura de Jardim/CE
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, color, bgColor }) => (
          <Panel key={label} className="flex items-start gap-3">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${bgColor}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-muted)]">{label}</div>
              <div className="mt-0.5 text-2xl font-extrabold text-[var(--text)]">{value}</div>
            </div>
          </Panel>
        ))}
      </div>

      {/* Critérios Prioritários */}
      <Panel>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[var(--primary)]" />
          <h3 className="text-base font-bold text-[var(--text)]">Critérios Prioritários</h3>
        </div>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Critérios que requerem atenção imediata ou estão próximos ao vencimento
        </p>
        <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--panel-border)] bg-[var(--bg)] py-12">
          <Clock className="h-8 w-8 text-[var(--text-muted)]" />
          <span className="mt-2 text-sm text-[var(--text-muted)]">Nenhum critério prioritário no momento</span>
        </div>
      </Panel>

      {/* Análises */}
      <Panel>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[var(--primary)]" />
          <h3 className="text-base font-bold text-[var(--text)]">Análises Detalhadas</h3>
        </div>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Visualize análises aprofundadas dos critérios e indicadores
        </p>
        <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--panel-border)] bg-[var(--bg)] py-12">
          <FileText className="h-8 w-8 text-[var(--text-muted)]" />
          <span className="mt-2 text-sm text-[var(--text-muted)]">Nenhum critério disponível para análise</span>
        </div>
      </Panel>
    </div>
  );
}
